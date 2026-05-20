from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
PROCESADOS = ROOT / "3.DATOS-PROCESADOS"
SALIDA = ROOT / "2.VISUALIZACION-DATOS" / "EXPOSICION"
SALIDA.mkdir(parents=True, exist_ok=True)

plt.style.use("seaborn-v0_8-whitegrid")
MAPA_PUNTAJE_SUSC = {"Susceptible": 0.0, "Intermediate": 0.5, "Resistant": 1.0}


def guardar(fig, nombre: str) -> None:
    fig.tight_layout()
    fig.savefig(SALIDA / nombre, dpi=220, bbox_inches="tight")
    plt.close(fig)


def cargar_csv(nombre: str) -> pd.DataFrame:
    return pd.read_csv(PROCESADOS / nombre)


def grafica_resumen_limpieza() -> None:
    df = cargar_csv("resumen_filas_antes_despues.csv")
    fig, ax = plt.subplots(figsize=(8, 5))
    ax.bar(df["etapa"], df["filas"], color=["#2a9d8f", "#e76f51"])
    ax.set_title("Registros antes y despues de la limpieza")
    ax.set_ylabel("Numero de filas")
    for i, v in enumerate(df["filas"]):
        ax.text(i, v, f"{int(v):,}", ha="center", va="bottom")
    guardar(fig, "expo_01_resumen_limpieza.png")


def grafica_objetivo() -> None:
    df = cargar_csv("tabla_susceptibilidad_antes_despues.csv")
    pivot = df.pivot(index="susceptibility", columns="etapa", values="conteo").fillna(0)
    pivot = pivot.reindex(["Susceptible", "Intermediate", "Resistant", "Inconclusive"])
    fig, ax = plt.subplots(figsize=(9, 5))
    pivot.plot(kind="bar", ax=ax, color=["#577590", "#f9844a"])
    ax.set_title("Distribucion de susceptibility antes y despues")
    ax.set_ylabel("Conteo")
    ax.set_xlabel("")
    ax.tick_params(axis="x", rotation=20)
    guardar(fig, "expo_02_objetivo_antes_despues.png")


def grafica_nulos() -> None:
    df = cargar_csv("comparacion_nulos.csv").sort_values("nulos_antes_pct", ascending=False).head(10)
    fig, ax = plt.subplots(figsize=(10, 6))
    y = range(len(df))
    ax.barh([i + 0.18 for i in y], df["nulos_antes_pct"], height=0.35, label="Antes", color="#8d99ae")
    ax.barh([i - 0.18 for i in y], df["nulos_despues_pct"], height=0.35, label="Despues", color="#ef476f")
    ax.set_yticks(list(y))
    ax.set_yticklabels(df["variable"])
    ax.invert_yaxis()
    ax.set_xlabel("% nulos")
    ax.set_title("Variables con mas nulos antes y despues")
    ax.legend()
    guardar(fig, "expo_03_nulos_antes_despues.png")


def grafica_decision_variables() -> None:
    df = cargar_csv("verificacion_variables_modelado.csv")
    conteo = df["decision_modelado"].value_counts()
    fig, ax = plt.subplots(figsize=(8, 5))
    conteo.plot(kind="bar", ax=ax, color=["#2a9d8f", "#e9c46a", "#e76f51"])
    ax.set_title("Decision metodologica sobre variables")
    ax.set_ylabel("Numero de variables")
    ax.set_xlabel("")
    ax.tick_params(axis="x", rotation=15)
    guardar(fig, "expo_04_decision_variables.png")


def grafica_boxplot(df: pd.DataFrame, columna: str, nombre: str, titulo: str) -> None:
    serie = pd.to_numeric(df[columna], errors="coerce").dropna()
    if serie.empty:
        return
    fig, ax = plt.subplots(figsize=(8, 4.5))
    ax.boxplot(serie, vert=False, patch_artist=True, boxprops={"facecolor": "#90be6d"})
    ax.set_title(titulo)
    ax.set_xlabel(columna)
    guardar(fig, nombre)


def grafica_top_antibioticos() -> None:
    df = cargar_csv("tabla_top_antibioticos_limpios.csv").head(10)
    fig, ax = plt.subplots(figsize=(10, 5))
    ax.barh(df["antibiotic"], df["conteo"], color="#577590")
    ax.invert_yaxis()
    ax.set_title("Antibioticos mas frecuentes")
    ax.set_xlabel("Conteo")
    guardar(fig, "expo_07_top_antibioticos.png")


def grafica_cultivo_vs_susc(df: pd.DataFrame) -> None:
    tabla = pd.crosstab(df["culture_description"], df["susceptibility"], normalize="index") * 100
    tabla = tabla.sort_values("Resistant", ascending=False).head(10)
    fig, ax = plt.subplots(figsize=(10, 6))
    tabla[["Susceptible", "Intermediate", "Resistant"]].plot(
        kind="bar", stacked=True, ax=ax, color=["#2a9d8f", "#e9c46a", "#e76f51"]
    )
    ax.set_title("Susceptibility por tipo de cultivo")
    ax.set_ylabel("% dentro de cada cultivo")
    ax.set_xlabel("")
    ax.tick_params(axis="x", rotation=25)
    guardar(fig, "expo_08_cultivo_vs_susceptibilidad.png")


