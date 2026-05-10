import { useMemo, useState } from 'react';

const goals = ['Get Clients', 'Grow Audience', 'Thought Leader', 'Brand Awareness'];

const suggestions: Record<string, string[]> = {
  'Get Clients': ['Case Study', 'Insider Leak', 'Problem-Solution'],
  'Grow Audience': ['Contrarian Take', 'Mistake List', 'Hot Take + CTA'],
  'Thought Leader': ['Framework Drop', 'Research Breakdown', 'Prediction Post'],
  'Brand Awareness': ['Founder Story', 'Mission Thread', 'Behind-the-Scenes'],
};

interface ComposerPanelProps {
  onSubmit: (text: string, goal: string) => void;
  loading: boolean;
}

export default function ComposerPanel({ onSubmit, loading }: ComposerPanelProps) {
  const [goal, setGoal] = useState('Get Clients');
  const [text, setText] = useState('Most LinkedIn advice makes founders sound the same.\n\nI tried that for months and got polite likes, zero leads.');

  const goalSuggestions = useMemo(() => suggestions[goal], [goal]);

  return (
    <section className="card">
      <div className="row-between" style={{ marginBottom: 12 }}>
        <strong>Compose</strong>
        <span className="muted small">{text.length} chars</span>
      </div>

      <div className="goal-row" style={{ marginBottom: 12 }}>
        {goals.map((item) => (
          <button key={item} className={`pill ${goal === item ? 'active' : ''}`} onClick={() => setGoal(item)}>
            {item}
          </button>
        ))}
      </div>

      <textarea
        className="textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your LinkedIn draft..."
      />

      <div className="row-between" style={{ marginTop: 12 }}>
        <div className="muted small">Suggested formats: {goalSuggestions.join(' · ')}</div>
        <button className="primary-btn" onClick={() => onSubmit(text, goal)} disabled={loading || !text.trim()}>
          {loading ? 'Roasting...' : 'Roast & Rewrite'}
        </button>
      </div>
    </section>
  );
}
