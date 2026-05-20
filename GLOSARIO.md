# GLOSARIO DEL PROYECTO ARMD-AI

Este archivo existe para traducir y aclarar terminos del proyecto, especialmente nombres de variables y conceptos que aparecen en ingles.

No todas las traducciones deben verse como traducciones clinicas perfectas.

La idea aqui es que te ayuden a **entender el proyecto** y a **explicarlo mejor**.

## 1. Terminos generales del proyecto

### `dataset`

Conjunto de datos.

### `cohort`

Cohorte. En este proyecto significa el conjunto base de observaciones del estudio.

### `susceptibility`

Susceptibilidad antibiotica. Indica como responde la bacteria frente a un antibiotico.

### `Susceptible`

La bacteria responde bien al antibiotico.

### `Intermediate`

La respuesta es intermedia. No es claramente sensible ni claramente resistente.

### `Resistant`

La bacteria no responde adecuadamente al antibiotico.

### `modelado`

Fase donde se entrenan y comparan modelos predictivos.

### `multihot`

Forma de representar varias categorias al mismo tiempo con columnas binarias.

Ejemplo:

- `exp_prev_beta_lactam = 1`
- `exp_prev_glycopeptide = 0`

### `cardinalidad`

Cantidad de valores distintos que tiene una variable.

### `coverage`

Cobertura. Que tanto trae informacion real una variable.

### `missing values`

Valores faltantes o vacios.

### `semantic missingness`

Faltante semantico. Ocurre cuando una celda no esta vacia, pero en realidad no aporta informacion util.

Ejemplo:

- `SIN_REGISTRO`
- `SIN_REGLA`

## 2. Variables base del proyecto

### `anon_id`

Identificador anonimo del paciente.

### `pat_enc_csn_id_coded`

Identificador codificado del encuentro o visita clinica del paciente.

### `order_proc_id_coded`

Identificador codificado de la orden o evento microbiologico.

Es una de las llaves mas importantes del proyecto.

### `order_time_jittered_utc`

Fecha y hora de la orden, desidentificada pero conservando el orden temporal.

### `organism`

Microorganismo identificado en el cultivo.

En este proyecto, despues del filtro, corresponde a `Staphylococcus aureus`.

### `antibiotic`

Antibiotico evaluado en el antibiograma.

### `culture_description`

Descripcion o tipo de cultivo.

Ejemplos:

- `RESPIRATORY` = respiratorio
- `BLOOD` = sangre
- `URINE` = orina

### `age`

Grupo de edad del paciente.

### `gender`

Sexo o genero codificado del paciente.

### `hosp_ward_ICU`

Marca de UCI.

`ICU` significa `Intensive Care Unit`, o sea Unidad de Cuidados Intensivos.

### `hosp_ward_ER`

Marca de urgencias.

`ER` significa `Emergency Room`.

### `hosp_ward_IP`

Marca de hospitalizacion.

`IP` significa `Inpatient`.

### `hosp_ward_OP`

Marca de atencion ambulatoria.

`OP` significa `Outpatient`.

## 3. Variables ampliadas

### `ordering_mode`

Modo de ordenamiento o contexto de la orden.

En la practica ayuda a entender desde donde se genero la solicitud clinica.

### `procedure_name`

Nombre del procedimiento asociado.

### `median_wbc`

Mediana de `white blood cells`, o sea leucocitos.

Se usa como variable clinica de laboratorio.

### `median_cr`

Mediana de `creatinine`, o sea creatinina.

Tambien es una variable clinica de laboratorio.

## 4. Variables de exposicion antibiotica previa

### `antibiotic_class`

Clase antibiotica previa.

No es el nombre exacto del medicamento, sino su grupo.

### `time_to_culturetime`

Tiempo entre la exposicion previa y el momento del cultivo.

En este proyecto finalmente no se uso en el modelo final por decision metodologica.

### `exp_prev_*`

Columnas binarias que indican si hubo exposicion previa a una clase antibiotica.

Ejemplo:

- `exp_prev_beta_lactam`
- `exp_prev_glycopeptide`

### `beta_lactam`

Beta lactamico.

### `glycopeptide`

Glicopeptido.

### `fluoroquinolone`

Fluoroquinolona.

### `macrolide lincosamide`

Macrolido o lincosamida.

## 5. Variables relacionadas con comorbilidades

### `comorbidity`

Comorbilidad. Enfermedad o condicion adicional del paciente.

### `comorbidity_component`

Componente de comorbilidad del dataset.

Ojo: no siempre equivale a una comorbilidad clinica pura. A veces mezcla diagnosticos, signos o categorias generales.

### `comorb_*`

Columnas binarias agrupadas de comorbilidades seleccionadas para el modelo.

Ejemplos:

- `comorb_congestive_heart_failure`
- `comorb_diabetes_any`
- `comorb_renal_failure`

### `congestive heart failure`

Insuficiencia cardiaca congestiva.

### `renal failure`

Falla renal o insuficiencia renal.

### `chronic pulmonary disease`

Enfermedad pulmonar cronica.

### `sinusitis`

Sinusitis.

### `organ transplant status`

Antecedente o estado de trasplante de organo.

## 6. Terminos de modelado

### `train`

Conjunto de entrenamiento.

### `validation`

Conjunto de validacion.

### `test`

Conjunto de prueba final.

### `data leakage`

Fuga de informacion. Ocurre cuando el modelo aprende algo del futuro o de informacion que no deberia tener.

### `accuracy`

Porcentaje total de aciertos.

### `balanced_accuracy`

Accuracy balanceada. Tiene mas cuidado con el desbalance entre clases.

### `f1_macro`

Promedio del F1 entre clases, tratando cada clase con igual importancia.

### `confusion matrix`

Matriz de confusion. Muestra en que clases acierta y en cuales se equivoca el modelo.

### `DummyClassifier`

Modelo base muy simple usado como referencia.

### `LogisticRegression`

Regresion logistica.

### `KNeighborsClassifier`

Modelo de vecinos mas cercanos.

### `DecisionTreeClassifier`

Arbol de decision.

### `RandomForestClassifier`

Bosque aleatorio.

### `XGBClassifier`

Modelo de XGBoost.

## 7. Conceptos utiles para explicar graficas

### `boxplot`

Grafico de caja y bigotes.

Sirve para ver:

- mediana
- dispersion
- valores atipicos

### `outlier`

Valor atipico o raro.

### `distribution`

Distribucion de los datos.

### `trend`

Tendencia o comportamiento general.

### `target variable`

Variable objetivo. En este proyecto es `susceptibility`.

## 8. Traducciones rapidas de etiquetas frecuentes

- `RESPIRATORY` = respiratorio
- `BLOOD` = sangre
- `URINE` = orina
- `Outpatient` = ambulatorio
- `Inpatient` = hospitalizado
- `Emergency Room` = urgencias
- `ICU` = UCI
- `linezolid` = linezolid
- `vancomycin` = vancomicina
- `oxacillin` = oxacilina
- `erythromycin` = eritromicina
- `trimethoprim/sulfamethoxazole` = trimetoprim/sulfametoxazol

## 9. Idea clave final

Si un termino te confunde, intenta ubicarlo en una de estas tres preguntas:

1. es una variable del paciente
2. es una variable del cultivo / antibiotico
3. es una variable del modelo o de la evaluacion

Esa clasificacion suele ayudarte a entender rapido para que sirve.
