'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import type { Screen } from '@/app/dashboard/page'
import './Topbar.css'

interface TopbarProps {
  activeScreen: Screen
  onNavigate: (s: Screen) => void
}

const NAV_TABS: { id: Screen; label: string; badge?: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'roast', label: 'Roast' },
  { id: 'hooks', label: 'Hooks' },
  { id: 'cta', label: 'CTA' },
  { id: 'audit', label: 'Audit' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'goals', label: 'Goals' },
  { id: 'history', label: 'History' },
  { id: 'formats', label: 'Formats' },
  { id: 'dna', label: 'DNA' },
]

export function Topbar({ activeScreen, onNavigate }: TopbarProps) {
  const { user, isPro } = useUser()
  const [showUser, setShowUser] = useState(false)

  return (
    <header className="topbar">
      <nav className="topbar-nav">
        {NAV_TABS.map(tab => (
          <button
            key={tab.id}
            className={`topbar-tab ${activeScreen === tab.id ? 'active' : ''}`}
            onClick={() => onNavigate(tab.id)}
            title={tab.label}
          >
            {tab.label}
            {tab.badge && <span className="tab-badge">{tab.badge}</span>}
          </button>
        ))}
      </nav>

      <div className="topbar-spacer" />

      <div className="topbar-actions">
        {user && (
          <button
            className="user-button"
            onClick={() => setShowUser(!showUser)}
            title={user.user_metadata?.full_name || 'User'}
          >
            <div
              className="user-avatar"
              style={{
                backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id})`,
              }}
            />
            <span className="user-name">{user.email?.split('@')[0] || 'User'}</span>
          </button>
        )}
      </div>

      {showUser && (
        <div className="user-menu">
          <button onClick={() => onNavigate('settings')}>Settings</button>
          <button onClick={() => onNavigate('integrations')}>Integrations</button>
          <button onClick={() => onNavigate('billing')}>Billing</button>
          <hr />
          <button onClick={() => setShowUser(false)}>Close</button>
        </div>
      )}
    </header>
  )
}
