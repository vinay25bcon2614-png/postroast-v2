const baseFormats = [
  'Insider Leak', 'Case Study', 'Contrarian Take', 'Before/After Story',
  'Mistake List', 'Framework Breakdown', 'Hard Truth', 'Hot Take + CTA',
  'Playbook Post', 'Founder Memo', 'Trend Prediction', 'Mini-Rant',
  'Client Win', 'Debunked Myth', 'Unpopular Opinion', 'Step-by-Step',
  'Personal Failure', 'Revenue Breakdown', 'Tactical Checklist', 'Data Drop',
  'Story Arc', 'Lessons Learned', 'Build in Public', 'Open Loop',
  'AMA Prompt', 'Swipe File', 'Hiring Insight', 'No-BS Advice',
  'Community Question', 'Tool Stack Reveal', 'Decision Journal', 'Industry Leak'
];

export default function FormatLibrary() {
  return (
    <section className="format-grid">
      {baseFormats.map((name, idx) => (
        <article key={name} className="card format-card">
          <strong>{idx + 1}. {name}</strong>
          <span className="muted small">Use this when you want stronger hooks and clearer positioning.</span>
          <span className="small">Preview: “Most people in my niche miss this simple pattern...”</span>
          <button className="primary-btn">Use this template</button>
        </article>
      ))}
    </section>
  );
}
