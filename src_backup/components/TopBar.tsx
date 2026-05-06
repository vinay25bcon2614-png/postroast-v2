import { FC } from 'react';
import { TopBarProps } from '../types';
import '../styles/topbar.css';

const TopBar: FC<TopBarProps> = ({ user, streakDays, onUpgrade }) => {
  const tabs = ['Workspace', 'Format Library', 'Style DNA', 'Leaderboard'];

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-logo">
          <span className="logo-mark">P</span>
          <span className="logo-text">PostRoast</span>
        </div>
        <nav className="topbar-tabs">
          {tabs.map((tab, idx) => (
            <button
              key={tab}
              className={`topbar-tab ${idx === 0 ? 'active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="topbar-right">
        <div className="topbar-streak">
          <span className="streak-icon">🔥</span>
          <span className="streak-text">{streakDays} day streak</span>
        </div>
        <button className="topbar-upgrade" onClick={onUpgrade}>
          Upgrade to Pro — $19/mo
        </button>
        <div className="topbar-avatar">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} />
          ) : (
            <span>{user.name?.charAt(0)}</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
