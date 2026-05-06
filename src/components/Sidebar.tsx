import { FC } from 'react';
import { SidebarProps } from '../types';
import '../styles/sidebar.css';

const Sidebar: FC<SidebarProps> = ({ activeSection, onNavigate }) => {
  const sections = [
    {
      label: 'CORE',
      items: [
        { id: 'workspace', label: 'Workspace', icon: '📊' },
        { id: 'roasts', label: 'My Roasts', icon: '🔥' },
        { id: 'templates', label: 'Templates', icon: '📋' },
      ],
    },
    {
      label: 'GROWTH',
      items: [
        { id: 'style-dna', label: 'Style DNA', icon: '🧬', badge: 'NEW', badgeColor: 'purple' },
        { id: 'leaderboard', label: 'Leaderboard', icon: '🏆', badge: 'LIVE', badgeColor: 'green' },
      ],
    },
    {
      label: 'TOOLS',
      items: [
        { id: 'analytics', label: 'Analytics', icon: '📈' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
      ],
    },
  ];

  return (
    <aside className="sidebar">
      {sections.map((section) => (
        <div key={section.label} className="sidebar-section">
          <span className="sidebar-label">{section.label}</span>
          <nav className="sidebar-items">
            {section.items.map((item) => (
              <button
                key={item.id}
                className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-text">{item.label}</span>
                {item.badge && (
                  <span className={`sidebar-badge badge-${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;
