# GUIA DE ONBOARDING PARA EL COMPAÑERO DEL PROYECTO

## Objetivo de esta guia

Este archivo existe para que una segunda persona pueda entender el estado real del proyecto sin tener que abrir decenas de archivos al azar.

La idea no es que revise todo en detalle el primer dia.

La idea es que:

- entienda el flujo general del proyecto
- ubique los notebooks realmente importantes
- sepa que CSV mirar y para que sirven
- identifique rapido donde estan las decisiones metodologicas clave

## Regla importante del proyecto

En este proyecto los **notebooks son muy importantes**.

No basta con ver solo scripts `.py` o CSV sueltos.

La logica correcta es:

- leer un documento corto para entender el panorama
- abrir los notebooks para ver el trabajo real
- usar CSV y `.md` como apoyo para interpretar decisiones y resultados

Importante:

- los procesos importantes ya no deben depender de correr `.py` manualmente por fuera
- cuando exista un script auxiliar, el notebook correspondiente debe ejecutarlo desde Jupyter Lab

## Ruta recomendada de estudio

La forma correcta de revisar el proyecto es esta:

1. entender primero el panorama general
2. luego ver el analisis y limpieza en notebook
3. despues revisar las visualizaciones para exposicion
4. luego entender las bases de modelado
5. por ultimo revisar las variantes experimentales

Si sigue este orden, no deberia tardar 6 horas para ubicarse.

## Orden global recomendado de notebooks

Para no perderse, este es el orden sugerido de ejecucion o lectura:

1. `01_analisis_limpieza_visualizacion_armd.ipynb`
2. `02_complemento_faltantes_semanticos_armd.ipynb`
3. `03_exposicion_analisis_visual_armd.ipynb`
4. `04_piloto_comorbilidades_armd.ipynb`
5. `05_construccion_dataset_multihot_abx.ipynb`
6. `06_construccion_datasets_comorb.ipynb`
7. `07_organizacion_csv_procesados.ipynb`
8. `08_modelado_validacion_multiclase_armd.ipynb`

No todos se ejecutan siempre de corrido, pero la numeracion ya deja claro cual va primero y cual depende de etapas posteriores.

## Paso 1: leer el panorama general

### Archivo 1

- [GUIA_CORTA_EXPOSICION_DATASET.md](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/GUIA_CORTA_EXPOSICION_DATASET.md:1>)

### Para que sirve

Explica:

- de donde sale el dataset
- cual fue el alcance real
- como se filtro `Staphylococcus aureus`
- como se limpio la base
- por que no se usaron todos los CSV crudos
- cuales son las versiones finales del dataset

### Que debe entender despues de leerlo

- que el proyecto no usa todo el dataset ARMD indiscriminadamente
- que primero se construyo una base limpia y defendible
- que despues se crearon varias versiones para modelado

## Paso 2: leer el resumen de entrenamientos

### Archivo 2

- [RESUMEN_ENTRENAMIENTOS_MODELO.md](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/RESUMEN_ENTRENAMIENTOS_MODELO.md:1>)

### Para que sirve

Resume:

- cual es la variable objetivo
- cuantas corridas principales hay
- que variables entran en cada una
- que significa cada version del dataset

### Que debe entender despues de leerlo

Que existen `5` versiones principales para comparar:

1. `base`
2. `ampliada`
3. `multihot_abx`
4. `multihot_comorb`
5. `multihot_abx_comorb`

## Paso 3: leer las aclaraciones de consistencia

### Archivo 3

- [ACLARACIONES_CONSISTENCIA_MODELO.md](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/ACLARACIONES_CONSISTENCIA_MODELO.md:1>)

### Para que sirve

Aclara dos dudas que pueden confundir mucho:

- por que `time_to_culturetime` no entra al modelo aunque tenia cobertura aceptable
- por que el catalogo de comorbilidades tiene mas filas que columnas finales `comorb_*`

### Que debe entender despues de leerlo

- `time_to_culturetime` no se excluyo por mala calidad, sino por decision metodologica
- `catalogo_grupos_comorbilidades.csv` es un mapa componente→grupo, no una lista de columnas finales

## Paso 4: abrir el notebook principal de analisis y limpieza

### Notebook 1

- [01_analisis_limpieza_visualizacion_armd.ipynb](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/modelo/1.ANALIZAR-DATASET-UNIR/01_analisis_limpieza_visualizacion_armd.ipynb:1>)

