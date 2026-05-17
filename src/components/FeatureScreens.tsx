import React, { useState } from 'react';
import '../styles/feature-screens.css';

export const HookBuilderScreen: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('');

  const hookTypes = [
    {
      id: 'problem',
      name: 'Problem Hook',
      desc: 'Start with the pain point',
      example: '"You\'re wasting $5K/month on the wrong tools..."',
    },
    {
      id: 'contrarian',
      name: 'Contrarian',
      desc: 'Challenge the norm',
      example: '"Everyone gets this wrong..."',
    },
    {
      id: 'story',
      name: 'Story Hook',
      desc: 'Personal experience',
      example: '"I almost gave up yesterday..."',
    },
    {
      id: 'stat',
      name: 'Stat Hook',
      desc: 'Lead with numbers',
      example: '"87% of creators miss this..."',
    },
  ];

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
          <h1>🪝 Hook Builder</h1>
          <p>Craft hooks that stop the scroll</p>
        </div>

        <div className="hooks-grid">
          {hookTypes.map((hook) => (
            <div
              key={hook.id}
              className={`hook-card ${selectedType === hook.id ? 'selected' : ''}`}
              onClick={() => setSelectedType(hook.id)}
            >
              <h3>{hook.name}</h3>
              <p className="hook-desc">{hook.desc}</p>
              <div className="hook-example">
                <em>{hook.example}</em>
              </div>
            </div>
          ))}
        </div>

        <div className="hook-suggestions">
          <h2>Suggested Hooks for Your Post</h2>
          {selectedType && (
            <div className="suggestions-list">
              <div className="suggestion-item">
                <div className="suggestion-copy">
                  "Most people don't realize the real problem..."
                </div>
                <button className="copy-btn">Copy</button>
              </div>
              <div className="suggestion-item">
                <div className="suggestion-copy">
                  "Here's what separates winners from everyone else..."
                </div>
                <button className="copy-btn">Copy</button>
              </div>
              <div className="suggestion-item">
                <div className="suggestion-copy">
                  "I discovered this by accident last week..."
                </div>
                <button className="copy-btn">Copy</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const PrePostAuditScreen: React.FC = () => {
  const checks = [
    { passed: true, label: 'Hook stops the scroll', desc: 'Strong opening sentence' },
    { passed: true, label: 'Clear value prop', desc: 'Reader knows what they\'ll learn' },
    { passed: false, label: 'Authority proof', desc: 'Add social proof or data' },
    { passed: true, label: 'CTA is clear', desc: 'Reader knows next step' },
    { passed: true, label: 'Under 400 words', desc: 'Post is scannable' },
  ];

  const score = 80;

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
          <h1>📋 Pre-Post Audit</h1>
          <p>Is your post ready to ship?</p>
        </div>

        <div className="audit-container">
          <div className="audit-score">
            <div className="score-circle">
              <div className="score-number">{score}</div>
              <div className="score-max">/100</div>
            </div>
            <div className="score-status">
              {score >= 80 ? '✅ Ready to post!' : '⚠️ Needs work'}
            </div>
          </div>

          <div className="audit-checks">
            {checks.map((check, idx) => (
              <div
                key={idx}
                className={`check-item ${check.passed ? 'passed' : 'failed'}`}
              >
                <div className="check-icon">
                  {check.passed ? '✓' : '✗'}
                </div>
                <div className="check-content">
                  <div className="check-label">{check.label}</div>
                  <div className="check-desc">{check.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <button className="primary-btn">Post to LinkedIn</button>
        </div>
      </div>
    </div>
  );
};

export const AnalyticsScreen: React.FC = () => {
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
          <h1>📊 Analytics</h1>
          <p>Your posting performance over time</p>
        </div>

        <div className="analytics-grid">
          <div className="analytics-card">
            <h3>Impressions Trend</h3>
            <div className="chart-placeholder">
              <div className="chart-bar" style={{ height: '60%' }}></div>
              <div className="chart-bar" style={{ height: '75%' }}></div>
              <div className="chart-bar" style={{ height: '55%' }}></div>
              <div className="chart-bar" style={{ height: '80%' }}></div>
              <div className="chart-bar" style={{ height: '70%' }}></div>
            </div>
          </div>

          <div className="analytics-card">
            <h3>Engagement by Goal</h3>
            <div className="goal-stats">
              <div className="goal-stat">
                <span>Get Clients</span>
                <span>45%</span>
              </div>
              <div className="goal-stat">
                <span>Build Audience</span>
                <span>35%</span>
              </div>
              <div className="goal-stat">
                <span>Authority</span>
                <span>20%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LeaderboardScreen: React.FC = () => {
  const creators = [
    { rank: 1, name: 'Justin Welsh', score: 94, posts: 342 },
    { rank: 2, name: 'Alex Hormozi', score: 89, posts: 287 },
    { rank: 3, name: 'Chris Orlob', score: 86, posts: 251 },
    { rank: 4, name: 'Lara Acosta', score: 83, posts: 198 },
    { rank: 5, name: 'Matt', score: 81, posts: 176 },
  ];

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
          <h1>🏆 Creator Leaderboard</h1>
          <p>Top performing creators in PostRoast</p>
        </div>

        <div className="leaderboard-list">
          {creators.map((creator) => (
            <div key={creator.rank} className="leaderboard-row">
              <div className="rank-badge">{creator.rank}</div>
              <div className="creator-info">
                <div className="creator-name">{creator.name}</div>
                <div className="creator-posts">{creator.posts} posts analyzed</div>
              </div>
              <div className="creator-score">{creator.score}/100</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HookBuilderScreen;
