import React, { useState, useCallback } from 'react';

interface StepFirstRoastProps {
  onNext: (roastData: any) => void;
  onBack?: () => void;
}

export function StepFirstRoast({ onNext, onBack }: StepFirstRoastProps) {
  const [postContent, setPostContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [roastResult, setRoastResult] = useState<any>(null);

  const handleAnalyze = useCallback(async () => {
    if (!postContent.trim()) return;
    
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setRoastResult({
        score: 64,
        feedback: 'This post has a decent hook, but the body lacks clear value transition. You are talking at the audience, not to them. The CTA is also weak.'
      });
      setIsAnalyzing(false);
    }, 2000);
  }, [postContent]);

  const handleNext = useCallback(() => {
    onNext({
      postContent,
      roastResult
    });
  }, [postContent, roastResult, onNext]);

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Your First Roast</h2>
        <p>Paste a recent post to see how PostRoast can improve it</p>
      </div>

      <div className="first-roast-form">
        <textarea 
          placeholder="Paste your LinkedIn or Twitter post here..."
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          className="audit-textarea"
        />
        <button 
          className="btn-primary"
          disabled={!postContent || isAnalyzing}
          onClick={handleAnalyze}
        >
          {isAnalyzing ? 'Analyzing...' : 'Roast My Post'}
        </button>
      </div>

      {roastResult && (
        <div className="roast-preview">
          <div className="score-display">
            <p className="main-score">{roastResult.score}</p>
            <p className="score-subtitle">First Roast Score</p>
          </div>

          <div style={{ background: '#0c0c0e', borderRadius: '8px', padding: '16px', marginTop: '16px' }}>
            <p style={{ color: '#a0a0a0', lineHeight: '1.6', margin: 0 }}>
              {roastResult.feedback}
            </p>
          </div>
        </div>
      )}

      <div className="step-actions">
        {onBack && (
          <button className="btn-secondary" onClick={onBack}>
            Back
          </button>
        )}
        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={!roastResult}
        >
          Complete Setup
        </button>
      </div>
    </div>
  );
}

export default StepFirstRoast;
