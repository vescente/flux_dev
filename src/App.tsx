import { useMemo, useState } from 'react';
import { parseCsv, classifyColumns, type Dataset } from './lib/csv';
import { SAMPLE_CSV } from './lib/sample';
import { aggregate, fieldValues, possibleRows, toggle, type Selection } from './lib/model';
import { FilterPanel } from './components/FilterPanel';
import { BarChart } from './components/BarChart';
import { DataTable } from './components/DataTable';
import { AiPanel } from './components/AiPanel';

const SAMPLE: Dataset = parseCsv(SAMPLE_CSV);

export function App() {
  const [dataset, setDataset] = useState<Dataset>(SAMPLE);
  const [selection, setSelection] = useState<Selection>({});

  const { dimensions, measures } = useMemo(() => classifyColumns(dataset), [dataset]);
  const [groupDim, setGroupDim] = useState<string>(dimensions[1] ?? dimensions[0] ?? '');
  const [measure, setMeasure] = useState<string>(measures[0] ?? '');

  const rows = useMemo(() => possibleRows(dataset, selection), [dataset, selection]);
  const chartData = useMemo(
    () => (groupDim && measure ? aggregate(rows, groupDim, measure) : []),
    [rows, groupDim, measure],
  );
  const selectedInGroup = useMemo(() => selection[groupDim] ?? new Set<string>(), [selection, groupDim]);

  const onToggle = (field: string, value: string) => setSelection(s => toggle(s, field, value));

  const onLoadFile = (file: File) => {
    file.text().then(text => {
      const ds = parseCsv(text);
      setDataset(ds);
      setSelection({});
      const cls = classifyColumns(ds);
      setGroupDim(cls.dimensions[1] ?? cls.dimensions[0] ?? '');
      setMeasure(cls.measures[0] ?? '');
    });
  };

  const activeFilters = Object.entries(selection).filter(([, v]) => v.size > 0);
  const contextSummary = `Loaded ${dataset.rows.length} rows; ${rows.length} match the current selection.`;

  // available-value count for the current group dimension (associative feel)
  const groupAvailable = groupDim
    ? fieldValues(dataset, groupDim, selection).filter(v => v.state !== 'excluded').length
    : 0;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">Flux <span className="tag">prototype</span></div>
        <div className="controls">
          <label className="file-btn">
            Load CSV
            <input type="file" accept=".csv,text/csv" hidden onChange={e => { const f = e.target.files?.[0]; if (f) onLoadFile(f); }} />
          </label>
          <label>Group by
            <select value={groupDim} onChange={e => setGroupDim(e.target.value)}>
              {dimensions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
          <label>Measure
            <select value={measure} onChange={e => setMeasure(e.target.value)}>
              {measures.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>
          {activeFilters.length > 0 && (
            <button className="clear" onClick={() => setSelection({})}>Clear {activeFilters.length} filter(s)</button>
          )}
        </div>
      </header>

      <main className="layout">
        <FilterPanel dataset={dataset} dimensions={dimensions} selection={selection} onToggle={onToggle} />
        <section className="center">
          <BarChart data={chartData} measure={measure} onSelect={key => onToggle(groupDim, key)} selectedKeys={selectedInGroup} />
          <p className="muted small">{groupAvailable} of {new Set(dataset.rows.map(r => String(r[groupDim]))).size} “{groupDim}” values available under the current selection.</p>
          <DataTable columns={dataset.columns} rows={rows} />
        </section>
        <AiPanel contextSummary={contextSummary} />
      </main>
    </div>
  );
}