### Por que es importante

Este es el notebook que muestra el trabajo base del proyecto.

Aqui se hizo:

- filtrado temprano de `S. aureus`
- integracion de tablas
- limpieza principal
- analisis inicial de calidad
- exportacion de la base limpia

### Que debe revisar dentro del notebook

- como se construyo la cohorte
- que filas se eliminaron y por que
- que variables se integraron
- que resultados procesados genero

### Meta de este paso

Entender **como se paso del dataset ARMD crudo a la base limpia**.

## Paso 5: abrir el notebook complemento de faltantes semanticos

### Notebook 2

- [02_complemento_faltantes_semanticos_armd.ipynb](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/modelo/1.ANALIZAR-DATASET-UNIR/02_complemento_faltantes_semanticos_armd.ipynb:1>)

### Por que es importante

Este notebook resuelve una trampa comun:

- una variable puede tener `0%` de `NaN`
- pero seguir casi vacia si quedo llena de `SIN_REGISTRO` o `SIN_REGLA`

### Que debe revisar dentro del notebook

- diferencia entre `NaN` tecnico y faltante semantico
- ejemplos como `procedure_name`
- idea de `porcentaje_cobertura_real`

### Meta de este paso

Entender que **no basta con mirar nulos crudos** para juzgar la calidad de una variable.

## Paso 6: abrir el notebook de exposicion visual

### Notebook 3

- [03_exposicion_analisis_visual_armd.ipynb](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/modelo/2.VISUALIZACION-DATOS/03_exposicion_analisis_visual_armd.ipynb:1>)

### Por que es importante

Este notebook no es decorativo.

Sirve para entender:

- que graficas se generaron
- que muestran
- por que dan esos resultados
- que mensaje se debe defender en la exposicion

### Que debe revisar dentro del notebook

- graficas antes vs despues de limpieza
- distribucion de clases objetivo
- nulos y faltantes semanticos
- boxplots de variables clinicas
- por que ciertas variables se mantienen y otras no

### Meta de este paso

Entender **como contar la historia del dataset y la limpieza**.

## Paso 7: abrir el notebook piloto de comorbilidades

### Notebook 4

- [04_piloto_comorbilidades_armd.ipynb](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/modelo/1.ANALIZAR-DATASET-UNIR/04_piloto_comorbilidades_armd.ipynb:1>)

### Por que es importante

Este notebook explica:

- por que el archivo de comorbilidades no podia entrar crudo
- cuanta cobertura real tiene
- por que hacia falta agruparlo

### Que debe revisar dentro del notebook

- resumen cuantitativo de comorbilidades
- top de componentes frecuentes
- riesgos de ruido y granularidad

### Meta de este paso

Entender **por que comorbilidades se trabajaron como experimento reducido y no como tabla cruda**.

## Paso 8: abrir el notebook de construccion de antibioticos `multihot`

### Notebook 5

- [05_construccion_dataset_multihot_abx.ipynb](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/modelo/4.MODELADO-Y-VALIDACION/05_construccion_dataset_multihot_abx.ipynb:1>)

### Por que es importante

Este notebook documenta y ejecuta:

- la construccion de `multihot_abx`
- el dataset final con columnas `exp_prev_*`
- el manifiesto y catalogo de clases antibioticas

### Meta de este paso

Entender **como se construyo la variante de exposicion antibiotica previa sin tocar un `.py` manualmente**.

## Paso 9: abrir el notebook de construccion de comorbilidades finales

### Notebook 6

- [06_construccion_datasets_comorb.ipynb](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/modelo/4.MODELADO-Y-VALIDACION/06_construccion_datasets_comorb.ipynb:1>)

### Por que es importante

Este notebook documenta y ejecuta:

- la construccion de `multihot_comorb`
- la construccion de `multihot_abx_comorb`
- el catalogo y cobertura de los grupos `comorb_*`

### Que debe revisar dentro del notebook

- cuales grupos de comorbilidad quedaron
- cuantas columnas `comorb_*` hay realmente
- diferencia entre catalogo y grupos finales

### Meta de este paso

Entender **como se crearon las variantes nuevas con comorbilidades**.

## Paso 10: abrir el notebook de modelado

### Notebook 7

- [08_modelado_validacion_multiclase_armd.ipynb](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/modelo/4.MODELADO-Y-VALIDACION/08_modelado_validacion_multiclase_armd.ipynb:1>)

