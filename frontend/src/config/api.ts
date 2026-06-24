// URL base del backend FastAPI. Configurable en build/deploy con VITE_API_BASE_URL.
export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export const API_URLS = {
  frontend: 'http://localhost:5173',
  backend: API_BASE_URL,
  predict: `${API_BASE_URL}/api/predict`,
  modelSusceptibility: `${API_BASE_URL}/ml/susceptibility`,
  history: `${API_BASE_URL}/api/history`,
} as const;
