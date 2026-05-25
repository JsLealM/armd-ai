/**
 * Model validation results from resultados_validacion_modelos_base.csv
 * and resultado_test_mejor_modelo_base.csv
 */

export const validationResults = [
  {
    modelo: "DecisionTree",
    conjunto: "validation",
    accuracy: 0.5838,
    balanced_accuracy: 0.6165,
    precision_macro: 0.4854,
    recall_macro: 0.6165,
    f1_macro: 0.4260,
    isBest: true,
  },
  {
    modelo: "RandomForest",
    conjunto: "validation",
    accuracy: 0.6875,
    balanced_accuracy: 0.5983,
    precision_macro: 0.4872,
    recall_macro: 0.5983,
    f1_macro: 0.4619,
    isBest: false,
  },
  {
    modelo: "LogisticRegression",
    conjunto: "validation",
    accuracy: 0.8224,
    balanced_accuracy: 0.5280,
    precision_macro: 0.4627,
    recall_macro: 0.5280,
    f1_macro: 0.4813,
    isBest: false,
  },
  {
    modelo: "KNN",
    conjunto: "validation",
    accuracy: 0.8569,
    balanced_accuracy: 0.4832,
    precision_macro: 0.4787,
    recall_macro: 0.4832,
    f1_macro: 0.4809,
    isBest: false,
  },
  {
    modelo: "XGBoost",
    conjunto: "validation",
    accuracy: 0.8664,
    balanced_accuracy: 0.4723,
    precision_macro: 0.4906,
    recall_macro: 0.4723,
    f1_macro: 0.4803,
    isBest: false,
  },
  {
    modelo: "Dummy",
    conjunto: "validation",
    accuracy: 0.8498,
    balanced_accuracy: 0.3333,
    precision_macro: 0.2833,
    recall_macro: 0.3333,
    f1_macro: 0.3063,
    isBest: false,
  },
];

export const bestModelTest = {
  modelo: "DecisionTree",
  conjunto: "test",
  accuracy: 0.5867,
  balanced_accuracy: 0.6227,
  precision_macro: 0.4729,
  recall_macro: 0.6227,
  f1_macro: 0.4197,
};

export const modelingContext = {
  eyebrow: "Resultados de modelado",
  title: "Comparación de modelos sobre dataset base",
  objective:
    "Predecir la susceptibilidad antibiótica de aislamientos de S. aureus en tres clases: Susceptible, Intermediate y Resistant.",
  primaryMetric: "balanced_accuracy",
  whyBalanced:
    "Se usa balanced_accuracy como métrica principal porque el problema está fuertemente desbalanceado — Susceptible representa ~85% de los casos. Un modelo que siempre prediga Susceptible tendría accuracy alta pero balanced_accuracy de 0.33.",
  intermediateNote:
    "La clase Intermediate es la más difícil de predecir por su baja representación en el dataset. Su comportamiento es clave para evaluar la utilidad real de cada modelo.",
};

/**
 * Format a decimal score to a display percentage
 */
export function formatScore(value) {
  return (value * 100).toFixed(1) + "%";
}
