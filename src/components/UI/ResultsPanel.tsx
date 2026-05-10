import { useState } from 'react';
import ScoreCard from './ScoreCard';

const scores = [
  { label: 'Hook Strength', score: 72 },
  { label: 'Clarity', score: 78 },
  { label: 'Authority', score: 69 },
  { label: 'Engagement Potential', score: 74 },
];

export default function ResultsPanel() {
  const [tab, setTab] = useState<'score' | 'rewrite' | 'suggestions'>('score');

  return (
    <section className="card">
      <div className="tabs" style={{ marginBottom: 12 }}>
        {(['score', 'rewrite', 'suggestions'] as const).map((item) => (
          <button key={item} className={`tab ${tab === item ? 'active' : ''}`} onClick={() => setTab(item)}>
            {item[0].toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'score' && <ScoreCard overall={73} metrics={scores} />}

      {tab === 'rewrite' && (
        <div>
          <div className="row-between" style={{ marginBottom: 10 }}>
            <strong>Rewrite Output</strong>
            <span className="pill active">+21 score improvement</span>
          </div>
          <div className="diff-grid">
            <article className="diff-col">
              Most founders treat LinkedIn like a press release. I did too, and got no pipeline.
            </article>
            <article className="diff-col">
              Most founders write LinkedIn posts like <mark>corporate announcements</mark>.\n\nI did it for 6 months and got <mark>zero inbound leads</mark>.\n\nWhen I switched to <mark>problem-first posts with proof</mark>, demos started landing in my inbox.
            </article>
          </div>
          <div className="row-between" style={{ marginTop: 10 }}>
            <span className="muted small">Visual diff highlight enabled</span>
            <button className="primary-btn">Copy Rewrite</button>
          </div>
        </div>
      )}

      {tab === 'suggestions' && (
        <ul className="muted" style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
          <li>Open with one specific pain your buyer feels.</li>
          <li>Add one proof point (metric, timeline, outcome).</li>
          <li>End with a low-friction CTA.</li>
          <li>Use shorter line breaks for scannability.</li>
        </ul>
      )}
    </section>
  );
}
