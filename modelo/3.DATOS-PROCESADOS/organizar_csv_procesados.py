from __future__ import annotations

from pathlib import Path
import shutil


RUTA_PROCESADOS = Path(__file__).resolve().parent


ESTRUCTURA = {
    "01_BASE_LIMPIA": [
        ("armd_s_aureus_base_limpia.csv", "01_armd_s_aureus_base_limpia.csv"),
    ],
    "02_ANALISIS_Y_CALIDAD": [
        ("resumen_filas_antes_despues.csv", "01_resumen_filas_antes_despues.csv"),
        ("tabla_susceptibilidad_antes_despues.csv", "02_tabla_susceptibilidad_antes_despues.csv"),
        ("comparacion_nulos.csv", "03_comparacion_nulos.csv"),
        ("reporte_faltantes_semanticos.csv", "04_reporte_faltantes_semanticos.csv"),
        ("verificacion_variables_modelado.csv", "05_verificacion_variables_modelado.csv"),
        ("tabla_cultivos_limpios.csv", "06_tabla_cultivos_limpios.csv"),
        ("tabla_top_antibioticos_limpios.csv", "07_tabla_top_antibioticos_limpios.csv"),
        ("resumen_comorbilidades_piloto.csv", "08_resumen_comorbilidades_piloto.csv"),
        ("top_comorbilidades_piloto.csv", "09_top_comorbilidades_piloto.csv"),
        ("cobertura_grupos_comorbilidades.csv", "10_cobertura_grupos_comorbilidades.csv"),
        ("resumen_grupos_comorbilidades.csv", "11_resumen_grupos_comorbilidades.csv"),
    ],
    "03_MODELOS_BASE_Y_AMPLIADA": [
        ("armd_s_aureus_base_modelado_base.csv", "01_armd_s_aureus_base_modelado_base.csv"),
        ("armd_s_aureus_base_modelado_ampliada.csv", "02_armd_s_aureus_base_modelado_ampliada.csv"),
        ("manifiesto_modelado.csv", "03_manifiesto_modelado.csv"),
    ],
    "04_MODELOS_EXPERIMENTALES": [
        ("armd_s_aureus_base_modelado_multihot_abx.csv", "01_armd_s_aureus_base_modelado_multihot_abx.csv"),
        ("armd_s_aureus_base_modelado_multihot_comorb.csv", "02_armd_s_aureus_base_modelado_multihot_comorb.csv"),
        ("armd_s_aureus_base_modelado_multihot_abx_comorb.csv", "03_armd_s_aureus_base_modelado_multihot_abx_comorb.csv"),
        ("manifiesto_modelado_multihot_abx.csv", "04_manifiesto_modelado_multihot_abx.csv"),
        ("manifiesto_modelado_multihot_comorb.csv", "05_manifiesto_modelado_multihot_comorb.csv"),
        ("manifiesto_modelado_multihot_abx_comorb.csv", "06_manifiesto_modelado_multihot_abx_comorb.csv"),
        ("catalogo_clases_antibioticas_multihot.csv", "07_catalogo_clases_antibioticas_multihot.csv"),
        ("catalogo_grupos_comorbilidades.csv", "08_catalogo_grupos_comorbilidades.csv"),
    ],
}


def resolver_origen(nombre_archivo: str) -> Path | None:
    candidatos = [RUTA_PROCESADOS / nombre_archivo]

    for carpeta, archivos in ESTRUCTURA.items():
        for archivo_origen, archivo_ordenado in archivos:
            if archivo_origen == nombre_archivo:
                candidatos.append(RUTA_PROCESADOS / carpeta / archivo_origen)
                candidatos.append(RUTA_PROCESADOS / carpeta / archivo_ordenado)

    for candidato in candidatos:
        if candidato.exists():
            return candidato

    return None


def copiar_archivos() -> None:
    for carpeta, archivos in ESTRUCTURA.items():
        ruta_destino = RUTA_PROCESADOS / carpeta
        ruta_destino.mkdir(parents=True, exist_ok=True)

        for nombre_archivo, nombre_ordenado in archivos:
            origen = resolver_origen(nombre_archivo)
            destino = ruta_destino / nombre_ordenado
            if origen is None:
                print(f"No encontrado: {nombre_archivo}")
                continue
            shutil.copy2(origen, destino)
            print(f"Copiado: {origen.name} -> {ruta_destino.name}/{nombre_ordenado}")


def crear_indice() -> None:
    ruta_indice = RUTA_PROCESADOS / "INDICE_CSV_PROCESADOS.md"
    lineas = [
        "# INDICE DE CSV PROCESADOS",
        "",
        "Este indice organiza los CSV sin romper las rutas originales del proyecto.",
        "",
        "Regla aplicada:",
        "- los CSV originales se conservan en la raiz de `3.DATOS-PROCESADOS`",
        "- se crearon subcarpetas con copias clasificadas por etapa y uso",
        "",
        "## CSV de entrenamiento/modelado",
        "",
        "Los `5` CSV que deben considerarse como bases de entrenamiento o comparacion de modelos son:",
        "",
        "- `armd_s_aureus_base_modelado_base.csv`",
        "- `armd_s_aureus_base_modelado_ampliada.csv`",
        "- `armd_s_aureus_base_modelado_multihot_abx.csv`",
        "- `armd_s_aureus_base_modelado_multihot_comorb.csv`",
        "- `armd_s_aureus_base_modelado_multihot_abx_comorb.csv`",
        "",
    ]

    descripciones = {
        "01_BASE_LIMPIA": "Base limpia principal despues del proceso de integracion y limpieza.",
        "02_ANALISIS_Y_CALIDAD": "Tablas resumen, calidad, nulos, cobertura y verificacion de variables, incluyendo comorbilidades.",
        "03_MODELOS_BASE_Y_AMPLIADA": "Datasets finales clasicos para la primera iteracion del modelado.",
        "04_MODELOS_EXPERIMENTALES": "Datasets y manifiestos de versiones experimentales, incluyendo multihot de antibioticos y comorbilidades.",
    }

    for carpeta, archivos in ESTRUCTURA.items():
        lineas.append(f"## {carpeta}")
        lineas.append("")
        lineas.append(descripciones.get(carpeta, "Sin descripcion"))
        lineas.append("")
        for archivo_origen, archivo_ordenado in archivos:
            lineas.append(f"- `{carpeta}/{archivo_ordenado}`  <- origen `{archivo_origen}`")
        lineas.append("")

    ruta_indice.write_text("\n".join(lineas), encoding="utf-8")
    print(f"Indice generado: {ruta_indice}")


def main() -> None:
    copiar_archivos()
    crear_indice()


if __name__ == "__main__":
    main()
