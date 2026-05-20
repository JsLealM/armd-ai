from __future__ import annotations

import csv
from pathlib import Path

import pandas as pd


RUTA_PROYECTO = Path(__file__).resolve().parents[1]
RUTA_DATOS = RUTA_PROYECTO / "data"
RUTA_PROCESADOS = RUTA_PROYECTO / "3.DATOS-PROCESADOS"

RUTA_BASE_LIMPIA = RUTA_PROCESADOS / "armd_s_aureus_base_limpia.csv"
RUTA_BASE_MULTIHOT_ABX = RUTA_PROCESADOS / "armd_s_aureus_base_modelado_multihot_abx.csv"
RUTA_COMORB = RUTA_DATOS / "microbiology_cultures_comorbidity.csv"

RUTA_DATASET_MULTIHOT_COMORB = RUTA_PROCESADOS / "armd_s_aureus_base_modelado_multihot_comorb.csv"
RUTA_DATASET_MULTIHOT_ABX_COMORB = RUTA_PROCESADOS / "armd_s_aureus_base_modelado_multihot_abx_comorb.csv"

RUTA_MANIFIESTO_MULTIHOT_COMORB = RUTA_PROCESADOS / "manifiesto_modelado_multihot_comorb.csv"
RUTA_MANIFIESTO_MULTIHOT_ABX_COMORB = RUTA_PROCESADOS / "manifiesto_modelado_multihot_abx_comorb.csv"

RUTA_CATALOGO_GRUPOS_COMORB = RUTA_PROCESADOS / "catalogo_grupos_comorbilidades.csv"
RUTA_COBERTURA_GRUPOS_COMORB = RUTA_PROCESADOS / "cobertura_grupos_comorbilidades.csv"


MAPA_GRUPOS_COMORB = {
    "comorb_congestive_heart_failure": [
        "Congestive heart failure",
    ],
    "comorb_organ_transplant_status": [
        "Organ transplant status",
    ],
    "comorb_diabetes_any": [
        "Diabetes mellitus without complication",
        "Diabetes, complicated",
        "Diabetes, uncomplicated",
    ],
    "comorb_solid_tumor_non_metastatic": [
        "Solid tumor without metastasis",
    ],
    "comorb_chronic_pulmonary_any": [
        "Chronic pulmonary disease",
        "Chronic obstructive pulmonary disease and bronchiectasis",
    ],
    "comorb_renal_failure": [
        "Renal failure",
    ],
    "comorb_pancreatic_disorder": [
        "Pancreatic disorders (excluding diabetes)",
    ],
    "comorb_sinusitis": [
        "Sinusitis",
    ],
}


def construir_catalogo_grupos() -> pd.DataFrame:
    filas = []
    for grupo, componentes in MAPA_GRUPOS_COMORB.items():
        for componente in componentes:
            filas.append(
                {
                    "grupo_multihot": grupo,
                    "comorbidity_component_original": componente,
                }
            )
    return pd.DataFrame(filas)


def construir_matriz_multihot_comorb(ordenes_objetivo: set[str]) -> tuple[pd.DataFrame, pd.DataFrame]:
    columnas_grupo = list(MAPA_GRUPOS_COMORB.keys())
    orden_a_flags: dict[str, dict[str, int]] = {}

    componente_a_grupo = {}
    for grupo, componentes in MAPA_GRUPOS_COMORB.items():
        for componente in componentes:
            componente_a_grupo[componente] = grupo

    with RUTA_COMORB.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            orden = str(row.get("order_proc_id_coded"))
            if orden not in ordenes_objetivo:
                continue

            componente = row.get("comorbidity_component")
            grupo = componente_a_grupo.get(componente)
            if grupo is None:
                continue

            if orden not in orden_a_flags:
                orden_a_flags[orden] = {columna: 0 for columna in columnas_grupo}
            orden_a_flags[orden][grupo] = 1

    filas = []
    for orden, flags in orden_a_flags.items():
        fila = {"order_proc_id_coded": orden}
        fila.update(flags)
        filas.append(fila)

    df_multihot = pd.DataFrame(filas)
    if df_multihot.empty:
        df_multihot = pd.DataFrame(columns=["order_proc_id_coded"] + columnas_grupo)

    for columna in columnas_grupo:
        if columna not in df_multihot.columns:
            df_multihot[columna] = 0

    df_multihot = df_multihot[["order_proc_id_coded"] + columnas_grupo].copy()

    df_cobertura = pd.DataFrame(
        [
            {
                "grupo_multihot": columna,
                "ordenes_con_valor_1": int(df_multihot[columna].sum()) if not df_multihot.empty else 0,
                "porcentaje_ordenes_con_valor_1": round(
                    float(df_multihot[columna].mean() * 100), 2
                )
                if not df_multihot.empty
                else 0.0,
            }
            for columna in columnas_grupo
        ]
    )

    return df_multihot, df_cobertura


def cargar_base_reducida() -> pd.DataFrame:
    df = pd.read_csv(RUTA_BASE_LIMPIA)
    df["order_proc_id_coded"] = df["order_proc_id_coded"].astype("string")

    columnas = [
        "anon_id",
        "pat_enc_csn_id_coded",
        "order_proc_id_coded",
        "order_time_jittered_utc",
        "antibiotic",
        "culture_description",
        "age",
        "gender",
        "hosp_ward_ICU",
        "hosp_ward_ER",
        "hosp_ward_IP",
        "hosp_ward_OP",
        "ordering_mode",
        "procedure_name",
        "median_wbc",
        "median_cr",
        "susceptibility",
    ]
    df = df[columnas].copy()
    df["ordering_mode"] = df["ordering_mode"].fillna("SIN_REGISTRO")
    df["procedure_name"] = df["procedure_name"].fillna("SIN_REGISTRO")
    return df


