const trend = [42, 48, 54, 59, 61, 67];

export default function StreakTracker() {
  return (
    <section className="card">
      <div className="row-between" style={{ marginBottom: 14 }}>
        <strong>Streak & Progress</strong>
        <span className="pill active">🔥 12 day streak</span>
      </div>

      <div className="chart">
        {trend.map((score, i) => (
          <div key={i} className="chart-bar" style={{ height: `${score}%` }} title={`Score ${score}`} />
        ))}
      </div>

      <p className="muted" style={{ marginTop: 10 }}>Average hook score: 42 → 67 this month</p>
    </section>
  );
}
