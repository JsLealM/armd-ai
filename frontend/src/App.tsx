import { useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { ModalLayer } from './components/ModalLayer';
import { usePrediction } from './context/PredictionContext';
import { requiredFields } from './data/formOptions';
import { AssistantPage } from './pages/AssistantPage';
import { EvaluationPage } from './pages/EvaluationPage';
import { HomePage } from './pages/HomePage';
import { HistoryPage } from './pages/HistoryPage';
import { ModelsPage } from './pages/ModelsPage';
import { ResultPage } from './pages/ResultPage';
import { appRoutes } from './routes/routes';
import { predict } from './services/apiClient';
import type { ModalKey } from './types';

function App() {
  const navigate = useNavigate();
  const [modal, setModal] = useState<ModalKey>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    acceptedDisclaimer,
    caseData,
    refreshHistory,
    setAcceptedDisclaimer,
    setCaseData,
    setResult,
  } = usePrediction();

  const openEvaluation = () => {
    if (!acceptedDisclaimer) {
      setModal('disclaimer');
      return;
    }
    navigate(appRoutes.evaluation);
  };

  const runPrediction = async () => {
    const missing = requiredFields.filter((field) => !caseData[field]);
    if (missing.length > 0) {
      setModal('missing-required');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    try {
      const nextResult = await predict(caseData);
      setResult(nextResult);
      // El backend ya persistio la prediccion; refrescamos el historial real.
      void refreshHistory();
      navigate(appRoutes.result);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'No se pudo conectar con el backend. Verifique que el servicio FastAPI este activo.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const acceptDisclaimer = () => {
    setAcceptedDisclaimer(true);
    setModal(null);
    navigate(appRoutes.evaluation);
  };

  return (
    <>
      <Routes>
        <Route element={<AppShell openEvaluation={openEvaluation} />} path={appRoutes.home}>
          <Route index element={<HomePage openEvaluation={openEvaluation} />} />
          <Route
            element={(
              <EvaluationPage
                caseData={caseData}
                setCaseData={setCaseData}
                runPrediction={runPrediction}
                setModal={setModal}
                submitting={submitting}
                errorMessage={errorMessage}
              />
            )}
            path={appRoutes.evaluation.slice(1)}
          />
          <Route element={<ResultPage setModal={setModal} />} path={appRoutes.result.slice(1)} />
          <Route element={<ModelsPage setModal={setModal} />} path={appRoutes.models.slice(1)} />
          <Route element={<HistoryPage />} path={appRoutes.history.slice(1)} />
          <Route element={<AssistantPage />} path={appRoutes.assistant.slice(1)} />
          <Route element={<Navigate replace to={appRoutes.home} />} path="*" />
        </Route>
      </Routes>
      <ModalLayer modal={modal} close={() => setModal(null)} acceptDisclaimer={acceptDisclaimer} />
    </>
  );
}

export default App;
