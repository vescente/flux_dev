import { useState } from 'react';

// Placeholder for the planned natural-language assistant. This is the surface
// the roadmap's AI work plugs into — today it only echoes a canned reply so the
// interaction shape is visible. No model is wired yet.
export function AiPanel({ contextSummary }: { contextSummary: string }) {
  const [q, setQ] = useState('');
  const [log, setLog] = useState<{ role: 'you' | 'flux'; text: string }[]>([]);

  const ask = () => {
    const question = q.trim();
    if (!question) return;
    setLog(l => [
      ...l,
      { role: 'you', text: question },
      { role: 'flux', text: 'The assistant is not connected yet. Planned: answer questions about this dataset in natural language and drive selections. ' + contextSummary },
    ]);
    setQ('');
  };

  return (
    <aside className="panel ai">
      <h2>Assistant <span className="badge">preview</span></h2>
      <div className="ai-log">
        {log.length === 0 && <p className="muted">Ask a question about the data. (Not wired yet — roadmap.)</p>}
        {log.map((m, i) => (
          <div key={i} className={`ai-msg ai-msg--${m.role}`}><b>{m.role}:</b> {m.text}</div>
        ))}
      </div>
      <div className="ai-input">
        <input
          value={q}
          placeholder="e.g. which region sells the most?"
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') ask(); }}
        />
        <button onClick={ask}>Ask</button>
      </div>
    </aside>
  );
}
