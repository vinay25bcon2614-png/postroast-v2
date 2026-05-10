const cards = [
  { label: 'Average score this month', value: '74', meta: '+9 from last month' },
  { label: 'Posts analyzed', value: '31', meta: '8 this week' },
  { label: 'Weakest area', value: 'Hook 52', meta: 'primary focus' },
  { label: 'Leaderboard rank', value: 'Top 18%', meta: 'weekly percentile' },
];

export default function KPIStrip() {
  return (
    <section className="kpi-strip">
      {cards.map((card) => (
        <article className="card" key={card.label}>
          <div className="kpi-value">{card.value}</div>
          <div>{card.label}</div>
          <div className="kpi-meta">{card.meta}</div>
        </article>
      ))}
    </section>
  );
}
