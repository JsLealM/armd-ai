# CONTEXTO DETALLADO DEL PROYECTO: SISTEMA INTELIGENTE DE PREDICCIÓN CLÍNICA (ARMD-AI)

## 1. IDENTIFICACIÓN Y METADATOS DEL PROYECTO
* [cite_start]**Institución:** Universidad de Pamplona[cite: 1].
* [cite_start]**Facultad:** Facultad de Ingenierías y Arquitectura[cite: 2].
* [cite_start]**Programa:** Ingeniería de Sistemas[cite: 3].
* [cite_start]**Asignatura:** Sistemas Inteligentes[cite: 4].
* [cite_start]**Profesor Líder:** José Orlando Maldonado Bautista[cite: 5].
* [cite_start]**Autores/Desarrolladores:** Johan Leal, Danilo Castillejo[cite: 8].
* [cite_start]**Fecha de Consolidación:** Marzo de 2026[cite: 9].

## 2. PLANTEAMIENTO DEL PROBLEMA Y RELEVANCIA CLÍNICA
* [cite_start]**Contexto de la Amenaza:** Las infecciones provocadas por la bacteria *Staphylococcus aureus*, especialmente la variante resistente a la meticilina (MRSA), constituyen uno de los mayores desafíos en la medicina hospitalaria contemporánea[cite: 39]. [cite_start]La resistencia antimicrobiana (AMR) es catalogada por la Organización Mundial de la Salud (OMS) como una de las diez principales amenazas de salud pública del planeta, provocando cerca de 700,000 muertes al año[cite: 41].
* [cite_start]**Desafío Médico Imprevisto:** Cuando un paciente ingresa con una infección activa, el personal médico inicia un tratamiento empírico a ciegas con alta probabilidad de ser inadecuado debido a que no conoce de antemano si el antibiótico funcionará[cite: 40]. [cite_start]La variante MRSA presenta tasas de mortalidad intrahospitalaria de entre el 15% y el 50%, y una terapia empírica inicial errónea incrementa este riesgo hasta en un 30% adicional[cite: 42].
* [cite_start]**Solución Propuesta:** Desarrollar un modelo predictivo capaz de anticipar la susceptibilidad antibiótica del paciente antes de que el laboratorio microbiológico entregue los resultados finales del antibiograma[cite: 45].

## 3. ALCANCE TÉCNICO Y LIMITACIÓN DE OBJETIVOS
* [cite_start]**Reducción de Alcance Estratégica:** A diferencia del planteamiento macro inicial que contemplaba tres variables objetivo (susceptibilidad, inadecuación empírica y score de mortalidad) [cite: 45][cite_start], este desarrollo está ESTRICTAMENTE LIMITADO a la **Variable 1: Susceptibilidad Antibiótica**[cite: 76, 92]. Queda fuera del alcance el modelado predictivo de la mortalidad y de la inadecuación terapéutica directa.
* [cite_start]**Filtro Obligatorio de Ingesta:** El sistema debe procesar e integrar única y exclusivamente los registros microbiológicos correspondientes a *Staphylococcus aureus* extraídos del dataset ARMD[cite: 49]. [cite_start]Cualquier otro patógeno debe ser descartado en la fase de preparación de datos[cite: 49].

## 4. NATURALEZA DEL DATASET DE ORIGEN (ARMD - STANFORD HEALTHCARE)
* [cite_start]**Origen de los Datos:** El *Antibiotic Resistance Microbiology Dataset* (ARMD) es un recurso desidentificado derivado de los registros de salud electrónicos (EHR) de Stanford Healthcare, recopilado durante más de 15 años[cite: 173, 174]. [cite_start]Comprende 751,075 registros de cultivos clínicos obtenidos de 283,715 pacientes adultos únicos[cite: 311].
* [cite_start]**Estructura Logística de Almacenamiento:** El dataset se compone de múltiples archivos CSV vinculados que deben ser unificados (*joins*) mediante claves relacionales específicas: `anon_id` (identificador único del paciente), `pat_enc_csn_id_coded` (identificador del encuentro médico) y `order_proc_id_coded` (identificador de la orden del cultivo)[cite: 243, 275].
* [cite_start]**Tratamiento de Datos Faltantes:** Los campos vacíos en el dataset están marcados explícitamente con la cadena `"null"`[cite: 435]. [cite_start]No se debe aplicar imputación estadística ciega; deben manejarse de acuerdo con la lógica de limpieza de datos del pipeline de Machine Learning[cite: 242, 436].
* [cite_start]**Protocolo de Desidentificación y Tiempo:** Las edades reales están agrupadas en rangos categóricos (*age bins*) [cite: 238][cite_start], el sexo está codificado de forma binaria (0 y 1) sin etiquetas explícitas [cite: 239][cite_start], y todos los campos de fecha/hora sufrieron un proceso de *jittering* temporal (desplazamientos aleatorios por paciente) para proteger la privacidad, preservando intactas las distancias temporales relativas[cite: 240, 241].

