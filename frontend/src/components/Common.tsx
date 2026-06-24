import type { ReactNode } from 'react';
import type { InfluencingFactor } from '../types';

export function ClinicalDisclaimer() {
  return (
    <div className="disclaimer">
      <strong>Prototipo academico.</strong>
      <span>No reemplaza antibiograma, criterio medico ni protocolos institucionales.</span>
    </div>
  );
}

interface MetricTileProps {
  label: string;
  value: ReactNode;
}

export function MetricTile({ label, value }: MetricTileProps) {
  return (
    <div className="metric-tile">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  text?: string;
}

export function SectionHeader({ title, text }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

interface RiskBadgeProps {
  label: string;
  variant: string;
}

export function RiskBadge({ label, variant }: RiskBadgeProps) {
  return <span className={`risk-badge ${variant}`}>{label}</span>;
}

interface ProbabilityBarProps {
  label: string;
  value: number;
  variant: string;
}

export function ProbabilityBar({ label, value, variant }: ProbabilityBarProps) {
  return (
    <div className="probability">
      <div>
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div className={`probability-track ${variant}`}>
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

interface ProgressMeterProps {
  label: string;
  value: number;
  max: number;
}

export function ProgressMeter({ label, value, max }: ProgressMeterProps) {
  const percentage = Math.min(100, Math.round((value / max) * 100));

  return (
    <div className="progress-meter">
      <div>
        <span>{label}</span>
        <strong>{value}/{max}</strong>
      </div>
      <div className="meter-track">
        <span style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

interface FactorBarProps {
  factor: InfluencingFactor;
}

export function FactorBar({ factor }: FactorBarProps) {
  const magnitude = Math.min(100, Math.round(Math.abs(factor.contribution) * 420));
  const resistant = factor.direction === 'towards_resistant';

  return (
    <div className="factor-row">
      <div>
        <strong>{factor.label}</strong>
        <span>{factor.value}</span>
      </div>
      <div className="factor-axis" aria-label={`Contribucion ${factor.contribution}`}>
        <span className={resistant ? 'towards-resistant' : 'towards-susceptible'} style={{ width: `${magnitude}%` }} />
      </div>
    </div>
  );
}
