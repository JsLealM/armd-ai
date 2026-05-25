# TEXTOS CORTOS PARA LAS GRAFICAS DEL FRONTEND

Este archivo deja listos los textos breves para las `8` graficas oficiales de la ruta `/`.

La narrativa esta centrada en la variable objetivo:

- `susceptibility`

## 1. `expo_01_resumen_limpieza.png`

### Titulo sugerido

`Resumen de limpieza del dataset`

### Texto corto

Esta grafica muestra cuantos registros habia antes y despues de la limpieza. La diferencia fue pequena, lo que indica que la limpieza fue conservadora y mantuvo casi toda la base de trabajo.

## 2. `expo_02_objetivo_antes_despues.png`

### Titulo sugerido

`Variable objetivo antes y despues de la limpieza`

### Texto corto

Aqui se observa como quedo `susceptibility` despues de eliminar categorias vacias o no utiles. Tambien deja ver que el problema esta desbalanceado, porque `Susceptible` domina claramente.

## 3. `expo_11_faltantes_semanticos.png`

### Titulo sugerido

`Faltantes semanticos y cobertura real`

### Texto corto

Esta grafica demuestra que una variable puede no tener `NaN` y aun asi aportar poca informacion real. Por eso la calidad del dataset no se midio solo con nulos tecnicos.

## 4. `expo_04_decision_variables.png`

### Titulo sugerido

`Decision metodologica sobre variables`

### Texto corto

Resume como se clasificaron las variables del proyecto: unas se mantuvieron, otras se dejaron con cautela y otras se excluyeron. Esto justifica que la seleccion de variables no fue arbitraria.

## 5. `expo_08_cultivo_vs_susceptibilidad.png`

### Titulo sugerido

`Susceptibilidad segun tipo de cultivo`

### Texto corto

Cada barra representa un tipo de cultivo y muestra como se reparte entre `Susceptible`, `Intermediate` y `Resistant`. La grafica permite ver que el comportamiento de `susceptibility` cambia segun el contexto microbiologico.

## 6. `expo_09_edad_vs_susceptibilidad.png`

### Titulo sugerido

`Susceptibilidad segun grupo de edad`

### Texto corto

Esta grafica compara como se distribuye `susceptibility` entre distintos grupos etarios. Ayuda a ver si la edad aporta una señal util dentro del problema de prediccion.

## 7. `expo_12_heatmap_correlacion_modelado_completo.png`

### Titulo sugerido

`Correlacion del dataset final de modelado`

### Texto corto

Este heatmap muestra como se correlacionan entre si todas las variables de la version final mas completa del dataset de modelado. Tambien permite ubicar rapidamente que variables quedan mas cerca del comportamiento de `susceptibility`.

## 8. `expo_13_boxplot_wbc_por_susceptibility.png`

### Titulo sugerido

`median_wbc segun susceptibility`

### Texto corto

Este boxplot compara la distribucion de `median_wbc` entre las clases de `susceptibility`. Sirve para ver si los leucocitos muestran diferencias de dispersion o valores extremos segun la respuesta antibiotica.

## Nota de estilo para el frontend

Debajo de cada grafica conviene mostrar:

- un titulo corto
- un parrafo de 2 o 3 lineas
- una linea final tipo `Mensaje clave`

Ejemplos de mensaje clave:

- `Mensaje clave: la calidad de una variable no depende solo de los NaN.`
- `Mensaje clave: susceptibility cambia segun el contexto microbiologico.`
- `Mensaje clave: algunas variables se relacionan mas fuertemente con susceptibility que otras.`
