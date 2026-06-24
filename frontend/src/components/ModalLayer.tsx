import { ModelTable } from './ModelTable';
import type { ModalKey } from '../types';

interface ModalContent {
  title: string;
  text: string;
}

const modalContent: Record<string, ModalContent> = {
  disclaimer: {
    title: 'Uso responsable',
    text: 'ARMD-AI es un prototipo academico. No reemplaza antibiograma, criterio medico, protocolos institucionales ni prescribe antibioticos.',
  },
  'missing-required': {
    title: 'Faltan campos obligatorios',
    text: 'Complete organismo, antibiotico, tipo de cultivo, edad y sexo para calcular una prediccion exploratoria.',
  },
  'variable-help': {
    title: 'Variables del formulario',
    text: 'El modelo usa organismo, antibiotico, cultivo, datos demograficos, sala hospitalaria, laboratorios, exposicion antibiotica previa y comorbilidades agrupadas.',
  },
  'model-explanation': {
    title: 'Como interpretar el resultado',
    text: 'La probabilidad no es certeza clinica. F1 macro evalua equilibrio entre Susceptible y Resistant. Las explicaciones no demuestran causalidad.',
  },
  performance: {
    title: 'Rendimiento de modelos',
    text: 'XGBoost obtuvo el mejor resultado final: F1 macro 0.847, balanced accuracy 0.852, accuracy 0.853 y MSE 0.147.',
  },
  sources: {
    title: 'Fuentes del asistente',
    text: 'El backend RAG consultara README V2, notebooks, resumen tecnico, justificacion de variables, arquitectura y progreso de sesion.',
  },
};

interface ModalLayerProps {
  modal: ModalKey;
  close: () => void;
  acceptDisclaimer: () => void;
}

export function ModalLayer({ modal, close, acceptDisclaimer }: ModalLayerProps) {
  if (!modal) return null;

  const content = modalContent[modal];
  if (!content) return null;
  const hasPrimaryAction = modal === 'disclaimer';

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={close}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id="modal-title">{content.title}</h2>
        <p>{content.text}</p>
        {modal === 'performance' ? <ModelTable /> : null}
        <div className="modal-actions">
          <button className="secondary-action" onClick={close} type="button">Cerrar</button>
          {hasPrimaryAction ? (
            <button className="primary-action" onClick={acceptDisclaimer} type="button">Entiendo</button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
