/**
 * Centralized text content for all frontend sections.
 * Based on TEXTOS_GRAFICAS_FRONTEND.md and FRONTEND_ARCHITECTURE.md
 */

export const heroContent = {
  title: "ARMD-AI",
  subtitle: "Predicción de susceptibilidad antibiótica en Staphylococcus aureus",
  description:
    "Un prototipo académico que explora el análisis, la limpieza y el modelado de datos del dataset ARMD para predecir la resistencia antimicrobiana.",
  tags: ["S. aureus", "Susceptibility", "React + Vite", "JupyterLab", "Python"],
};

export const projectFlow = [
  { step: 1, label: "Dataset crudo", description: "Múltiples CSV del ARMD" },
  { step: 2, label: "Filtrado", description: "Solo S. aureus" },
  { step: 3, label: "Limpieza", description: "Depuración conservadora" },
  { step: 4, label: "Análisis", description: "Visualización y calidad" },
  { step: 5, label: "Modelado", description: "5 variantes de dataset" },
];

export const datasetContext = {
  eyebrow: "Origen y Contexto",
  title: "Estructura del dataset de trabajo",
  paragraphs: [
    "El dataset original ARMD venía en múltiples archivos CSV con información clínica, microbiológica y de laboratorio.",
    "Para garantizar la viabilidad del modelo, se filtró temprano para enfocarse exclusivamente en la bacteria Staphylococcus aureus.",
    "La unidad analítica y de agregación se trabajó de forma rigurosa alrededor de la variable order_proc_id_coded para mantener consistencia en los aislamientos.",
  ],
};

export const chartTexts = {
  expo_01: {
    title: "Resumen de limpieza del dataset",
    caption:
      "Esta gráfica muestra cuántos registros había antes y después de la limpieza. La diferencia fue pequeña, lo que indica que la limpieza fue conservadora y mantuvo casi toda la base de trabajo.",
    insight: "Mensaje clave: la limpieza preservó la inmensa mayoría de los registros originales.",
  },
  expo_02: {
    title: "Variable objetivo antes y después de la limpieza",
    caption:
      "Aquí se observa cómo quedó susceptibility después de eliminar categorías vacías o no útiles. También deja ver que el problema está desbalanceado, porque Susceptible domina claramente.",
    insight: "Mensaje clave: el desbalance de clases es un reto crítico para los algoritmos.",
  },
  expo_11: {
    title: "Faltantes semánticos y cobertura real",
    caption:
      "Esta gráfica demuestra que una variable puede no tener NaN y aun así aportar poca información real. Por eso la calidad del dataset no se midió solo con nulos técnicos.",
    insight: "Mensaje clave: la calidad de una variable no depende solo de los NaN.",
  },
  expo_04: {
    title: "Decisión metodológica sobre variables",
    caption:
      "Resume cómo se clasificaron las variables del proyecto: unas se mantuvieron, otras se dejaron con cautela y otras se excluyeron. Esto justifica que la selección de variables no fue arbitraria.",
    insight: "Mensaje clave: la selección de variables tiene fundamentos clínicos y técnicos.",
  },
  expo_08: {
    title: "Susceptibilidad según tipo de cultivo",
    caption:
      "Cada barra representa un tipo de cultivo y muestra cómo se reparte entre Susceptible, Intermediate y Resistant. La gráfica permite ver que el comportamiento de susceptibility cambia según el contexto microbiológico.",
    insight: "Mensaje clave: susceptibility cambia según el contexto microbiológico.",
  },
  expo_09: {
    title: "Susceptibilidad según grupo de edad",
    caption:
      "Esta gráfica compara cómo se distribuye susceptibility entre distintos grupos etarios. Ayuda a ver si la edad aporta una señal útil dentro del problema de predicción.",
    insight: "Mensaje clave: la edad del paciente muestra ligeras variaciones en la tasa de resistencia.",
  },
  expo_12: {
    title: "Correlación del dataset final de modelado",
    caption:
      "Este heatmap muestra cómo se correlacionan entre sí todas las variables de la versión final más completa del dataset de modelado. También permite ubicar rápidamente qué variables quedan más cerca del comportamiento de susceptibility.",
    insight: "Mensaje clave: algunas variables se relacionan más fuertemente con susceptibility que otras.",
  },
  expo_13: {
    title: "median_wbc según susceptibility",
    caption:
      "Este boxplot compara la distribución de median_wbc entre las clases de susceptibility. Sirve para ver si los leucocitos muestran diferencias de dispersión o valores extremos según la respuesta antibiótica.",
    insight: "Mensaje clave: median_wbc muestra patrones de dispersión diferenciados por clase.",
  },
};

export const metrics = {
  recordsBefore: { value: "82,519", label: "Registros antes", context: "Dataset original" },
  recordsAfter: { value: "82,319", label: "Registros después", context: "Post-limpieza" },
  datasetVariants: { value: "5", label: "Variantes", context: "Datasets de modelado" },
  modelsEvaluated: { value: "6", label: "Modelos", context: "Algoritmos probados" },
};

export const variableSelection = {
  eyebrow: "Variables de los manifiestos",
  title: "Predictores y roles de las variables",
  retained: [
    "antibiotic (Antibiótico a evaluar)",
    "culture_description (Tipo de muestra/cultivo)",
    "age (Edad del paciente)",
    "gender (Género)",
    "hosp_ward_ICU / ER / IP / OP (Entorno asistencial)",
    "ordering_mode (Modo de ordenamiento)",
    "procedure_name (Nombre del procedimiento)",
    "median_wbc (Leucocitos medianos en sangre)",
    "median_cr (Creatinina mediana en suero)",
  ],
  cautious: [
    "exp_prev_* (18 clases de exposición antibiótica previa - manifiesto abx)",
    "comorb_* (8 comorbilidades clínicas agregadas - manifiesto comorb)",
  ],
  excluded: [
    "anon_id (Identificador único de paciente)",
    "pat_enc_csn_id_coded (ID de encuentro clínico)",
    "order_proc_id_coded (ID de orden de procedimiento)",
    "order_time_jittered_utc (Variable temporal/división)",
    "susceptibility (Variable objetivo - excluida de predictores)",
  ],
};

export const conclusionContent = {
  eyebrow: "Estado actual",
  title: "¿Qué sigue?",
  points: [
    "El dataset ya quedó completamente limpio y listo para el modelado.",
    "Existen 5 variantes de entrenamiento progresivas.",
    "El siguiente paso clave consiste en comparar el desempeño de los modelos y sus respectivos scores.",
  ],
};
