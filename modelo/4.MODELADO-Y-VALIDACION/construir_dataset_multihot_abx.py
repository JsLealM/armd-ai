from __future__ import annotations

import re
import unicodedata
from pathlib import Path

import pandas as pd


RUTA_PROYECTO = Path(__file__).resolve().parents[1]
RUTA_DATOS = RUTA_PROYECTO / "data"
RUTA_PROCESADOS = RUTA_PROYECTO / "3.DATOS-PROCESADOS"

RUTA_BASE_LIMPIA = RUTA_PROCESADOS / "armd_s_aureus_base_limpia.csv"
RUTA_EXPOSICION_ABX = RUTA_DATOS / "microbiology_cultures_antibiotic_class_exposure.csv"

RUTA_SALIDA_DATASET = RUTA_PROCESADOS / "armd_s_aureus_base_modelado_multihot_abx.csv"
RUTA_SALIDA_MANIFIESTO = RUTA_PROCESADOS / "manifiesto_modelado_multihot_abx.csv"
RUTA_SALIDA_CATALOGO = RUTA_PROCESADOS / "catalogo_clases_antibioticas_multihot.csv"


def normalizar_texto(texto: str) -> str:
    """Convierte un texto a un formato estable para nombres de columnas."""
    texto = unicodedata.normalize("NFKD", texto)
    texto = texto.encode("ascii", "ignore").decode("ascii")
    texto = texto.lower().strip()
    texto = texto.replace("&", " y ")
    texto = re.sub(r"[^a-z0-9]+", "_", texto)
    texto = re.sub(r"_+", "_", texto)
    return texto.strip("_")


def construir_matriz_multihot(df_exposicion: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
    """
    Construye una matriz multihot por clase antibiotica previa.

    Cada fila representa una `order_proc_id_coded` y cada columna indica
    si el paciente tuvo o no una exposicion previa a esa clase antibiotica.
    """
    df = df_exposicion.copy()
    df["antibiotic_class"] = df["antibiotic_class"].astype("string").str.strip()
    mascara_valida = df["antibiotic_class"].notna() & ~df["antibiotic_class"].str.lower().isin(["", "null"])
    df = df.loc[mascara_valida, ["order_proc_id_coded", "antibiotic_class"]].copy()
    df = df.drop_duplicates()

    catalogo = (
        df["antibiotic_class"]
        .value_counts()
        .rename_axis("clase_original")
        .reset_index(name="frecuencia_filas_exposicion")
    )
    catalogo["columna_multihot"] = catalogo["clase_original"].map(
        lambda x: f"exp_prev_{normalizar_texto(str(x))}"
    )

    df["columna_multihot"] = df["antibiotic_class"].map(lambda x: f"exp_prev_{normalizar_texto(str(x))}")

    matriz = pd.crosstab(df["order_proc_id_coded"], df["columna_multihot"])
    matriz = matriz.clip(upper=1).astype("int8").reset_index()

    return matriz, catalogo


def construir_dataset_final() -> tuple[pd.DataFrame, pd.DataFrame]:
    """
    Construye un dataset de modelado experimental con exposicion antibiotica multihot.

    Regla metodologica aplicada:
    - mantener la base de variables solidas del proyecto
    - conservar variables ampliadas no temporales ya aceptadas
    - reemplazar `antibiotic_class` y `time_to_culturetime`
      por columnas binarias multihot por clase antibiotica previa
    """
    df_base = pd.read_csv(RUTA_BASE_LIMPIA)
    df_base["order_proc_id_coded"] = df_base["order_proc_id_coded"].astype("string")

    columnas_base = [
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
    df_base = df_base[columnas_base].copy()

    df_exposicion = pd.read_csv(
        RUTA_EXPOSICION_ABX,
        usecols=["order_proc_id_coded", "antibiotic_class"],
        dtype={"order_proc_id_coded": "string", "antibiotic_class": "string"},
    )
    df_exposicion = df_exposicion.loc[
        df_exposicion["order_proc_id_coded"].isin(df_base["order_proc_id_coded"].astype("string"))
    ].copy()

    df_multihot, df_catalogo = construir_matriz_multihot(df_exposicion)

    df_final = df_base.merge(df_multihot, on="order_proc_id_coded", how="left")

    columnas_multihot = sorted([col for col in df_final.columns if col.startswith("exp_prev_")])
    for columna in columnas_multihot:
        df_final[columna] = df_final[columna].fillna(0).astype("int8")

    df_final["ordering_mode"] = df_final["ordering_mode"].fillna("SIN_REGISTRO")
    df_final["procedure_name"] = df_final["procedure_name"].fillna("SIN_REGISTRO")

    return df_final, df_catalogo


def construir_manifiesto(columnas_multihot: list[str]) -> pd.DataFrame:
    """Crea un manifiesto simple con el rol de cada columna del dataset final."""
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

    for columna in columnas_multihot:
        filas.append(
            {
                "variable": columna,
                "rol": "predictor_multihot_exposicion_antibiotica",
                "entra_como_predictor": 1,
            }
        )

    filas.append({"variable": "susceptibility", "rol": "objetivo", "entra_como_predictor": 0})
    return pd.DataFrame(filas)


def main() -> None:
    df_final, df_catalogo = construir_dataset_final()
    columnas_multihot = sorted([col for col in df_final.columns if col.startswith("exp_prev_")])
    df_manifiesto = construir_manifiesto(columnas_multihot)

    df_final.to_csv(RUTA_SALIDA_DATASET, index=False)
    df_manifiesto.to_csv(RUTA_SALIDA_MANIFIESTO, index=False)
    df_catalogo.to_csv(RUTA_SALIDA_CATALOGO, index=False)

    print("Dataset generado:", RUTA_SALIDA_DATASET)
    print("Manifiesto generado:", RUTA_SALIDA_MANIFIESTO)
    print("Catalogo generado:", RUTA_SALIDA_CATALOGO)
    print("Filas del dataset final:", len(df_final))
    print("Columnas multihot creadas:", len(columnas_multihot))
    print("Primeras columnas multihot:", columnas_multihot[:10])


if __name__ == "__main__":
    main()
