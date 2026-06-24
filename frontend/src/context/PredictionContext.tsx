import {
  createContext,
  useCallback,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { initialCase } from '../data/demoData';
import { getHistory } from '../services/apiClient';
import type { CaseData, HistoryItem, PredictionResult } from '../types';

interface PredictionContextValue {
  caseData: CaseData;
  setCaseData: Dispatch<SetStateAction<CaseData>>;
  result: PredictionResult | null;
  setResult: Dispatch<SetStateAction<PredictionResult | null>>;
  history: HistoryItem[];
  historyLoading: boolean;
  historyError: string | null;
  refreshHistory: () => Promise<void>;
  acceptedDisclaimer: boolean;
  setAcceptedDisclaimer: Dispatch<SetStateAction<boolean>>;
}

const PredictionContext = createContext<PredictionContextValue | null>(null);

export function PredictionProvider({ children }: { children: ReactNode }) {
  const [caseData, setCaseData] = useState<CaseData>(initialCase);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);

  const refreshHistory = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const items = await getHistory();
      setHistory(items);
    } catch (error) {
      setHistoryError(error instanceof Error ? error.message : 'No se pudo cargar el historial.');
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  return (
    <PredictionContext.Provider
      value={{
        caseData,
        setCaseData,
        result,
        setResult,
        history,
        historyLoading,
        historyError,
        refreshHistory,
        acceptedDisclaimer,
        setAcceptedDisclaimer,
      }}
    >
      {children}
    </PredictionContext.Provider>
  );
}

export function usePrediction(): PredictionContextValue {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error('usePrediction debe usarse dentro de PredictionProvider');
  }
  return context;
}