## 5. REQUISITOS DE INGENIERÍA DE CARACTERÍSTICAS (FEATURES SPECIFICATION)
El modelo utilizará exactamente las siguientes 11 variables predictoras, las cuales deben ser construidas y consolidadas a partir de los archivos CSV correspondientes del dataset ARMD extraído de Kaggle:

1.  [cite_start]**antibiotic (Origen: `microbiology_cultures_cohort.csv`):** Agente antimicrobiano específico que se evalúa contra la bacteria[cite: 278]. [cite_start]Determina el perfil único de resistencia contra el cual el modelo predice[cite: 279].
2.  [cite_start]**culture_description (Origen: `microbiology_cultures_cohort.csv`):** Sitio anatómico de procedencia de la muestra (ej. Sangre, Orina, Respiratorio)[cite: 224, 278]. [cite_start]Es crítico dado que *S. aureus* altera su agresividad y patrón según la fuente biológica[cite: 225].
3.  [cite_start]**age (Origen: `microbiology_cultures_demographics.csv`):** Rango de edad del paciente[cite: 238, 292]. [cite_start]Factor clave debido a la correlación entre la edad avanzada, comorbilidades acumuladas e historial de hospitalizaciones severas[cite: 263].
4.  [cite_start]**hosp_ward_ICU, hosp_ward_ER, hosp_ward_IP, hosp_ward_OP (Origen: `microbiology_cultures_ward_info.csv`):** Variables binarias que denotan el entorno clínico del hospital donde se tomó la muestra (Unidad de Cuidados Intensivos, Urgencias, Paciente Interno, Paciente Ambulatorio)[cite: 284]. [cite_start]La UCI posee la mayor presión selectiva de antibióticos potentes[cite: 264].
5.  [cite_start]**antibiotic_class + time_to_culturetime (Origen: `microbiology_cultures_antibiotic_class_exposure.csv`):** Registro de la clase de antibiótico administrada previamente y la cantidad de días transcurridos hasta la orden del cultivo actual[cite: 8, 285]. [cite_start]Evalúa si la bacteria ya generó resistencia por presión terapéutica reciente[cite: 286, 287].
6.  [cite_start]**prior_organism + prior_infecting_organism_days_to_culture (Origen: `microbiology_culture_prior_infecting_organism.csv`):** Historial microbiológico que indica si el paciente ya ha sido infectado por *S. aureus* en el pasado y cuántos días han transcurrido[cite: 10, 289]. [cite_start]Multiplica drásticamente la probabilidad de persistencia de cepas resistentes (MRSA)[cite: 290].
7.  [cite_start]**nursing_home_visit_culture (Origen: `microbiology_cultures_nursing_home_visits.csv`):** Días transcurridos entre la última visita documentada a un hogar geriátrico/centro de cuidados a largo plazo y la orden del cultivo (máximo 90 días)[cite: 14, 296]. [cite_start]Es un vector epidemiológico crítico para la propagación de bacterias resistentes en comunidad[cite: 263, 296].
8.  [cite_start]**procedure_name (Origen: `microbiology_cultures_priorprocedures.csv`):** Procedimientos invasivos previos realizados al paciente (ej. Ventilación mecánica, colocación de catéter venoso central) según códigos CPT[cite: 12, 304]. [cite_start]Representan vías de entrada físicas directas para infecciones intrahospitalarias agresivas[cite: 264, 304].
9.  [cite_start]**Implied_susceptibility + Rule (Origen: `microbiology_cultures_implied_susceptibility.csv` e `implied_susceptibility_rules.csv`):** Reglas clínicas y lógicas de microbiología estandarizadas basadas en lineamientos CLSI[cite: 15, 16, 231]. [cite_start]Aportan conocimiento experto explícito al modelo (ej. si es resistente a la oxacilina, se infiere resistencia sistémica a los beta-lactámicos)[cite: 231, 233].
10. [cite_start]**wbc_median (Origen: `microbiology_cultures_labs.csv`):** Mediana de los conteos de glóbulos blancos (leucocitos) registrados en la ventana de 14 días previa al cultivo[cite: 6, 265]. [cite_start]Refleja la severidad de la respuesta inmunológica ante la infección[cite: 298, 299].
11. [cite_start]**cr_median (Origen: `microbiology_cultures_labs.csv`):** Mediana de los niveles de creatinina registrados en los 14 días previos[cite: 6, 265]. [cite_start]Mide la función renal del paciente; fallas en este órgano afectan la farmacocinética y la dosificación correcta de antibióticos[cite: 298, 299].

