# JUSTIFICACION CLINICA DE VARIABLES - ARMD-AI

Este documento resume como defender las variables usadas en el proyecto para predecir `susceptibility`.

La idea central es:

> Las variables no se eligieron solo porque estaban disponibles. Se eligieron porque representan dimensiones clinicas relevantes para la susceptibilidad antibiotica: antibiotico evaluado, tipo de cultivo, caracteristicas del paciente, entorno asistencial, exposicion previa a antibioticos y comorbilidades.

## 1. Variable objetivo

### `susceptibility`

Traduccion:

- susceptibilidad antibiotica

Clases usadas:

- `Susceptible`
- `Intermediate`
- `Resistant`

Como defenderla:

> La variable objetivo es `susceptibility`, porque el problema consiste en predecir si un aislamiento de `Staphylococcus aureus` sera susceptible, intermedio o resistente frente a un antibiotico evaluado.

Punto importante:

- La susceptibilidad siempre se interpreta frente a un antibiotico especifico.
- Por eso `antibiotic` es una variable central.

## 2. Antibiotico evaluado

### `antibiotic`

Traduccion:

- antibiotico evaluado

Por que se usa:

- La respuesta `Susceptible`, `Intermediate` o `Resistant` depende directamente del antibiotico.
- Un mismo aislamiento puede ser resistente a un antibiotico y susceptible a otro.

Como defenderla:

> `antibiotic` es una variable esencial porque la susceptibilidad no se interpreta de forma general, sino frente a cada antibiotico probado en el antibiograma.

Cuidado metodologico:

- No se debe interpretar como que el antibiotico "causa" por si solo la resistencia en esta fila.
- Representa el medicamento frente al cual se esta evaluando la bacteria.

## 3. Tipo de cultivo

### `culture_description`

Traduccion:

- descripcion o tipo de cultivo

Por que se usa:

- Representa el contexto de la muestra clinica.
- Puede indicar si el cultivo viene de sangre, tracto respiratorio u otro origen.
- El sitio de infeccion puede cambiar el perfil clinico y epidemiologico de los casos.

Como defenderla:

> `culture_description` se usa porque el comportamiento microbiologico puede variar segun el tipo de muestra o sitio de cultivo.

Cuidado metodologico:

- No significa que el sitio de cultivo cause resistencia por si solo.
- Puede funcionar como proxy del contexto clinico y de la severidad.

## 4. Variables demograficas

### `age`

Traduccion:

- edad o grupo de edad

Por que se usa:

- La edad puede reflejar diferencias clinicas entre pacientes.
- Pacientes mayores suelen tener mas comorbilidades, hospitalizaciones y exposicion al sistema de salud.

Como defenderla:

> `age` aporta contexto demografico y puede capturar diferencias de riesgo asociadas a edad, fragilidad y contacto con servicios de salud.

Cuidado metodologico:

- No se debe decir que la edad causa resistencia.
- Es una variable contextual.

### `gender`

Traduccion:

- sexo o genero registrado

Por que se usa:

- Es una variable demografica basica.
- Puede ayudar a capturar diferencias poblacionales dentro de la cohorte.

Como defenderla:

> `gender` se conserva como variable demografica de base para describir diferencias poblacionales que podrian afectar la distribucion de los casos.

Cuidado metodologico:

- Probablemente no sea una de las variables mas fuertes.
- Se mantiene porque es simple, estable y con buena cobertura.

## 5. Entorno hospitalario

### `hosp_ward_ICU`

Traduccion:

- registro asociado a UCI

### `hosp_ward_ER`

Traduccion:

- registro asociado a urgencias

### `hosp_ward_IP`

Traduccion:

- registro asociado a hospitalizacion

### `hosp_ward_OP`

Traduccion:

- registro asociado a atencion ambulatoria

Por que se usan:

- El entorno asistencial refleja el contexto del paciente.
- UCI y hospitalizacion suelen concentrar pacientes mas graves, mas procedimientos, mas antibioticos y mayor presion de seleccion.
- Ambulatorio, urgencias y hospitalizacion no representan el mismo nivel de exposicion sanitaria.

Como defenderlas:

