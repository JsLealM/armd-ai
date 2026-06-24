import json
from pathlib import Path

import psycopg2
from psycopg2.extensions import connection as PgConnection
from psycopg2.extras import RealDictCursor

from .config import DATABASE_URL, SCHEMA_PATH
from .feature_spec import COMORB_INPUTS, EXP_PREV_INPUTS
from .schemas import PredictionRequest, PredictionResponse


EXPOSURE_FIELDS = EXP_PREV_INPUTS
COMORBIDITY_FIELDS = COMORB_INPUTS


def get_connection() -> PgConnection:
    return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)


def initialize_database(schema_path: Path = SCHEMA_PATH) -> None:
    with get_connection() as conn:
        with conn.cursor() as cursor:
            if not _schema_exists(cursor):
                cursor.execute(schema_path.read_text(encoding="utf-8"))
        conn.commit()


def save_prediction(request: PredictionRequest, response: PredictionResponse) -> int:
    request_payload = request.model_dump()
    response_payload = response.model_dump()

    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO prediccion (
                    session_id, paciente_referencia, organismo, antibiotico, tipo_cultivo, ordering_mode, edad, sexo,
                    hosp_ward_icu, hosp_ward_er, hosp_ward_ip, hosp_ward_op,
                    adi_score, adi_state_rank,
                    median_wbc, median_neutrophils, median_lymphocytes, median_cr, median_bun,
                    median_lactate, median_procalcitonin, median_temp, median_heartrate,
                    median_resprate, median_sysbp, median_diasbp,
                    modelo_nombre, modelo_version, clase_predicha,
                    probabilidad_susceptible, probabilidad_resistant, nivel_confianza,
                    metodo_explicacion, request_json, response_json
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING prediccion_id
                """,
                (
                    request.session_id,
                    request.paciente_referencia,
                    request.organism,
                    request.antibiotic,
                    request.culture_description,
                    request.ordering_mode,
                    request.age,
                    request.gender,
                    int(request.hosp_ward_ICU),
                    int(request.hosp_ward_ER),
                    int(request.hosp_ward_IP),
                    int(request.hosp_ward_OP),
                    request.adi_score,
                    request.adi_state_rank,
                    request.median_wbc,
                    request.median_neutrophils,
                    request.median_lymphocytes,
                    request.median_cr,
                    request.median_bun,
                    request.median_lactate,
                    request.median_procalcitonin,
                    request.median_temp,
                    request.median_heartrate,
                    request.median_resprate,
                    request.median_sysbp,
                    request.median_diasbp,
                    response.model_name,
                    response.model_version,
                    response.predicted_class,
                    response.susceptible_probability,
                    response.resistant_probability,
                    response.confidence_level,
                    response.explanation_method,
                    json.dumps(request_payload, ensure_ascii=False),
                    json.dumps(response_payload, ensure_ascii=False),
                ),
            )
            prediccion_id = int(cursor.fetchone()["prediccion_id"])
            _save_selected_flags(cursor, prediccion_id, "exposicion_antibiotica_catalogo", "prediccion_exposicion_antibiotica", "exposicion_id", EXPOSURE_FIELDS, request_payload)
            _save_selected_flags(cursor, prediccion_id, "comorbilidad_catalogo", "prediccion_comorbilidad", "comorbilidad_id", COMORBIDITY_FIELDS, request_payload)
            for shap_value in response.shap_values:
                cursor.execute(
                    """
                    INSERT INTO shap_valor (prediccion_id, variable, valor_variable, shap_value, direccion, ranking)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    """,
                    (
                        prediccion_id,
                        shap_value.variable,
                        None if shap_value.value is None else str(shap_value.value),
                        shap_value.shap_value,
                        shap_value.direction,
                        shap_value.ranking,
                    ),
                )
        conn.commit()
        return prediccion_id


def list_history(limit: int = 50) -> list[dict]:
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    prediccion_id,
                    created_at,
                    organismo AS organism,
                    antibiotico AS antibiotic,
                    tipo_cultivo AS culture_description,
                    clase_predicha AS predicted_class,
                    probabilidad_susceptible AS susceptible_probability,
                    probabilidad_resistant AS resistant_probability,
                    modelo_nombre AS model_name,
                    modelo_version AS model_version
                FROM prediccion
                ORDER BY created_at DESC
                LIMIT %s
                """,
                (limit,),
            )
            rows = cursor.fetchall()
            return [_serialize_row(dict(row)) for row in rows]


def get_prediction(prediccion_id: int) -> dict | None:
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM prediccion WHERE prediccion_id = %s", (prediccion_id,))
            row = cursor.fetchone()
            if row is None:
                return None
            cursor.execute(
                """
                SELECT variable, valor_variable AS value, shap_value, direccion AS direction, ranking
                FROM shap_valor
                WHERE prediccion_id = %s
                ORDER BY ranking ASC
                """,
                (prediccion_id,),
            )
            shap_rows = cursor.fetchall()
            item = _serialize_row(dict(row))
            item["shap_values"] = [_serialize_row(dict(shap_row)) for shap_row in shap_rows]
            return item


def _schema_exists(cursor) -> bool:
    cursor.execute("SELECT to_regclass('public.prediccion') AS tabla")
    row = cursor.fetchone()
    return bool(row) and row["tabla"] is not None


def _serialize_row(row: dict) -> dict:
    """Convierte tipos de PostgreSQL no serializables (datetime, Decimal) a JSON-friendly."""
    import datetime
    from decimal import Decimal

    serialized = {}
    for key, value in row.items():
        if isinstance(value, datetime.datetime):
            serialized[key] = value.isoformat()
        elif isinstance(value, Decimal):
            serialized[key] = float(value)
        else:
            serialized[key] = value
    return serialized


def _save_selected_flags(
    cursor,
    prediccion_id: int,
    catalog_table: str,
    relation_table: str,
    catalog_id_column: str,
    fields: list[str],
    payload: dict,
) -> None:
    for field in fields:
        if not payload.get(field):
            continue
        cursor.execute(f"SELECT {catalog_id_column} FROM {catalog_table} WHERE codigo = %s", (field,))
        row = cursor.fetchone()
        if row is None:
            continue
        cursor.execute(
            f"INSERT INTO {relation_table} (prediccion_id, {catalog_id_column}, presente) "
            f"VALUES (%s, %s, 1) ON CONFLICT DO NOTHING",
            (prediccion_id, row[catalog_id_column]),
        )
