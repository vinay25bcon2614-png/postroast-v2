import { useState } from 'react';

export default function StyleDNAPage() {
  const [applyStyle, setApplyStyle] = useState(true);

  return (
    <section className="card">
      <h3 style={{ marginTop: 0 }}>Your Writing DNA</h3>
      <p className="muted">Unlocked after analyzing 8 posts</p>
      <ul className="muted" style={{ lineHeight: 1.9 }}>
        <li>Pattern: Problem → Contrarian insight → Practical close</li>
        <li>Tone: Direct, confident, anti-fluff</li>
        <li>Common structures: Numbered lists and mini-case studies</li>
      </ul>
      <label className="toggle">
        <input type="checkbox" checked={applyStyle} onChange={(e) => setApplyStyle(e.target.checked)} />
        <span>Apply Style DNA to rewrites</span>
      </label>
    </section>
  );
}
