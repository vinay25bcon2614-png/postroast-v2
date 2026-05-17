import React from 'react';
import '../styles/layout.css';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showRightPanel?: boolean;
  rightPanel?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showSidebar = true, 
  showRightPanel = false,
  rightPanel
}) => {
  return (
    <div className="app-container">
      {showSidebar && <Sidebar />}
      <div className="content-wrapper">
        {children}
      </div>
      {showRightPanel && rightPanel && (
        <div className="right-panel">
          {rightPanel}
        </div>
      )}
    </div>
  );
};

interface NavbarProps {
  title?: string;
  tabs?: { label: string; id: string; active?: boolean }[];
  actions?: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({ title, tabs, actions }) => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <div className="logo-mark">P</div>
          <span>PostRoast</span>
        </div>
        {tabs && (
          <nav className="nav-tabs">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`nav-tab ${tab.active ? 'active' : ''}`}
              >
                {tab.label}
                {tab.active && <div className="tab-underline" />}
              </div>
            ))}
          </nav>
        )}
      </div>
      <div className="navbar-right">
        {actions}
      </div>
    </div>
  );
};

interface SidebarItem {
  id: string;
  label: string;
  icon?: string;
  badge?: string | number;
  active?: boolean;
  onClick?: () => void;
}

interface SidebarProps {
  items?: SidebarItem[];
  user?: { name: string; avatar?: string };
}

export const Sidebar: React.FC<SidebarProps> = ({ items, user }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-content">
        {items && (
          <>
            {items.map((item) => (
              <div
                key={item.id}
                className={`sidebar-item ${item.active ? 'active' : ''}`}
                onClick={item.onClick}
              >
                {item.icon && <span className="sidebar-icon">{item.icon}</span>}
                <span className="sidebar-label">{item.label}</span>
                {item.badge && (
                  <span className="sidebar-badge">{item.badge}</span>
                )}
              </div>
            ))}
          </>
        )}
      </div>
      {user && (
        <div className="sidebar-footer">
          <div className="user-row">
            <div className="user-avatar">{user.avatar || user.name[0]}</div>
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-status">Pro User</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
