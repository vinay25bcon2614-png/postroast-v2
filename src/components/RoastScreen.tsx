import React, { useState } from 'react';
import '../components/screens.css';

export function RoastScreen() {
  const [postText, setPostText] = useState('');
  const [mode, setMode] = useState('full-roast');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleRoast = async () => {
    setLoading(true);
    setTimeout(() => {
      setResult({ score: 82, feedback: 'Strong post!' });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="screen-container">
      <div className="screen-header">
        <h2>Roast Engine</h2>
        <p>Get detailed feedback on your content</p>
      </div>
      <div className="roast-container">
        <div className="roast-form">
          <textarea className="roast-textarea" placeholder="Paste your post..." value={postText} onChange={(e) => setPostText(e.target.value)} />
          <div className="roast-modes">
            <button className={mode-btn } onClick={() => setMode('full-roast')}>Full Roast</button>
            <button className={mode-btn } onClick={() => setMode('hook')}>Hook</button>
            <button className={mode-btn } onClick={() => setMode('rewrite')}>Rewrite</button>
            <button className={mode-btn } onClick={() => setMode('audit')}>Audit</button>
          </div>
          <button className="btn-primary" onClick={handleRoast} disabled={!postText || loading}>{loading ? 'Analyzing...' : 'Roast'}</button>
        </div>
        {result && (
          <div className="roast-results">
            <div className="score-display">
              <p className="main-score">{result.score}</p>
              <p className="score-subtitle">Content Score</p>
            </div>
            <p>{result.feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoastScreen;
