import { FC } from 'react';
import { KPIRowProps } from '../types';
import '../styles/kpirow.css';

const KPIRow: FC<KPIRowProps> = ({ metrics }) => {
  const kpis = [
    {
      label: 'Avg score this month',
      value: metrics.avgScore.value,
      trend: metrics.avgScore.trend,
      trendLabel: metrics.avgScore.trendLabel,
      isPositive: metrics.avgScore.isPositive,
      color: 'green',
    },
    {
      label: 'Posts analysed',
      value: metrics.postsAnalyzed.value,
      trend: metrics.postsAnalyzed.trend,
      trendLabel: metrics.postsAnalyzed.trendLabel,
      isPositive: metrics.postsAnalyzed.isPositive,
      color: 'white',
    },
    {
      label: 'Hook avg weakest',
      value: metrics.hookAvgWeakest.value,
      trend: metrics.hookAvgWeakest.trend,
      trendLabel: metrics.hookAvgWeakest.trendLabel,
      color: 'amber',
    },
    {
      label: 'Leaderboard rank',
      value: metrics.leaderboardRank.percentile,
      trend: metrics.leaderboardRank.trend,
      trendLabel: metrics.leaderboardRank.trendLabel,
      color: 'purple',
    },
  ];

  return (
    <div className="kpi-row">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="kpi-card">
          <div className={`kpi-value color-${kpi.color}`}>
            {kpi.value}
          </div>
          <div className="kpi-label">{kpi.label}</div>
          <div className="kpi-trend">
            <span className={`trend-icon ${kpi.isPositive !== false ? 'positive' : 'negative'}`}>
              {kpi.isPositive !== false ? '↑' : '↓'}
            </span>
            <span className="trend-text">{kpi.trendLabel}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPIRow;