## 6. ESPECIFICACIÓN DEL MODELO DE MACHINE LEARNING
* [cite_start]**Algoritmo Principal:** XGBoost (Extreme Gradient Boosting) configurado como un clasificador multiclase secuencial[cite: 67, 94].
* **Función de Pérdida:** Softmax Loss, diseñada para emitir probabilidades independientes para cada una de las tres clases de la variable objetivo[cite: 94].
* [cite_start]**Clase Objetivo (Target):** `susceptibility`, clasificada en tres niveles discretos: **Susceptible**, **Intermedio** o **Resistente**[cite: 45, 94].
* [cite_start]**Estrategia de Balanceo:** Aplicación estricta de técnicas de sobremuestreo como SMOTE (Synthetic Minority Over-sampling Technique) para mitigar el fuerte desbalance de clases típico de los registros microbiológicos reales[cite: 95].
* **Protocolo de Validación:** Validación cruzada temporal estricta utilizando la variable cronológica `order_time_jittered_utc` como el criterio fundamental de corte para evitar el filtrado de información del futuro hacia el pasado (*data leakage*)[cite: 95].

## 7. REGLAS DE ARQUITECTURA, PERSISTENCIA Y CÓDIGO
* [cite_start]**Idioma Técnico Mandatorio:** Todo el desarrollo del código fuente en Python, comentarios técnicos, documentación interna, nombres de variables creadas en el pipeline y los outputs generados por las cadenas de IA deben escribirse rigurosamente en **ESPAÑOL**[cite: 112].
* [cite_start]**Restricción del Framework de IA:** Se utilizará exclusivamente **LangChain** y su API de integraciones para orquestar la extracción de datos y la generación de explicaciones interpretables en lenguaje natural[cite: 82, 112]. Está **estrictamente prohibido** incorporar *LangGraph* o bibliotecas complejas basadas en grafos de estado.
* **Entorno de Trabajo:** Todo el proceso exploratorio, la ingeniería de características, el entrenamiento de XGBoost y las pruebas de software se consolidarán dentro de un entorno unificado de **Jupyter Lab** (`.ipynb`)[cite: 112].
* [cite_start]**Especificación de la Base de Datos Relacional:** El modelo de base de datos final mapeado utilizará **PostgreSQL** con la extensión **pgvector**[cite: 46, 117]. Los tipos de datos requeridos se dividen en:
    * [cite_start]`DECIMAL` para métricas de laboratorios continuos (`wbc_median`, `cr_median`) y scores de probabilidad[cite: 115].
    * `VARCHAR` para variables categóricas identificadas (`antibiotic`, `culture_description`, catálogos fijos)[cite: 115, 120].
    * [cite_start]`TEXT` para registrar el contenido narrativo de los análisis explicativos[cite: 115].
    * [cite_start]`VECTOR(768)` para gestionar almacenamiento y búsquedas semánticas indexadas si se requiere incorporar guías clínicas en fases posteriores[cite: 115, 122].

## 8. ESTRUCTURA DE DIRECTORIOS Y OPTIMIZACIÓN DE MEMORIA
* **Ubicación de los Archivos:** Todos los archivos CSV del dataset ARMD descargados de Kaggle se encuentran en la carpeta relativa `./modelo/data/` (o ajusta esta ruta según tu proyecto). El modelo debe construir las rutas de lectura utilizando esta base.
* **Manejo de Memoria (Data Engineering):** El dataset es grande (más de 750,000 registros de cultivos antes de filtrar). Para evitar colapsos de memoria (OOM - Out of Memory) en Jupyter Lab, el código de ingesta debe aplicar buenas prácticas de Pandas:
    * Especificar los `dtypes` más eficientes al leer los CSV (ej. usar `category` para variables categóricas de baja cardinalidad, `float32` en lugar de `float64`, y enteros de 8 o 16 bits donde sea posible).
    * Filtrar los datos por *Staphylococcus aureus* **inmediatamente** después de cargar el CSV principal (`microbiology_cultures_cohort.csv`), antes de intentar hacer los `merge` o `joins` con los demás archivos. 
    * Eliminar los DataFrames temporales de la memoria usando `del` y `gc.collect()` una vez que se hayan unido al DataFrame principal.
    * Tengo 13GB de Memoria RAM tenlo en cuenta
    * Haz codigo que pueda entender una persona principiante en este Tema. Alguien que se enfoca más en el area del backend con Java y SpringBoot.
* **Como guardar los archivos:** El repositorio ahora sigue una organizacion monorepo con tres carpetas principales: `frontend/`, `backend/` y `modelo/`. Todo el trabajo analitico, notebooks, scripts, datos procesados e imagenes del proyecto deben vivir dentro de `modelo/`.
    * Debes mostrar imagenes en todo, debo ver el proceso que llevas y debes explicarme que estas haciendo siempre(Soy principiante)
    * USA ESTRICTAMENTE MATPLOTLIB y muestra de mejor manera los datos
    * Antes de realizar el modelo, tienes que hacer una visualizacion de los datos y un buen analisis ademas explicar este analisis y dejar esto detallado en el notebook.