### Por que es importante

Aqui esta el flujo de entrenamiento y comparacion de modelos.

### Que debe revisar dentro del notebook

- como se selecciona `VERSION_DATASET`
- como se hace la particion temporal
- como se imputan y codifican variables
- que modelos se comparan
- donde se guardan resultados

### Meta de este paso

Entender **como se entrenan y comparan las 5 variantes del dataset**.

## Paso 11: abrir el notebook de organizacion de CSV

### Notebook 8

- [07_organizacion_csv_procesados.ipynb](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/modelo/3.DATOS-PROCESADOS/07_organizacion_csv_procesados.ipynb:1>)

### Por que es importante

Este notebook ejecuta la organizacion de CSV procesados en subcarpetas y permite verificar que no todo quede tirado en la raiz.

### Meta de este paso

Entender **como se ordenan los CSV finales sin correr scripts manualmente por fuera de Jupyter**.

## CSV clave que si debe ubicar

No hace falta abrir todos los CSV del proyecto.

Estos son los importantes:

### Para calidad y seleccion de variables

- [verificacion_variables_modelado.csv](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/modelo/3.DATOS-PROCESADOS/verificacion_variables_modelado.csv:1>)
- [reporte_faltantes_semanticos.csv](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/modelo/3.DATOS-PROCESADOS/reporte_faltantes_semanticos.csv:1>)

### Para entender entrenamientos

- [resumen_entrenamientos_modelo.csv](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/modelo/3.DATOS-PROCESADOS/resumen_entrenamientos_modelo.csv:1>)
- [resumen_grupos_comorbilidades.csv](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/modelo/3.DATOS-PROCESADOS/resumen_grupos_comorbilidades.csv:1>)

### Para identificar archivos procesados

- [INDICE_CSV_PROCESADOS.md](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/modelo/3.DATOS-PROCESADOS/INDICE_CSV_PROCESADOS.md:1>)

### Para ver la base limpia y las variantes finales

- [armd_s_aureus_base_limpia.csv](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_limpia.csv:1>)
- [armd_s_aureus_base_modelado_base.csv](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_modelado_base.csv:1>)
- [armd_s_aureus_base_modelado_ampliada.csv](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_modelado_ampliada.csv:1>)
- [armd_s_aureus_base_modelado_multihot_abx.csv](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_modelado_multihot_abx.csv:1>)
- [armd_s_aureus_base_modelado_multihot_comorb.csv](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_modelado_multihot_comorb.csv:1>)
- [armd_s_aureus_base_modelado_multihot_abx_comorb.csv](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_modelado_multihot_abx_comorb.csv:1>)

## Archivos que no debe intentar leer completos al inicio

Estos sirven como referencia, pero no como punto de entrada:

- [PROCEDIMIENTO_DATASET_A_MODELADO.md](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/PROCEDIMIENTO_DATASET_A_MODELADO.md:1>)
- [SESSION_PROGRESS.md](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/SESSION_PROGRESS.md:1>)

### Por que no

Porque son documentos largos.

Sirven mas para:

- resolver dudas puntuales
- revisar decisiones antiguas
- recuperar contexto de sesiones previas

## Tiempo recomendado de revision

Si quiere ubicarse rapido:

### Revision corta de 30 a 45 minutos

1. `GUIA_CORTA_EXPOSICION_DATASET.md`
2. `RESUMEN_ENTRENAMIENTOS_MODELO.md`
3. `ACLARACIONES_CONSISTENCIA_MODELO.md`
4. `01_analisis_limpieza_visualizacion_armd.ipynb`
5. `08_modelado_validacion_multiclase_armd.ipynb`

### Revision mas completa de 60 a 90 minutos

1. todo lo anterior
2. `02_complemento_faltantes_semanticos_armd.ipynb`
3. `03_exposicion_analisis_visual_armd.ipynb`
4. `04_piloto_comorbilidades_armd.ipynb`
5. `06_construccion_datasets_comorb.ipynb`

## Que deberia saber al final

Si termino bien esta guia, deberia poder responder:

- cual es la bacteria objetivo
- cual es la variable objetivo
- como se limpio la base
- por que no basta mirar solo `NaN`
- cuales son las 5 variantes de modelado
- por que antibioticos previos quedaron en `multihot`
- por que comorbilidades quedaron reducidas a `8` grupos
- donde esta el notebook que entrena y compara modelos


