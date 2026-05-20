from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd


RUTA_PROYECTO = Path(__file__).resolve().parents[1]
RUTA_PROCESADOS = RUTA_PROYECTO / "3.DATOS-PROCESADOS"
RUTA_SALIDA = RUTA_PROYECTO / "2.VISUALIZACION-DATOS" / "EXPOSICION"

RUTA_BASE = RUTA_PROCESADOS / "armd_s_aureus_base_limpia.csv"
RUTA_REPORTE = RUTA_PROCESADOS / "reporte_faltantes_semanticos.csv"
RUTA_GRAFICA = RUTA_SALIDA / "expo_11_faltantes_semanticos.png"

RUTA_SALIDA.mkdir(parents=True, exist_ok=True)

ETIQUETAS_FALTANTE_SEMANTICO = {"SIN_REGISTRO", "SIN_REGLA"}

plt.style.use("seaborn-v0_8-whitegrid")
plt.rcParams["figure.dpi"] = 140
plt.rcParams["savefig.dpi"] = 220
plt.rcParams["axes.titlesize"] = 16
plt.rcParams["axes.labelsize"] = 12

COLORES = {
    "cobertura": "#2a9d8f",
    "semantico": "#f4a261",
    "na_real": "#d62828",
}


def calcular_reporte(df: pd.DataFrame) -> pd.DataFrame:
    filas = []

    for columna in df.columns:
        serie = df[columna]
        porcentaje_na_real = float(serie.isna().mean() * 100)

        if pd.api.types.is_object_dtype(serie) or pd.api.types.is_string_dtype(serie):
            porcentaje_faltante_semantico = float(
                serie.astype("string").isin(ETIQUETAS_FALTANTE_SEMANTICO).mean() * 100
            )
        else:
            porcentaje_faltante_semantico = 0.0

        porcentaje_cobertura_real = 100.0 - porcentaje_na_real - porcentaje_faltante_semantico
        porcentaje_cobertura_real = max(0.0, porcentaje_cobertura_real)

        filas.append(
            {
                "variable": columna,
                "porcentaje_na_real": round(porcentaje_na_real, 2),
                "porcentaje_faltante_semantico": round(porcentaje_faltante_semantico, 2),
                "porcentaje_cobertura_real": round(porcentaje_cobertura_real, 2),
            }
        )

    return pd.DataFrame(filas).sort_values(
        ["porcentaje_cobertura_real", "porcentaje_faltante_semantico", "porcentaje_na_real"],
        ascending=[True, False, False],
    )


def generar_grafica(df_reporte: pd.DataFrame) -> None:
    df_plot = df_reporte.head(10).copy()
    y = np.arange(len(df_plot))

    fig, ax = plt.subplots(figsize=(12, 7))
    ax.barh(y, df_plot["porcentaje_cobertura_real"], color=COLORES["cobertura"], label="Cobertura real")
    ax.barh(
        y,
        df_plot["porcentaje_faltante_semantico"],
        left=df_plot["porcentaje_cobertura_real"],
        color=COLORES["semantico"],
        label="Faltante semantico",
    )
    ax.barh(
        y,
        df_plot["porcentaje_na_real"],
        left=df_plot["porcentaje_cobertura_real"] + df_plot["porcentaje_faltante_semantico"],
        color=COLORES["na_real"],
        label="NaN real",
    )

    ax.set_yticks(y)
    ax.set_yticklabels(df_plot["variable"])
    ax.set_xlabel("Porcentaje")
    ax.set_ylabel("Variable")
    ax.set_title("Cobertura real vs faltantes semanticos")
    ax.legend()
    ax.invert_yaxis()

    fig.tight_layout()
    fig.savefig(RUTA_GRAFICA, bbox_inches="tight")
    plt.close(fig)


def main() -> None:
    df = pd.read_csv(RUTA_BASE, low_memory=False)
    df_reporte = calcular_reporte(df)
    df_reporte.to_csv(RUTA_REPORTE, index=False)
    generar_grafica(df_reporte)

    print("Reporte generado:", RUTA_REPORTE)
    print("Grafica generada:", RUTA_GRAFICA)


if __name__ == "__main__":
    main()
