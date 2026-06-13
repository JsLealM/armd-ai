# MODELO

Este directorio contiene la parte analitica y de modelado del proyecto.

## Estructura por versiones

El trabajo queda separado en dos versiones para evitar mezclar el pipeline anterior con la nueva mejora multibacteria.

### V1 - Pipeline original

La V1 corresponde al trabajo ya construido en las carpetas originales:

- `1.ANALIZAR-DATASET-UNIR/`
- `2.VISUALIZACION-DATOS/`
- `3.DATOS-PROCESADOS/`
- `4.MODELADO-Y-VALIDACION/`

Esta version estaba centrada principalmente en:

- `STAPHYLOCOCCUS AUREUS`

### V2 - Pipeline multibacteria

La V2 vive en:

- `V2/`

Esta version se usara para:

- entrenar con multiples bacterias
- mejorar limpieza y preprocesamiento
- evaluar mejores variables clinicas
- construir nuevos notebooks sin romper la V1

## Datos crudos

Los CSV crudos del dataset ARMD estan en:

- `data/`

Esta carpeta no debe subirse a GitHub porque contiene archivos pesados.

## Entorno

El entorno del proyecto sigue definido en:

- `environment.yml`
