'use client'
import type { Screen } from '@/app/dashboard/page'
import './BottomNav.css'

interface BottomNavProps {
  activeScreen: Screen
  onNavigate: (s: Screen) => void
}

const MOBILE_TABS: { id: Screen; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Home', icon: 'ti-layout-dashboard' },
  { id: 'roast', label: 'Roast', icon: 'ti-flame' },
  { id: 'analytics', label: 'Stats', icon: 'ti-chart-bar' },
  { id: 'goals', label: 'Goals', icon: 'ti-target' },
  { id: 'settings', label: 'More', icon: 'ti-menu-2' },
]

export function BottomNav({ activeScreen, onNavigate }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {MOBILE_TABS.map(tab => (
          <button
            key={tab.id}
            className={`bottom-nav-item ${activeScreen === tab.id ? 'active' : ''}`}
            onClick={() => onNavigate(tab.id)}
            title={tab.label}
          >
            <i className={`ti ${tab.icon}`} />
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
