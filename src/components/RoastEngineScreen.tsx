import React, { useState } from 'react';
import '../styles/roast-engine.css';

export const RoastEngineScreen: React.FC = () => {
  const [postContent, setPostContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleRoast = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setScore(Math.floor(Math.random() * 40 + 60));
      setLoading(false);
    }, 2000);
  };

  const handleRewrite = () => {
    alert('Rewriting post based on goal-specific framework...');
  };

  return (
    <div className="roast-layout">
      <div className="roast-navbar">
        <div className="navbar-left">
          <div className="logo-small">
            <div className="logo-mark">P</div>
            PostRoast
          </div>
          <nav className="nav-tabs">
            <div className="nav-tab">Dashboard</div>
            <div className="nav-tab active">Roast</div>
            <div className="nav-tab">Formats</div>
            <div className="nav-tab">DNA</div>
          </nav>
        </div>
        <div className="navbar-right">
          <div className="flame-badge">
            <span>🔥</span>
            <span>9d</span>
          </div>
          <button className="upgrade-btn">Upgrade</button>
          <div className="user-avatar">AK</div>
        </div>
      </div>

      <div className="roast-container">
        <div className="roast-left">
          <div className="compose-section">
            <div className="compose-header">
              <h2>Paste your LinkedIn post</h2>
              <p>Get instant feedback & AI-powered rewrites</p>
            </div>

            <div className="compose-card">
              <div className="compose-toolbar">
                <div className="compose-tabs">
                  <div className="compose-tab active">Draft</div>
                  <div className="compose-tab">Rewrite</div>
                </div>
              </div>

              <textarea
                className="compose-textarea"
                placeholder="Paste your post here..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />

              <div className="compose-footer">
                <div className="char-count">
                  {postContent.length} characters
                </div>
                <button
                  className="roast-btn"
                  onClick={handleRoast}
                  disabled={!postContent || loading}
                >
                  {loading ? '🔥 Roasting...' : '🔥 Roast It'}
                </button>
              </div>
            </div>
          </div>

          <div className="formats-section">
            <h3 className="section-title">📚 Format Library</h3>
            <div className="format-grid">
              <div className="format-item">
                <div className="format-icon">📖</div>
                <div className="format-name">Story Arc</div>
                <div className="format-desc">Personal story + lesson</div>
              </div>
              <div className="format-item">
                <div className="format-icon">🎯</div>
                <div className="format-name">Problem-Solve</div>
                <div className="format-desc">Pain → Solution → CTA</div>
              </div>
              <div className="format-item">
                <div className="format-icon">💡</div>
                <div className="format-name">Framework</div>
                <div className="format-desc">Teach a method</div>
              </div>
              <div className="format-item">
                <div className="format-icon">📊</div>
                <div className="format-name">Data-Driven</div>
                <div className="format-desc">Stats + insight</div>
              </div>
            </div>
          </div>
        </div>

        <div className="roast-right">
          {score !== null ? (
            <div className="roast-results">
              <div className="score-big">
                <div className="score-number">{score}</div>
                <div className="score-label">/100</div>
              </div>

              <div className="ai-notice">
                <span className="ai-icon">✨</span>
                <div className="ai-text">
                  <b>AI Analysis:</b> Strong hook & clear CTA. Consider
                  adding more social proof.
                </div>
              </div>

              <div className="metrics">
                <div className="metric-row">
                  <span className="metric-name">Hook Strength</span>
                  <div className="metric-bar">
                    <div className="metric-fill" style={{ width: '78%' }}></div>
                  </div>
                  <span className="metric-val">78%</span>
                </div>
                <div className="metric-row">
                  <span className="metric-name">Specificity</span>
                  <div className="metric-bar">
                    <div className="metric-fill" style={{ width: '82%' }}></div>
                  </div>
                  <span className="metric-val">82%</span>
                </div>
                <div className="metric-row">
                  <span className="metric-name">Authority</span>
                  <div className="metric-bar">
                    <div className="metric-fill" style={{ width: '65%' }}></div>
                  </div>
                  <span className="metric-val">65%</span>
                </div>
                <div className="metric-row">
                  <span className="metric-name">CTA Clarity</span>
                  <div className="metric-bar">
                    <div className="metric-fill" style={{ width: '88%' }}></div>
                  </div>
                  <span className="metric-val">88%</span>
                </div>
              </div>

              <div className="feedback-card">
                <h4>What's working:</h4>
                <ul className="feedback-list">
                  <li>✓ Relatable hook</li>
                  <li>✓ Clear value prop</li>
                  <li>✓ Strong CTA</li>
                </ul>
              </div>

              <div className="feedback-card">
                <h4>Room for improvement:</h4>
                <ul className="feedback-list improve">
                  <li>! Add a number or statistic</li>
                  <li>! Show specific results</li>
                </ul>
              </div>

              <button className="rewrite-btn" onClick={handleRewrite}>
                ✨ Get Rewrite
              </button>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>Paste a post to analyze</h3>
              <p>We'll score it and give you actionable feedback</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoastEngineScreen;
