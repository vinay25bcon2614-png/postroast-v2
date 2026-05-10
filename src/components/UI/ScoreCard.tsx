interface Metric {
  label: string;
  score: number;
}

interface ScoreCardProps {
  overall: number;
  metrics: Metric[];
}

const getColor = (score: number) => {
  if (score < 55) return 'var(--bad)';
  if (score < 75) return 'var(--warn)';
  return 'var(--ok)';
};

export default function ScoreCard({ overall, metrics }: ScoreCardProps) {
  return (
    <section className="card">
      <div className="score-main">
        <span className="score-num" style={{ color: getColor(overall) }}>{overall}</span>
        <span className="muted">/100 Overall</span>
      </div>
      {metrics.map((metric) => (
        <div className="bar-row" key={metric.label}>
          <span>{metric.label}</span>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${metric.score}%`, backgroundColor: getColor(metric.score) }} />
          </div>
          <span className="muted">{metric.score}</span>
        </div>
      ))}
    </section>
  );
}