> Las variables `hosp_ward_*` se usan porque el entorno asistencial puede estar asociado con mayor exposicion a antibioticos, procedimientos invasivos y riesgo de patogenos resistentes.

Cuidado metodologico:

- Pueden introducir sesgo por severidad.
- No se interpretan como causalidad directa, sino como contexto clinico.

## 6. Variables clinicas de laboratorio

### `median_wbc`

Traduccion:

- mediana de leucocitos

Por que se usa:

- Los leucocitos son una senal clinica relacionada con inflamacion o infeccion.
- Puede reflejar severidad o estado inflamatorio del paciente.

Como defenderla:

> `median_wbc` se incluye porque representa una senal clinica del estado inflamatorio del paciente, aunque se interpreta con cuidado por sus faltantes y valores extremos.

Cuidado metodologico:

- Tiene faltantes.
- Puede estar mas disponible en pacientes graves.
- No predice resistencia de forma directa.

### `median_cr`

Traduccion:

- mediana de creatinina

Por que se usa:

- La creatinina refleja funcion renal.
- La funcion renal puede estar relacionada con complejidad clinica, severidad y decisiones de tratamiento.

Como defenderla:

> `median_cr` se considera porque la funcion renal aporta contexto clinico y puede relacionarse con severidad o complejidad del paciente.

Cuidado metodologico:

- Tiene faltantes.
- Puede capturar gravedad o intensidad de atencion, no resistencia directa.

## 7. Exposicion antibiotica previa

### `exp_prev_*`

Ejemplos:

- `exp_prev_beta_lactam`
- `exp_prev_glycopeptide`
- `exp_prev_fluoroquinolone`
- `exp_prev_macrolide_lincosamide`

Traduccion:

- exposicion previa a una clase antibiotica

Por que se usan:

- La exposicion previa a antibioticos puede generar presion selectiva.
- Esa presion puede favorecer bacterias resistentes.
- Se usa por clase antibiotica para evitar demasiada granularidad por farmaco exacto.

Como defenderlas:

> Las variables `exp_prev_*` se usan porque la exposicion antibiotica previa tiene plausibilidad biologica: los antibioticos ejercen presion selectiva y pueden favorecer la aparicion o seleccion de bacterias resistentes.

Cuidado metodologico:

- No se uso el nombre exacto del farmaco para evitar alta cardinalidad.
- No se uso recencia temporal en la version final por decision metodologica.
- No se interpreta como causalidad directa.

Frase corta:

> Se representa si hubo exposicion previa por clase antibiotica, no por medicamento exacto.

## 8. Comorbilidades

### `comorb_*`

Variables usadas:

- `comorb_congestive_heart_failure`
- `comorb_organ_transplant_status`
- `comorb_diabetes_any`
- `comorb_solid_tumor_non_metastatic`
- `comorb_chronic_pulmonary_any`
- `comorb_renal_failure`
- `comorb_pancreatic_disorder`
- `comorb_sinusitis`

Traduccion:

- condiciones clinicas adicionales del paciente

Por que se usan:

- Las comorbilidades reflejan complejidad clinica.
- Pacientes con mas enfermedades suelen tener mas contacto hospitalario, mas tratamientos y mas exposicion a antibioticos.
- Algunas comorbilidades pueden asociarse con mayor vulnerabilidad o riesgo de infecciones complicadas.

Como defenderlas:

> Las comorbilidades se agregaron como una version experimental reducida, porque capturan complejidad clinica del paciente sin incorporar el archivo crudo completo de casi 20 GB.

Cuidado metodologico:

- No se usaron todas las comorbilidades.
- Se seleccionaron grupos clinicos reducidos.
- Pueden introducir sesgo por severidad o por calidad del registro medico.

Frase corta:

> Las comorbilidades no son la senal principal de susceptibilidad, pero pueden aportar contexto clinico del paciente.

## 9. Variables usadas con cuidado

Estas variables pueden aportar informacion, pero requieren interpretacion prudente:

- `median_wbc`
- `median_cr`
- `ordering_mode`
- `procedure_name`
- `exp_prev_*`
- `comorb_*`

Por que:

