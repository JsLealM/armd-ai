# TEXTOS CORTOS PARA LAS GRAFICAS DEL FRONTEND

Este archivo deja sugeridos los textos breves que pueden ir debajo de cada grafica en la pagina principal del frontend.

La idea es que sean faciles de leer, cortos y utiles para una exposicion academica.

## 1. `expo_01_resumen_limpieza.png`

### Titulo sugerido

`Resumen de limpieza del dataset`

### Texto corto

Esta grafica muestra cuantos registros habia antes y despues de la limpieza. La diferencia fue pequena, lo que indica que la limpieza fue conservadora y no destruyo la base de trabajo.

## 2. `expo_02_objetivo_antes_despues.png`

### Titulo sugerido

`Variable objetivo antes y despues de la limpieza`

### Texto corto

Aqui se observa como quedo la variable `susceptibility` despues de depurar categorias vacias o no utiles. Tambien deja ver que el problema esta desbalanceado, porque `Susceptible` domina claramente.

## 3. `expo_11_faltantes_semanticos.png`

### Titulo sugerido

`Faltantes semanticos y cobertura real`

### Texto corto

Esta grafica muestra que una variable puede no tener `NaN` y aun asi no aportar informacion real. Por eso en el proyecto no se evaluo calidad solo con nulos tecnicos, sino tambien con etiquetas como `SIN_REGISTRO` y `SIN_REGLA`.

## 4. `expo_04_decision_variables.png`

### Titulo sugerido

`Decision metodologica sobre variables`

### Texto corto

Resume como se clasificaron las variables del proyecto: algunas se mantuvieron, otras se dejaron con cautela y otras se excluyeron. Esto ayuda a justificar que la seleccion de variables no fue arbitraria.

## 5. `expo_08_cultivo_vs_susceptibilidad.png`

### Titulo sugerido

`Susceptibilidad segun tipo de cultivo`

### Texto corto

Cada barra representa un tipo de cultivo y muestra como se reparte entre `Susceptible`, `Intermediate` y `Resistant`. La grafica ayuda a ver que el comportamiento de la susceptibilidad cambia segun el contexto microbiologico.

## 6. `expo_10_entorno_hospitalario.png`

### Titulo sugerido

`Distribucion por entorno hospitalario`

### Texto corto

Esta grafica no muestra resistencia directamente, sino de que entornos asistenciales vienen los registros. Sirve para entender si la cohorte esta mas cargada hacia ambulatorio, urgencias, hospitalizacion o UCI.

## 7. `expo_05_boxplot_median_wbc.png`

### Titulo sugerido

`Distribucion de leucocitos medianos`

### Texto corto

El boxplot permite ver dispersion, mediana y valores atipicos en `median_wbc`. Es util para mostrar que algunas variables clinicas tienen comportamientos extremos y por eso requieren cuidado en el modelado.

## Nota de estilo para el frontend

Debajo de cada grafica conviene mostrar:

- un titulo corto
- un parrafo de 2 o 3 lineas
- opcionalmente una linea final tipo `Mensaje clave`

Ejemplo:

`Mensaje clave: la calidad de una variable no depende solo de los NaN, sino tambien de su cobertura real.`
