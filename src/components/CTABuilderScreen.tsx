import React, { useState } from 'react';
import '../styles/cta-builder.css';

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

  const [ctaOptions, setCTAOptions] = useState<CTAOption[]>([
    {
      id: '1',
      type: 'DM CTA',
      text: 'DM me "interested" and I\'ll send you the blueprint.',
      score: 92,
      icon: '💬',
    },
    {
      id: '2',
      type: 'Book Call CTA',
      text: 'Reply with "CALL" and let\'s talk through your specific situation.',
      score: 88,
      icon: '📞',
    },
    {
      id: '3',
      type: 'Application CTA',
      text: 'Ready to work together? Link in bio to apply.',
      score: 85,
      icon: '🔗',
    },
    {
      id: '4',
      type: 'Newsletter CTA',
      text: 'This is just the tip — full breakdown in my newsletter (100k+ subscribers).',
      score: 72,
      icon: '📧',
    },
  ]);

  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleGenerate = () => {
    // Simulate generating new CTAs
    alert('Generating CTAs optimized for: ' + context.goal);
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

            <button className="generate-cta-btn" onClick={handleGenerate}>
              ✨ Generate CTAs
            </button>
          </div>

          <div className="cta-results-section">
            <h2>Your CTAs (Ranked)</h2>
            <div className="cta-list">
              {ctaOptions.map((cta) => (
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
              ))}
            </div>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTABuilderScreen;
