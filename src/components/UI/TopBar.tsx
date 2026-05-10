interface TopBarProps {
  activePage: string;
}

const labels: Record<string, string> = {
  dashboard: 'Main Dashboard',
  'format-library': 'Format Library',
  'style-dna': 'Style DNA',
  leaderboard: 'Leaderboard',
  analytics: 'Streak & Progress',
  settings: 'Settings & Account',
};

export default function TopBar({ activePage }: TopBarProps) {
  return (
    <header className="topbar">
      <div>
        <strong>{labels[activePage] || 'PostRoast'}</strong>
      </div>
      <div className="row-between">
        <span className="muted small">Top 18% this week</span>
        <button className="primary-btn">Upgrade Pro</button>
      </div>
    </header>
  );
}
