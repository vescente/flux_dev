interface Props {
  data: { key: string; value: number }[];
  measure: string;
  onSelect: (key: string) => void;
  selectedKeys: Set<string>;
}

// A hand-rolled horizontal SVG bar chart — no chart library. Bars are
// clickable: a click selects that category (drives the associative filter).
export function BarChart({ data, measure, onSelect, selectedKeys }: Props) {
  const max = Math.max(1, ...data.map(d => d.value));
  const barH = 26;
  const gap = 8;
  const labelW = 110;
  const width = 460;
  const height = data.length * (barH + gap) + gap;

  return (
    <div className="panel chart">
      <h2>{measure} by category</h2>
      {data.length === 0 ? (
        <p className="empty">No data for the current selection.</p>
      ) : (
        <svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${measure} by category`}>
          {data.map((d, i) => {
            const y = gap + i * (barH + gap);
            const w = Math.round(((width - labelW - 60) * d.value) / max);
            const active = selectedKeys.has(d.key);
            return (
              <g key={d.key} className="bar-row" onClick={() => onSelect(d.key)} style={{ cursor: 'pointer' }}>
                <text x={labelW - 8} y={y + barH / 2} textAnchor="end" dominantBaseline="middle" className="bar-label">{d.key}</text>
                <rect x={labelW} y={y} width={w} height={barH} rx={3} className={active ? 'bar bar--active' : 'bar'} />
                <text x={labelW + w + 6} y={y + barH / 2} dominantBaseline="middle" className="bar-value">{d.value.toLocaleString()}</text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
