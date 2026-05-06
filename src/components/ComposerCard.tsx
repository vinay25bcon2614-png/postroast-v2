import { FC, useState, useCallback } from 'react';
import { ComposerCardProps } from '../types';
import '../styles/composer.css';

const goals = ['Get Clients', 'Grow Audience', 'Thought Leader', 'Brand Awareness'];

const ComposerCard: FC<ComposerCardProps> = ({
  onRoast,
  defaultGoal = 'Get Clients',
  isLoading = false,
}) => {
  const [content, setContent] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(defaultGoal);
  const [mode, setMode] = useState('Full Roast');
  const modes = ['Full Roast', 'Hook Only', 'Rewrite Only', 'Audit'];

  const handleRoast = useCallback(() => {
    if (content.trim()) {
      onRoast(content, selectedGoal);
    }
  }, [content, selectedGoal, onRoast]);

  return (
    <div className="composer-card">
      <div className="composer-header">
        <span className="composer-label">Your draft</span>
        <div className="composer-modes">
          {modes.map((m) => (
            <button
              key={m}
              className={`mode-tab ${mode === m ? 'active' : ''}`}
              onClick={() => setMode(m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <textarea
        className="composer-textarea"
        placeholder="Paste your LinkedIn draft here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isLoading}
      />

      <div className="composer-footer">
        <div className="composer-goals">
          <span className="goals-label">Goal:</span>
          {goals.map((goal) => (
            <button
              key={goal}
              className={`goal-chip ${selectedGoal === goal ? 'active' : ''}`}
              onClick={() => setSelectedGoal(goal)}
            >
              {goal}
            </button>
          ))}
        </div>

        <div className="composer-style">
          <span>Style DNA: Learning...</span>
        </div>

        <div className="composer-actions">
          <span className="char-count" style={{ fontFamily: 'var(--mono)' }}>
            {content.length}
          </span>
          <button
            className="roast-btn"
            onClick={handleRoast}
            disabled={!content.trim() || isLoading}
          >
            {isLoading ? '⏳ Roasting...' : '🔥 Roast it'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComposerCard;
