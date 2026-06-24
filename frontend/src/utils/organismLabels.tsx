interface OrganismLabel {
  full: string;
  short: string;
  parts: string[];
  suffix?: string;
}

const organismLabels: Record<string, OrganismLabel> = {
  'ESCHERICHIA COLI': { full: 'Escherichia coli', short: 'E. coli', parts: ['Escherichia', 'coli'] },
  'KLEBSIELLA PNEUMONIAE': { full: 'Klebsiella pneumoniae', short: 'K. pneumoniae', parts: ['Klebsiella', 'pneumoniae'] },
  'STAPHYLOCOCCUS AUREUS': { full: 'Staphylococcus aureus', short: 'S. aureus', parts: ['Staphylococcus', 'aureus'] },
  'PROTEUS MIRABILIS': { full: 'Proteus mirabilis', short: 'P. mirabilis', parts: ['Proteus', 'mirabilis'] },
  'ENTEROCOCCUS SPECIES': { full: 'Enterococcus spp.', short: 'Enterococcus spp.', parts: ['Enterococcus'], suffix: 'spp.' },
  'PSEUDOMONAS AERUGINOSA': { full: 'Pseudomonas aeruginosa', short: 'P. aeruginosa', parts: ['Pseudomonas', 'aeruginosa'] },
};

type Variant = 'full' | 'short';

export function getOrganismLabel(value: string | undefined, variant: Variant = 'full'): string {
  if (!value) return 'Sin registro';
  const label = organismLabels[value];
  if (!label) return value;
  return variant === 'short' ? label.short : label.full;
}

interface OrganismNameProps {
  value: string | undefined;
  variant?: Variant;
}

export function OrganismName({ value, variant = 'full' }: OrganismNameProps) {
  const label = value ? organismLabels[value] : undefined;
  if (!label) return <span>{value || 'Sin registro'}</span>;

  if (label.suffix) {
    // "spp." no es un epiteto de especie; solo el genero bacteriano va en cursiva.
    return (
      <span>
        <em>{label.parts[0]}</em> {label.suffix}
      </span>
    );
  }

  if (variant === 'short') {
    const [genusInitial, species] = label.short.split(' ');
    return (
      <span>
        <em>{genusInitial} {species}</em>
      </span>
    );
  }

  return (
    <span>
      <em>{label.parts.join(' ')}</em>
    </span>
  );
}
