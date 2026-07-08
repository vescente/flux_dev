import type { Dataset } from '../lib/csv';
import { fieldValues, type Selection } from '../lib/model';

interface Props {
  dataset: Dataset;
  dimensions: string[];
  selection: Selection;
  onToggle: (field: string, value: string) => void;
}

export function FilterPanel({ dataset, dimensions, selection, onToggle }: Props) {
  return (
    <aside className="panel filters">
      <h2>Filters</h2>
      {dimensions.map(dim => (
        <div key={dim} className="filter-field">
          <div className="filter-field-name">{dim}</div>
          <div className="filter-values">
            {fieldValues(dataset, dim, selection).map(({ value, state }) => (
              <button
                key={value}
                className={`value value--${state}`}
                onClick={() => onToggle(dim, value)}
                title={state}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
