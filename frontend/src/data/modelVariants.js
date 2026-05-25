/**
 * The 5 dataset variants used for modeling.
 * Each variant builds upon the previous one.
 */

export const datasetVariants = [
  {
    id: "base",
    name: "Base",
    color: "var(--block-lime)",
    description: "Variables más sólidas y con mejor cobertura del dataset original.",
    details: "Incluye las variables clínicas y demográficas con mayor calidad de información.",
    badge: "Fundación",
  },
  {
    id: "ampliada",
    name: "Ampliada",
    color: "var(--block-cream)",
    description: "Agrega variables clínicas con cautela, expandiendo el contexto del paciente.",
    details: "Incorpora median_wbc, median_creatinine y otras variables de laboratorio.",
    badge: "+ Clínicas",
  },
  {
    id: "multihot_abx",
    name: "Multihot ABX",
    color: "var(--block-lilac)",
    description: "Agrega exposición antibiótica previa codificada en formato multi-hot.",
    details:
      "Cada antibiótico previo se convierte en una columna binaria (0/1).",
    badge: "+ Antibióticos",
  },
  {
    id: "multihot_comorb",
    name: "Multihot Comorb",
    color: "var(--block-pink)",
    description: "Agrega comorbilidades del paciente reducidas y codificadas.",
    details:
      "Las comorbilidades se agrupan y convierten en columnas binarias.",
    badge: "+ Comorbilidades",
  },
  {
    id: "multihot_abx_comorb",
    name: "Multihot ABX + Comorb",
    color: "var(--block-coral)",
    description: "Combina ambas familias: antibióticos previos y comorbilidades.",
    details:
      "Es la variante más rica en información, pero también la más compleja.",
    badge: "Combinada",
  },
];
