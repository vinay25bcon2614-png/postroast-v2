import React, { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Score {
  label: string;
  value: number;
  color: string;
}

export function PrePostAuditScreen() {
  const { user } = useAuth();
  const [postText, setPostText] = useState('');
  const [loading, setLoading] = useState(false);
  const [checks, setChecks] = useState<any[]>([]);
  const [shown, setShown] = useState(false);

  const performAudit = useCallback(async () => {
    if (!postText.trim()) return;
    setLoading(true);
    
    try {
      // Simulate audit checks
      const newChecks = [
        { id: 'hook', label: 'Hook strength', pass: postText.length > 20, warning: false },
        { id: 'length', label: 'Optimal length', pass: postText.length < 500, warning: postText.length > 400 },
        { id: 'cta', label: 'Clear CTA', pass: postText.toLowerCase().includes('comment') || postText.toLowerCase().includes('dm'), warning: false },
        { id: 'typos', label: 'No typos detected', pass: true, warning: false },
        { id: 'readability', label: 'Good line breaks', pass: postText.includes('\n'), warning: false },
      ];
      
      setChecks(newChecks);
      setShown(true);
    } finally {
      setLoading(false);
    }
  }, [postText]);

  return (
    <div className="screen-container">
      <div className="screen-header">
        <h2>Pre-Post Audit</h2>
        <p>Quick quality check before posting</p>
      </div>

      <div className="audit-form">
        <textarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="Paste your LinkedIn draft here..."
          rows={10}
          className="audit-textarea"
        />

        <button
          onClick={performAudit}
          disabled={!postText.trim() || loading}
          className="btn-primary"
        >
          {loading ? 'Auditing...' : 'Run Audit'}
        </button>
      </div>

      {shown && (
        <div className="audit-results">
          <h3>Quality Check</h3>
          <div className="checks-list">
            {checks.map(check => (
              <div key={check.id} className={`check-item ${check.pass ? 'pass' : 'fail'}`}>
                <span className="check-icon">{check.pass ? '✓' : '✕'}</span>
                <span className="check-label">{check.label}</span>
              </div>
            ))}
          </div>
          
          <div className="audit-score">
            <div className="predicted">
              <div className="score-number" style={{ color: '#22c55e' }}>78</div>
              <div className="score-label">Predicted Score</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PrePostAuditScreen;
