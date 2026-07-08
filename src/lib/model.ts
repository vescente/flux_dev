// A tiny associative selection model — the conceptual heart of the prototype.
// Selecting values in one field narrows what is "possible" everywhere else, and
// each value in a field is classified relative to the selections in the OTHER
// fields (selected / available / excluded). This is deliberately naive and
// in-memory — a demonstration of the interaction model, not a data engine.
import type { Dataset, Row } from './csv';

export type Selection = Record<string, Set<string>>;
export type ValueState = 'selected' | 'available' | 'excluded';

const matches = (row: Row, sel: Selection, skip?: string): boolean => {
  for (const field of Object.keys(sel)) {
    if (field === skip) continue;
    const set = sel[field];
    if (set && set.size > 0 && !set.has(String(row[field]))) return false;
  }
  return true;
};

/** Rows that satisfy every active selection. */
export function possibleRows(ds: Dataset, sel: Selection): Row[] {
  return ds.rows.filter(r => matches(r, sel));
}

/** Distinct values of a field with their associative state. A value is
 *  'available' when it survives the selections in all OTHER fields. */
export function fieldValues(ds: Dataset, field: string, sel: Selection): { value: string; state: ValueState }[] {
  const selected = sel[field] ?? new Set<string>();
  const survivors = new Set(
    ds.rows.filter(r => matches(r, sel, field)).map(r => String(r[field])),
  );
  const distinct = Array.from(new Set(ds.rows.map(r => String(r[field])))).sort();
  return distinct.map(value => ({
    value,
    state: selected.has(value) ? 'selected' : survivors.has(value) ? 'available' : 'excluded',
  }));
}

/** Sum a measure over the given rows, grouped by a dimension. */
export function aggregate(rows: Row[], dim: string, measure: string): { key: string; value: number }[] {
  const acc = new Map<string, number>();
  for (const r of rows) {
    const k = String(r[dim]);
    acc.set(k, (acc.get(k) ?? 0) + (typeof r[measure] === 'number' ? (r[measure] as number) : 0));
  }
  return Array.from(acc, ([key, value]) => ({ key, value })).sort((a, b) => b.value - a.value);
}

export function toggle(sel: Selection, field: string, value: string): Selection {
  const next: Selection = {};
  for (const k of Object.keys(sel)) next[k] = new Set(sel[k]);
  const set = next[field] ?? new Set<string>();
  if (set.has(value)) set.delete(value);
  else set.add(value);
  if (set.size === 0) delete next[field];
  else next[field] = set;
  return next;
}
