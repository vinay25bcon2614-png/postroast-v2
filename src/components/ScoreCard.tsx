import { FC, useMemo } from 'react';
import { ScoreCardProps } from '../types';
import '../styles/scorecard.css';

const ScoreCard: FC<ScoreCardProps> = ({ score, formatDetected }) => {
  const getScoreColor = (value: number): string => {
    if (value < 50) return 'var(--error)';
    if (value < 70) return 'var(--warn)';
    return 'var(--ok)';
  };

  const getDimensionColor = (value: number): string => {
    if (value < 50) return 'var(--error)';
    if (value < 70) return 'var(--warn)';
    return 'var(--ok)';
  };

  const barPercentage = useMemo(() => {
    return score.dimensions.map((d) => ({
      ...d,
      percentage: Math.min((d.score / 100) * 100, 100),
      color: d.color || getDimensionColor(d.score),
    }));
  }, [score.dimensions]);

  return (
    <div className="score-card">
      <div className="score-header">
        <span className="score-title">Analysis</span>
        {formatDetected && (
          <span className="format-tag">{formatDetected}</span>
        )}
      </div>

      <div className="score-main">
        <div className="score-number" style={{ color: getScoreColor(score.overall) }}>
          {score.overall}
        </div>
        <div className="score-label">{score.label}</div>
        <div className="score-subtitle">{score.subtitle}</div>
      </div>

      <div className="score-bars">
        {barPercentage.map((dim) => (
          <div key={dim.name} className="score-bar-row">
            <span className="bar-name">{dim.name}</span>
            <div className="bar-container">
              <div
                className="bar-fill"
                style={{
                  width: `${dim.percentage}%`,
                  backgroundColor: dim.color,
                }}
              />
            </div>
            <span className="bar-score" style={{ fontFamily: 'var(--mono)' }}>
              {dim.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreCard;
