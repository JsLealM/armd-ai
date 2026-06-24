import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { PredictionProvider } from './context/PredictionContext';
import './styles.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('No se encontro el elemento #root');
}

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <PredictionProvider>
        <App />
      </PredictionProvider>
    </BrowserRouter>
  </StrictMode>,
);
