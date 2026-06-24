export const appRoutes = {
  home: '/',
  evaluation: '/nueva-evaluacion',
  result: '/resultado',
  models: '/modelos',
  history: '/historial',
  assistant: '/asistente',
} as const;

export interface NavItem {
  path: string;
  label: string;
  end?: boolean;
}

export const navItems: NavItem[] = [
  { path: appRoutes.home, label: 'Inicio', end: true },
  { path: appRoutes.evaluation, label: 'Nueva evaluacion' },
  { path: appRoutes.result, label: 'Resultado' },
  { path: appRoutes.models, label: 'Modelos' },
  { path: appRoutes.history, label: 'Historial' },
  { path: appRoutes.assistant, label: 'Asistente pronto' },
];
