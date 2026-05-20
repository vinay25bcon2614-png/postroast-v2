import React, { useState } from 'react';
import '../styles/cta-builder.css';
import { API_BASE_URL } from '../lib/apiConfig';

interface CTAOption {
  id: string;
  type: string;
  text: string;
  score: number;
  icon: string;
}

export const CTABuilderScreen: React.FC = () => {
  const [context, setContext] = useState({
    goal: 'clients',
    topic: '',
    audience: '',
  });

  const [ctaOptions, setCTAOptions] = useState<CTAOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleGenerate = async () => {
    try {
      if (!context.topic.trim() || !context.audience.trim()) {
        setError('Please fill in topic and audience');
        return;
      }

      setLoading(true);
      setError(null);

      const { data: { session } } = await (window as any).supabase.auth.getSession();
      if (!session) {
        setError('You must be logged in to generate CTAs');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/cta/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          goal: context.goal,
          topic: context.topic,
          audience: context.audience
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate CTAs');
      }

      const data = await response.json();
      const generatedCTAs = Array.isArray(data.ctas) ? data.ctas.map((cta: any, idx: number) => ({
        id: String(idx + 1),
        type: cta.type || 'CTA',
        text: cta.text || cta,
        score: cta.score || 80,
        icon: cta.icon || '💬'
      })) : [];
      
      setCTAOptions(generatedCTAs);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Error generating CTAs');
      setLoading(false);
    }
  };

  const goalDescriptions = {
    clients: 'Get Clients — Focus on direct action (DM, call booking, application)',
    growth: 'Build Audience — Focus on engagement (comment, follow, repost)',
    authority: 'Thought Leader — Focus on discussion (what do you think, reply)',
  };

  return (
    <div className="feature-screen">
      <div className="feature-navbar">
        <div className="navbar-left">
          <div className="logo-small">
            <div className="logo-mark">P</div>
            PostRoast
          </div>
        </div>
        <div className="navbar-right">
          <div className="flame-badge">
            <span>🔥</span>
            <span>9d</span>
          </div>
          <button className="upgrade-btn">Upgrade</button>
        </div>
      </div>

      <div className="feature-content">
        <div className="content-header">
          <h1>📞 CTA Builder</h1>
          <p>Generate goal-optimized calls-to-action</p>
        </div>

        <div className="cta-builder-container">
          <div className="cta-input-section">
            <h2>Context</h2>

            <div className="form-group">
              <label className="form-label">Primary Goal</label>
              <div className="goal-selector">
                {['clients', 'growth', 'authority'].map((goal) => (
                  <button
                    key={goal}
                    className={`goal-option ${
                      context.goal === goal ? 'active' : ''
                    }`}
                    onClick={() => setContext({ ...context, goal })}
                  >
                    {goal === 'clients' && '💰 Get Clients'}
                    {goal === 'growth' && '📈 Build Audience'}
                    {goal === 'authority' && '🎓 Authority'}
                  </button>
                ))}
              </div>
              <div className="goal-hint">
                {goalDescriptions[context.goal as keyof typeof goalDescriptions]}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Post Topic</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 'How to land $100k contracts'"
                value={context.topic}
                onChange={(e) =>
                  setContext({ ...context, topic: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Audience</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 'B2B SaaS founders'"
                value={context.audience}
                onChange={(e) =>
                  setContext({ ...context, audience: e.target.value })
                }
              />
            </div>

            {error && <div style={{ color: 'var(--bad)', fontSize: '14px' }}>{error}</div>}
            <button className="generate-cta-btn" onClick={handleGenerate} disabled={loading}>
              {loading ? '⏳ Generating...' : '✨ Generate CTAs'}
            </button>
          </div>

          <div className="cta-results-section">
            <h2>Your CTAs {ctaOptions.length > 0 && `(${ctaOptions.length} Generated)`}</h2>
            <div className="cta-list">
              {ctaOptions.length > 0 ? (
                ctaOptions.map((cta) => (
                  <div key={cta.id} className="cta-option">
                    <div className="cta-header">
                      <span className="cta-icon">{cta.icon}</span>
                      <span className="cta-type">{cta.type}</span>
                      <span className="cta-score">{cta.score}/100</span>
                    </div>
                    <div className="cta-text">{cta.text}</div>
                    <div className="cta-footer">
                      <button
                        className={`copy-cta-btn ${
                          copied === cta.id ? 'copied' : ''
                        }`}
                        onClick={() => handleCopy(cta.text, cta.id)}
                      >
                        {copied === cta.id ? '✓ Copied' : 'Copy'}
                      </button>
                      <button className="use-cta-btn">Use in post</button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--t2)' }}>
                  Fill in the context above and generate CTAs
                </div>
              )}
            </div>

            {ctaOptions.length > 0 && (
              <div className="cta-tips">
                <h3>CTA Best Practices</h3>
                <ul>
                  <li>
                    <strong>DM CTAs:</strong> Highest conversion for paid offers
                  </li>
                  <li>
                    <strong>Comment CTAs:</strong> Best for engagement & virality
                  </li>
                  <li>
                    <strong>Link CTAs:</strong> For lead capture & funnels
                  </li>
                  <li>
                    <strong>Newsletter CTAs:</strong> Builds audience, low friction
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTABuilderScreen;
