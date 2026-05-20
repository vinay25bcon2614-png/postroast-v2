import React, { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../lib/apiConfig';

interface Score {
  label: string;
  value: number;
  color: string;
}

export function PrePostAuditScreen() {
  const { user } = useAuth();
  const [postText, setPostText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checks, setChecks] = useState<any[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [shown, setShown] = useState(false);

  const performAudit = useCallback(async () => {
    if (!postText.trim()) return;
    
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await (window as any).supabase.auth.getSession();
      if (!session) {
        setError('You must be logged in to run an audit');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/audit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          content: postText
        })
      });

      if (!response.ok) {
        throw new Error('Failed to run audit');
      }

      const data = await response.json();
      
      // Map API response to checks
      const newChecks = [
        { id: 'hook', label: 'Hook strength', pass: data.hookScore > 6, warning: false },
        { id: 'length', label: 'Optimal length', pass: postText.length > 50 && postText.length < 1000, warning: postText.length > 800 },
        { id: 'cta', label: 'Clear CTA', pass: data.hasCTA, warning: false },
        { id: 'typos', label: 'Grammar quality', pass: data.grammarScore > 7, warning: false },
        { id: 'readability', label: 'Readability', pass: data.readabilityScore > 6, warning: false },
      ];
      
      setChecks(newChecks);
      setScore(data.predictedScore || Math.round((data.hookScore + data.grammarScore + data.readabilityScore) / 3 * 10));
      setShown(true);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Error running audit');
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

        {error && <div style={{ color: 'var(--bad)', fontSize: '14px' }}>{error}</div>}
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
          
          {score !== null && (
            <div className="audit-score">
              <div className="predicted">
                <div className="score-number" style={{ color: score > 70 ? '#22c55e' : score > 50 ? '#f59e0b' : '#ef4444' }}>
                  {score}
                </div>
                <div className="score-label">Predicted Score</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PrePostAuditScreen;