- pueden tener faltantes
- pueden reflejar severidad
- pueden actuar como proxy del entorno hospitalario
- pueden capturar intensidad de documentacion clinica

Frase para exposicion:

> Algunas variables se usan con cuidado porque pueden aportar senal clinica, pero tambien pueden capturar severidad, hospitalizacion o calidad del registro, no solo biologia de resistencia.

## 10. Variables excluidas o no priorizadas

Ejemplos:

- `prior_organism`
- `implied_susceptibility`
- `Rule`
- `time_to_culturetime`

Razon general:

- baja informacion real
- falta de variabilidad
- ruido semantico
- decision metodologica

Caso importante:

### `time_to_culturetime`

No se excluyo por mala calidad.

Se excluyo porque representaba recencia temporal de la exposicion antibiotica previa, y la decision final fue usar exposicion previa por clase antibiotica sin recencia.

Frase para exposicion:

> `time_to_culturetime` tenia cobertura aceptable, pero no se incluyo en la version final porque el diseno elegido fue multihot por clase antibiotica sin componente temporal.

## 11. Como responder si preguntan "por que esas variables"

Respuesta corta:

> Las variables se eligieron combinando relevancia clinica, calidad de datos y utilidad para modelado. Se mantuvieron variables que representan el antibiotico evaluado, tipo de cultivo, demografia, entorno hospitalario, laboratorio, exposicion antibiotica previa y comorbilidades. Se excluyeron variables con baja cobertura, poca variabilidad o alto riesgo de ruido.

Respuesta mas completa:

> El problema no se abordo solo desde correlaciones. Se partio de la logica clinica del antibiograma: una bacteria se evalua frente a antibioticos concretos, en un contexto de muestra, paciente y entorno asistencial. Por eso se conservaron variables que representan esas dimensiones y se separaron en versiones de modelado para comparar su aporte.

## 12. Fuentes para defender la justificacion

### CDC

Tema:

- uso de antibioticos y resistencia antimicrobiana

URL:

- https://www.cdc.gov/antimicrobial-resistance/causes/index.html

Uso en exposicion:

> CDC explica que el uso de antimicrobianos favorece la seleccion de microorganismos resistentes.

### WHO

Tema:

- resistencia antimicrobiana

URL:

- https://www.who.int/news-room/fact-sheets/detail/antibiotic-resistance

Uso en exposicion:

> WHO describe la resistencia antimicrobiana como un problema asociado al uso y mal uso de antimicrobianos.

### ATS/IDSA HAP/VAP Guidelines

Tema:

- factores de riesgo para patogenos resistentes en contexto hospitalario

URL:

- https://www.idsociety.org/practice-guideline/hap_vap/

Uso en exposicion:

> Las guias ATS/IDSA reconocen factores como antibioticos previos, hospitalizacion, severidad y terapia renal como relevantes para riesgo de patogenos resistentes.

### CLSI

Tema:

- categorias `Susceptible`, `Intermediate`, `Resistant`

URL:

- https://clsi.org/about/blog/re-exploring-the-intermediate-interpretive-category/

Uso en exposicion:

> CLSI define e interpreta las categorias de susceptibilidad antimicrobiana.

### Merck Manual

Tema:

- pruebas de susceptibilidad

URL:

- https://www.merckmanuals.com/professional/infectious-diseases/laboratory-diagnosis-of-infectious-disease/susceptibility-testing

Uso en exposicion:

> Merck explica que las pruebas de susceptibilidad evaluan la respuesta de microorganismos frente a antimicrobianos, pero el contexto clinico tambien importa.

### Revision sobre MRSA y factores de riesgo

Tema:

- factores asociados con colonizacion por MRSA

URL:

- https://pmc.ncbi.nlm.nih.gov/articles/PMC3883507/

Uso en exposicion:

> La literatura sobre MRSA reporta asociaciones con exposicion sanitaria, antibioticos previos y comorbilidades.

## 13. Frase final para defender el enfoque

> El proyecto no asume causalidad directa. Usa variables clinicamente plausibles y de calidad aceptable para construir modelos predictivos comparables. La seleccion busca equilibrar sentido biologico, cobertura de datos e interpretabilidad.
