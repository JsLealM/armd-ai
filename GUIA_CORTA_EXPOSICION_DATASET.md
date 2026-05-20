# GUIA CORTA DE EXPOSICION: DESDE EL DATASET HASTA LA BASE FINAL

## 1. De donde salieron los datos

El proyecto usa el dataset `ARMD`, un recurso de microbiologia y resistencia antibiotica derivado de registros clinicos desidentificados.

El dataset original trae multiples archivos CSV con informacion de:

- cultivos microbiologicos
- demografia
- entorno hospitalario
- laboratorios
- procedimientos previos
- exposicion antibiotica
- otras tablas clinicas complementarias

---

## 2. Cual fue el alcance real del proyecto

No se trabajo todo el dataset completo.

El alcance se redujo a:

- bacteria objetivo: `Staphylococcus aureus`
- tarea objetivo: predecir `susceptibility`
- clases finales:
  - `Susceptible`
  - `Intermediate`
  - `Resistant`

No se trabajo:

- mortalidad
- inadecuacion empirica

---

## 3. Cual fue el archivo principal

El archivo eje fue:

- `microbiology_cultures_cohort.csv`

Se uso porque contiene:

- el organismo
- el antibiotico evaluado
- la susceptibilidad
- el tipo de cultivo
- los identificadores para enlazar otras tablas

---

## 4. Que se hizo primero

Lo primero fue filtrar temprano por:

- `STAPHYLOCOCCUS AUREUS`

Esto se hizo para:

- reducir memoria
- trabajar solo con la bacteria objetivo
- evitar unir tablas innecesarias para millones de registros

---

## 5. Que tablas auxiliares si se usaron

Se usaron solo las necesarias para construir las variables del proyecto:

- `microbiology_cultures_demographics.csv`
- `microbiology_cultures_ward_info.csv`
- `microbiology_cultures_labs.csv`
- `microbiology_cultures_antibiotic_class_exposure.csv`
- `microbiology_culture_prior_infecting_organism.csv`
- `microbiology_cultures_nursing_home_visits.csv`
- `microbiology_cultures_priorprocedures.csv`
- `microbiology_cultures_implied_susceptibility.csv`
- `implied_susceptibility_rules.csv`

---

## 6. Por que no se usaron todos los CSV

No todos los archivos del dataset eran necesarios para esta primera iteracion.

La idea fue construir primero una base:

- explicable
- controlada
- manejable en memoria
- alineada con el alcance aprobado

---

## 7. Como quedo finalmente comorbilidades

El archivo de comorbilidades era importante desde el punto de vista clinico, pero no se uso de forma cruda en la primera base clasica por varias razones:

- no hacia parte obligatoria del set de variables definido para esta iteracion
- pesa cerca de `20 GB`
- la RAM disponible del proyecto es limitada
- requiere una ingenieria de variables mucho mas compleja
- podia meter demasiada dimensionalidad y ruido antes de cerrar la primera version del modelo

Conclusion breve:

- si es una fuente clinicamente valiosa
- pero no era adecuada para entrar cruda en la primera iteracion del pipeline

Despues, en una iteracion experimental posterior, si se reaprovecho de forma reducida:

- no como `500` categorias originales
- si como `8` grupos binarios `multihot` de comorbilidad

---

## 8. Como se unieron los datos

Despues del filtrado de `S. aureus`, se unieron solo las tablas necesarias usando principalmente:

- `order_proc_id_coded`

Asi se construyo una base analitica unificada con:

- edad
- genero
- entorno hospitalario
- laboratorios
- procedimientos
- exposicion antibiotica previa
- otras variables complementarias

---

## 9. Como se limpio el dataset

Se aplicaron varias reglas:

1. estandarizar textos
2. eliminar filas con nulos criticos en:
   - `antibiotic`
   - `culture_description`
   - `susceptibility`
3. conservar solo las clases utiles de `susceptibility`
4. eliminar duplicados exactos si existian
5. marcar faltantes categoricos con etiquetas como:
   - `SIN_REGISTRO`
   - `SIN_REGLA`

---

## 10. Cuantas filas se eliminaron

La limpieza fue conservadora.

- antes: `82,519`
- despues: `82,319`

Solo se eliminaron `200` filas:

- `196` porque `susceptibility` estaba vacia
- `4` porque `susceptibility` era `Inconclusive`

No hubo perdida importante por duplicados exactos.

---

## 11. Que problema aparecio con los nulos

Se detecto algo importante:

Una variable podia quedar con `0%` de `NaN`, pero seguir teniendo poca informacion real.

Ejemplo:

- `procedure_name` quedo sin `NaN` tecnicos
- pero gran parte de sus registros quedaron como `SIN_REGISTRO`

Por eso se separaron dos conceptos:

- `NaN` tecnico
- faltante semantico

---

## 12. Que se hizo para resolver eso

Ademas del archivo de comparacion de nulos, se construyo un reporte de:

- `porcentaje_na_real`
- `porcentaje_faltante_semantico`
- `porcentaje_cobertura_real`

Esto permitio entender mejor la calidad real de las variables.

---

## 13. Como se eligieron las variables finales

Se hizo una verificacion formal variable por variable.

Cada variable fue clasificada como:

- `usar`
- `usar con cuidado`
- `excluir`

La decision se baso en:

- cobertura
- sentido clinico
- riesgo de ruido
- utilidad para el modelo
- riesgo de sesgo

---

## 14. Que bases finales se construyeron

Se dejaron cinco versiones de dataset para modelado:

### Version `base`

Solo variables mas solidas.

### Version `ampliada`

Version base mas variables marcadas como `usar con cuidado`.

### Version `multihot_abx`

Version experimental donde la exposicion antibiotica previa no se representa con una sola clase, sino con multiples columnas binarias por clase antibiotica previa.

Importante:

- esta version no usa `time_to_culturetime`
- no porque estuviera vacia totalmente
- sino porque el proyecto decidio no usar recencia en la estrategia final

### Version `multihot_comorb`

Version experimental donde se agregan grupos reducidos de comorbilidades en columnas binarias `comorb_*`.

Importante:

- el catalogo de comorbilidades puede tener mas filas que columnas finales
- porque un mismo grupo `comorb_*` puede agrupar varios componentes originales

### Version `multihot_abx_comorb`

Version experimental mas completa, que combina:

- multihot de exposicion antibiotica previa
- multihot reducido de comorbilidades

---

## 15. Mensaje final para defender

El trabajo no consistio en meter todos los CSV al modelo.

Consistio en:

- definir un alcance claro
- filtrar temprano la bacteria objetivo
- usar solo tablas necesarias
- limpiar sin destruir la base
- distinguir entre nulos tecnicos y ausencia informativa real
- justificar tecnicamente que variables conservar y cuales excluir
- dejar cinco bases comparables para modelado

---

## 16. Frase corta de cierre

La primera meta no fue construir el modelo mas complejo, sino construir una base de datos limpia, defendible y metodologicamente coherente para que el modelado posterior tuviera sentido.


