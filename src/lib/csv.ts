// Minimal RFC-4180-ish CSV parser — enough for the prototype's "load a file"
// path. Handles quoted fields, escaped quotes, and comma/newline inside quotes.
export type Row = Record<string, string | number>;
export interface Dataset {
  columns: string[];
  rows: Row[];
}

function parseLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else inQuotes = false;
      } else cur += ch;
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      out.push(cur); cur = '';
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

const isNumeric = (v: string) => v !== '' && !Number.isNaN(Number(v));

export function parseCsv(text: string): Dataset {
  const lines = text.replace(/\r\n?/g, '\n').split('\n').filter(l => l.trim() !== '');
  if (lines.length === 0) return { columns: [], rows: [] };
  const columns = parseLine(lines[0]).map(c => c.trim());
  const rows: Row[] = lines.slice(1).map(line => {
    const cells = parseLine(line);
    const row: Row = {};
    columns.forEach((col, i) => {
      const raw = (cells[i] ?? '').trim();
      row[col] = isNumeric(raw) ? Number(raw) : raw;
    });
    return row;
  });
  return { columns, rows };
}

// Split columns into dimensions (categorical) and measures (numeric) by sampling.
export function classifyColumns(ds: Dataset): { dimensions: string[]; measures: string[] } {
  const dimensions: string[] = [];
  const measures: string[] = [];
  for (const col of ds.columns) {
    const sample = ds.rows.slice(0, 50).map(r => r[col]);
    const numericShare = sample.filter(v => typeof v === 'number').length / Math.max(1, sample.length);
    if (numericShare > 0.8) measures.push(col);
    else dimensions.push(col);
  }
  return { dimensions, measures };
}