def grafica_edad_vs_susc(df: pd.DataFrame) -> None:
    edad = pd.to_numeric(df["age"], errors="coerce")
    bins = [0, 18, 40, 60, 80, 120]
    labels = ["0-17", "18-39", "40-59", "60-79", "80+"]
    temp = df.copy()
    temp["grupo_edad"] = pd.cut(edad, bins=bins, labels=labels, include_lowest=True)
    tabla = pd.crosstab(temp["grupo_edad"], temp["susceptibility"], normalize="index") * 100
    fig, ax = plt.subplots(figsize=(9, 5))
    tabla[["Susceptible", "Intermediate", "Resistant"]].plot(
        kind="bar", ax=ax, color=["#2a9d8f", "#e9c46a", "#e76f51"]
    )
    ax.set_title("Distribucion de susceptibility por grupos de edad")
    ax.set_ylabel("% dentro del grupo")
    ax.set_xlabel("")
    ax.tick_params(axis="x", rotation=0)
    guardar(fig, "expo_09_edad_vs_susceptibilidad.png")


def grafica_entorno(df: pd.DataFrame) -> None:
    cols = ["hosp_ward_ICU", "hosp_ward_ER", "hosp_ward_IP", "hosp_ward_OP"]
    etiquetas = ["ICU", "ER", "IP", "OP"]
    valores = [pd.to_numeric(df[c], errors="coerce").fillna(0).mean() * 100 for c in cols if c in df.columns]
    fig, ax = plt.subplots(figsize=(8, 5))
    ax.bar(etiquetas[: len(valores)], valores, color="#4d908e")
    ax.set_title("Presencia de entornos hospitalarios")
    ax.set_ylabel("% de registros con marca positiva")
    guardar(fig, "expo_10_entorno_hospitalario.png")


def grafica_faltantes_semanticos() -> None:
    ruta = PROCESADOS / "reporte_faltantes_semanticos.csv"
    if not ruta.exists():
        return
    df = pd.read_csv(ruta).sort_values("porcentaje_faltante_semantico", ascending=False).head(10)
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.barh(df["variable"], df["porcentaje_faltante_semantico"], color="#f4a261")
    ax.invert_yaxis()
    ax.set_title("Top variables con faltantes semanticos")
    ax.set_xlabel("% faltante semantico")
    guardar(fig, "expo_11_faltantes_semanticos.png")


def grafica_tendencia(df: pd.DataFrame, columna: str, nombre: str, titulo: str, bins=5) -> None:
    serie = pd.to_numeric(df[columna], errors="coerce")
    temp = df.loc[serie.notna(), [columna, "susceptibility"]].copy()
    if temp.empty:
        return
    temp[columna] = pd.to_numeric(temp[columna], errors="coerce")
    temp = temp.dropna()
    if temp.empty:
        return
    temp["puntaje"] = temp["susceptibility"].map(MAPA_PUNTAJE_SUSC)
    temp["tramo"] = pd.qcut(temp[columna], q=min(bins, temp[columna].nunique()), duplicates="drop")
    resumen = temp.groupby("tramo", observed=False)["puntaje"].mean().reset_index()
    resumen["etiqueta"] = resumen["tramo"].astype(str)
    fig, ax = plt.subplots(figsize=(10, 4.8))
    ax.plot(resumen["etiqueta"], resumen["puntaje"], marker="o", color="#d62828")
    ax.set_title(titulo)
    ax.set_ylabel("Indice medio de resistencia")
    ax.set_xlabel(columna)
    ax.tick_params(axis="x", rotation=25)
    ax.set_ylim(-0.05, 1.05)
    guardar(fig, nombre)


def main() -> None:
    df = cargar_csv("armd_s_aureus_base_limpia.csv")
    grafica_resumen_limpieza()
    grafica_objetivo()
    grafica_nulos()
    grafica_decision_variables()
    grafica_boxplot(df, "median_wbc", "expo_05_boxplot_median_wbc.png", "Boxplot de median_wbc")
    grafica_boxplot(df, "median_cr", "expo_06_boxplot_median_cr.png", "Boxplot de median_cr")
    grafica_top_antibioticos()
    grafica_cultivo_vs_susc(df)
    grafica_edad_vs_susc(df)
    grafica_entorno(df)
    grafica_faltantes_semanticos()
    grafica_tendencia(df, "age", "expo_12_tendencia_edad_resistencia.png", "Tendencia de resistencia por edad")
    grafica_tendencia(df, "median_wbc", "expo_13_tendencia_wbc_resistencia.png", "Tendencia de resistencia por median_wbc")
    grafica_tendencia(df, "median_cr", "expo_14_tendencia_cr_resistencia.png", "Tendencia de resistencia por median_cr")
    print("Graficas generadas en:", SALIDA)


if __name__ == "__main__":
    main()
