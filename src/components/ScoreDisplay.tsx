import React from 'react';
import { GoalId, ScoreDimension } from '../types';
import { GOALS } from '../lib/goals';
import './ScoreDisplay.css';

interface ScoreDisplayProps {
  goal: GoalId;
  overall: number;
  dimensions: ScoreDimension[];
  isLoading?: boolean;
}

export function ScoreDisplay({
  goal,
  overall,
  dimensions,
  isLoading,
}: ScoreDisplayProps) {
  const goalConfig = GOALS[goal];

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'var(--ok)';
    if (score >= 60) return 'var(--warn)';
    return 'var(--error)';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return 'Strong';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Weak';
  };

  if (isLoading) {
    return (
      <div className="score-display loading">
        <div className="score-skeleton" />
        <div className="dimension-skeletons">
          {[1, 2, 3].map((i) => (
            <div key={i} className="dimension-skeleton" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="score-display">
      <div className="score-header">
        <div className="score-circle">
          <div className="score-number">{Math.round(overall)}</div>
          <div className="score-label">/ 100</div>
        </div>
        <div className="score-info">
          <div className="score-title">{goalConfig.label} Score</div>
          <div className="score-description">{getScoreLabel(overall)}</div>
        </div>
      </div>

      <div className="dimensions">
        {dimensions.map((dim) => (
          <div key={dim.name} className="dimension-item">
            <div className="dimension-header">
              <span className="dimension-name">{dim.name}</span>
              <span className="dimension-score">{Math.round(dim.score)}</span>
            </div>
            <div className="dimension-bar">
              <div
                className="dimension-fill"
                style={{
                  width: `${dim.score}%`,
                  backgroundColor: getScoreColor(dim.score),
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="score-note">
        <span className="note-icon">ℹ</span>
        <span className="note-text">
          Scoring weighted for {goalConfig.label} ({goalConfig.description})
        </span>
      </div>
    </div>
  );
}
