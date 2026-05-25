'use client'
import { useUser } from '@/hooks/useUser'
import type { Screen } from '@/app/dashboard/page'
import './Sidebar.css'

interface SidebarItem {
  id: Screen
  label: string
  icon: string
  badge?: string
  dividerBefore?: boolean
}

const NAV_ITEMS: SidebarItem[] = [
  // Core
  { id: 'dashboard', label: 'Dashboard', icon: 'ti-layout-dashboard' },
  { id: 'roast', label: 'Roast Engine', icon: 'ti-flame' },
  { id: 'hooks', label: 'Hook Builder', icon: 'ti-hook-2' },
  { id: 'cta', label: 'CTA Builder', icon: 'ti-megaphone' },
  { id: 'audit', label: 'Pre-Post Audit', icon: 'ti-checkbox' },
  
  // Growth
  { id: 'analytics', label: 'Analytics', icon: 'ti-chart-line' },
  { id: 'leaderboard', label: 'Leaderboard', icon: 'ti-trophy' },
  { id: 'goals', label: 'Goal Tracker', icon: 'ti-target' },
  { id: 'history', label: 'Post History', icon: 'ti-history' },
  { id: 'formats', label: 'Format Library', icon: 'ti-layout-list' },
  { id: 'dna', label: 'Style DNA', icon: 'ti-dna' },
  
  // Account
  { id: 'settings', label: 'Settings', icon: 'ti-settings' },
  { id: 'integrations', label: 'Integrations', icon: 'ti-link' },
  { id: 'billing', label: 'Billing', icon: 'ti-credit-card' },
]

const BADGE_STYLES: Record<string, React.CSSProperties> = {
  new: { background: 'rgba(168,85,247,.2)', color: '#a855f7' },
  pro: { background: 'rgba(168,85,247,.2)', color: '#a855f7' },
}

const GROUP_LABELS: Partial<Record<Screen, string>> = {
  analytics: 'Growth',
  leaderboard: 'Growth',
  goals: 'Growth',
  history: 'Growth',
  formats: 'Growth',
  dna: 'Growth',
  settings: 'Account',
  integrations: 'Account',
  billing: 'Account',
}

export function Sidebar({ activeScreen, onNavigate }: { activeScreen: Screen; onNavigate: (s: Screen) => void }) {
  const { user, isPro } = useUser()

  const groupedItems = NAV_ITEMS.reduce((acc, item) => {
    const group = GROUP_LABELS[item.id] || 'Core'
    if (!acc[group]) acc[group] = []
    acc[group].push(item)
    return acc
  }, {} as Record<string, SidebarItem[]>)

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">🔥</span>
          <span className="logo-text">PostRoast</span>
        </div>
        {user && (
          <div className="user-info">
            <div className="user-avatar" style={{ backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id})` }} />
            <div className="user-details">
              <div className="user-name">{user.user_metadata?.full_name || 'Creator'}</div>
              <div className="user-plan">{isPro ? 'Pro' : 'Free'}</div>
            </div>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {Object.entries(groupedItems).map(([group, items]) => (
          <div key={group} className="nav-group">
            {group !== 'Core' && <div className="nav-group-label">{group}</div>}
            {items.map(item => (
              <button
                key={item.id}
                className={`nav-item ${activeScreen === item.id ? 'active' : ''} ${item.badge ? 'has-badge' : ''}`}
                onClick={() => onNavigate(item.id)}
                title={item.label}
              >
                <span className={`nav-icon ti ${item.icon}`} />
                <span className="nav-label">{item.label}</span>
                {item.badge && <span className="nav-badge" style={BADGE_STYLES[item.badge]}>{item.badge}</span>}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="footer-tip">
          <span className="tip-icon">💡</span>
          <div>
            <div className="tip-title">Pro Tip</div>
            <div className="tip-text">Use ⌘+Enter to roast instantly</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