def construir_dataset_multihot_comorb(df_multihot_comorb: pd.DataFrame) -> pd.DataFrame:
    df_base = cargar_base_reducida()
    df_final = df_base.merge(df_multihot_comorb, on="order_proc_id_coded", how="left")

    columnas_comorb = list(MAPA_GRUPOS_COMORB.keys())
    for columna in columnas_comorb:
        df_final[columna] = df_final[columna].fillna(0).astype("int8")

    return df_final


def construir_dataset_multihot_abx_comorb(df_multihot_comorb: pd.DataFrame) -> pd.DataFrame:
    df_base = pd.read_csv(RUTA_BASE_MULTIHOT_ABX, low_memory=False)
    df_base["order_proc_id_coded"] = df_base["order_proc_id_coded"].astype("string")
    df_final = df_base.merge(df_multihot_comorb, on="order_proc_id_coded", how="left")

    columnas_comorb = list(MAPA_GRUPOS_COMORB.keys())
    for columna in columnas_comorb:
        df_final[columna] = df_final[columna].fillna(0).astype("int8")

    return df_final


def construir_manifiesto(df: pd.DataFrame, incluir_abx: bool) -> pd.DataFrame:
    filas = [
        {"variable": "anon_id", "rol": "identificador", "entra_como_predictor": 0},
        {"variable": "pat_enc_csn_id_coded", "rol": "identificador", "entra_como_predictor": 0},
        {"variable": "order_proc_id_coded", "rol": "identificador", "entra_como_predictor": 0},
        {"variable": "order_time_jittered_utc", "rol": "temporal_para_split", "entra_como_predictor": 0},
        {"variable": "antibiotic", "rol": "predictor_base", "entra_como_predictor": 1},
        {"variable": "culture_description", "rol": "predictor_base", "entra_como_predictor": 1},
        {"variable": "age", "rol": "predictor_base", "entra_como_predictor": 1},
        {"variable": "gender", "rol": "predictor_base", "entra_como_predictor": 1},
        {"variable": "hosp_ward_ICU", "rol": "predictor_base", "entra_como_predictor": 1},
        {"variable": "hosp_ward_ER", "rol": "predictor_base", "entra_como_predictor": 1},
        {"variable": "hosp_ward_IP", "rol": "predictor_base", "entra_como_predictor": 1},
        {"variable": "hosp_ward_OP", "rol": "predictor_base", "entra_como_predictor": 1},
        {"variable": "ordering_mode", "rol": "predictor_ampliado", "entra_como_predictor": 1},
        {"variable": "procedure_name", "rol": "predictor_ampliado", "entra_como_predictor": 1},
        {"variable": "median_wbc", "rol": "predictor_ampliado", "entra_como_predictor": 1},
        {"variable": "median_cr", "rol": "predictor_ampliado", "entra_como_predictor": 1},
    ]

    if incluir_abx:
        columnas_abx = sorted([col for col in df.columns if col.startswith("exp_prev_")])
        for columna in columnas_abx:
            filas.append(
                {
                    "variable": columna,
                    "rol": "predictor_multihot_exposicion_antibiotica",
                    "entra_como_predictor": 1,
                }
            )

    for columna in MAPA_GRUPOS_COMORB.keys():
        filas.append(
            {
                "variable": columna,
                "rol": "predictor_multihot_comorbilidad",
                "entra_como_predictor": 1,
            }
        )

    filas.append({"variable": "susceptibility", "rol": "objetivo", "entra_como_predictor": 0})
    return pd.DataFrame(filas)


def main() -> None:
    ordenes = set(cargar_base_reducida()["order_proc_id_coded"].astype("string"))
    df_multihot_comorb, df_cobertura = construir_matriz_multihot_comorb(ordenes)
    df_catalogo = construir_catalogo_grupos()

    df_modelado_comorb = construir_dataset_multihot_comorb(df_multihot_comorb)
    df_modelado_abx_comorb = construir_dataset_multihot_abx_comorb(df_multihot_comorb)

    manifiesto_comorb = construir_manifiesto(df_modelado_comorb, incluir_abx=False)
    manifiesto_abx_comorb = construir_manifiesto(df_modelado_abx_comorb, incluir_abx=True)

    df_modelado_comorb.to_csv(RUTA_DATASET_MULTIHOT_COMORB, index=False)
    df_modelado_abx_comorb.to_csv(RUTA_DATASET_MULTIHOT_ABX_COMORB, index=False)
    manifiesto_comorb.to_csv(RUTA_MANIFIESTO_MULTIHOT_COMORB, index=False)
    manifiesto_abx_comorb.to_csv(RUTA_MANIFIESTO_MULTIHOT_ABX_COMORB, index=False)
    df_catalogo.to_csv(RUTA_CATALOGO_GRUPOS_COMORB, index=False)
    df_cobertura.to_csv(RUTA_COBERTURA_GRUPOS_COMORB, index=False)

    print("Dataset generado:", RUTA_DATASET_MULTIHOT_COMORB)
    print("Dataset generado:", RUTA_DATASET_MULTIHOT_ABX_COMORB)
    print("Manifiesto generado:", RUTA_MANIFIESTO_MULTIHOT_COMORB)
    print("Manifiesto generado:", RUTA_MANIFIESTO_MULTIHOT_ABX_COMORB)
    print("Catalogo generado:", RUTA_CATALOGO_GRUPOS_COMORB)
    print("Cobertura generada:", RUTA_COBERTURA_GRUPOS_COMORB)
    print("Columnas multihot comorb:", len(MAPA_GRUPOS_COMORB))


if __name__ == "__main__":
    main()
