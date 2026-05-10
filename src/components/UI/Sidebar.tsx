interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Roast & Rewrite' },
  { id: 'format-library', label: 'Format Library' },
  { id: 'style-dna', label: 'Style DNA' },
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'settings', label: 'Settings' },
];

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">P</span>
        <span>PostRoast v2</span>
      </div>
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${activePage === item.id ? 'active' : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          <span>{item.label}</span>
        </button>
      ))}
    </aside>
  );
}
