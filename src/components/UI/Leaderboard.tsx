import { useState } from 'react';

const weekly = [
  ['anon_9A1', 92],
  ['anon_7F2', 90],
  ['anon_4D8', 88],
  ['you', 84],
  ['anon_1X5', 82],
];

const monthly = [
  ['anon_7F2', 93],
  ['anon_9A1', 91],
  ['you', 86],
  ['anon_4D8', 85],
  ['anon_2M3', 84],
];

export default function Leaderboard() {
  const [range, setRange] = useState<'weekly' | 'monthly'>('weekly');
  const data = range === 'weekly' ? weekly : monthly;

  return (
    <section className="card">
      <div className="row-between" style={{ marginBottom: 12 }}>
        <strong>You're in top 18% of posts this week</strong>
        <div className="tabs">
          <button className={`tab ${range === 'weekly' ? 'active' : ''}`} onClick={() => setRange('weekly')}>Weekly</button>
          <button className={`tab ${range === 'monthly' ? 'active' : ''}`} onClick={() => setRange('monthly')}>Monthly</button>
        </div>
      </div>

      {data.map(([user, score], index) => (
        <div className="rank-row" key={`${range}-${user}`}>
          <span>{index + 1}. {user}</span>
          <span>{score}</span>
        </div>
      ))}
    </section>
  );
}
