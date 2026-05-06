import { FC } from 'react';
import { InsightCardProps } from '../types';
import '../styles/insight.css';

const InsightCard: FC<InsightCardProps> = ({ goal, insight, primaryFix }) => {
  return (
    <div className="insight-card">
      <div className="insight-header">
        <span className="insight-icon">🧠</span>
        <span className="insight-title">
          Why this post fails for {goal.toLowerCase()}
        </span>
      </div>

      <div className="insight-body">
        {insight}
      </div>

      <div className="insight-fix">
        <div className="fix-label">Primary fix</div>
        <div className="fix-text">
          {primaryFix}
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
