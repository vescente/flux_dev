import type { Dataset, Row } from '../lib/csv';

interface Props {
  columns: string[];
  rows: Row[];
  limit?: number;
}

export function DataTable({ columns, rows, limit = 100 }: Props) {
  const shown = rows.slice(0, limit);
  return (
    <div className="panel table">
      <h2>Rows <span className="muted">({rows.length.toLocaleString()})</span></h2>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>{columns.map(c => <th key={c}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {shown.map((r, i) => (
              <tr key={i}>{columns.map(c => <td key={c}>{String(r[c] ?? '')}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > limit && <p className="muted">Showing first {limit} of {rows.length.toLocaleString()}.</p>}
    </div>
  );
}

export type { Dataset };
