import type { CaseData, SelectOption } from '../types';
import type { FieldTuple } from '../data/formOptions';

interface GroupTitleProps {
  title: string;
  onHelp?: () => void;
}

export function GroupTitle({ title, onHelp }: GroupTitleProps) {
  return (
    <div className="group-title">
      <h2>{title}</h2>
      {onHelp ? (
        <button className="link-action" onClick={onHelp} type="button">
          Ayuda
        </button>
      ) : null}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  required?: boolean;
}

export function SelectField({ label, value, options, onChange, required = false }: SelectFieldProps) {
  const isScientificSelect = options.some((option) => typeof option !== 'string' && option.scientificName);

  return (
    <label className="field-card">
      <span>{label}{required ? ' *' : ''}</span>
      <select
        className={isScientificSelect ? 'scientific-select' : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Seleccione...</option>
        {options.map((option) => {
          const optionValue = typeof option === 'string' ? option : option.value;
          const optionLabel = typeof option === 'string' ? option : option.label;
          return (
            <option
              className={typeof option !== 'string' && option.scientificName ? 'scientific-option' : undefined}
              key={optionValue}
              value={optionValue}
            >
              {optionLabel}
            </option>
          );
        })}
      </select>
    </label>
  );
}

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

export function InputField({ label, value, onChange, type = 'text', placeholder = '', required = false }: InputFieldProps) {
  return (
    <label className="field-card">
      <span>{label}{required ? ' *' : ''}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

interface CheckGridProps {
  fields: FieldTuple[];
  values: CaseData;
  updateField: (field: string, value: boolean) => void;
}

export function CheckGrid({ fields, values, updateField }: CheckGridProps) {
  return (
    <div className="check-grid">
      {fields.map(([field, label]) => (
        <label className="check-item" key={field}>
          <input
            checked={Boolean(values[field])}
            type="checkbox"
            onChange={(event) => updateField(field, event.target.checked)}
          />
          <span>{label}</span>
        </label>
      ))}
    </div>
  );
}
