'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import '../styles/screens.css'

interface UserPreferences {
  theme: 'dark' | 'light'
  notifications: boolean
  emailDigest: 'daily' | 'weekly' | 'never'
  defaultGoal: string
  publicProfile: boolean
  marketingEmails: boolean
}

const CREATOR_CATEGORIES = [
  { id: 'welsh', name: 'Dan Welsh', style: 'Philosophical, freedom-focused' },
  { id: 'hormozi', name: 'Alex Hormozi', style: 'Aggressive, direct, contrarian' },
  { id: 'acosta', name: 'Oliur Rahman', style: 'Strategic, viral-focused' },
  { id: 'rachitsky', name: 'Rahul Rachitsky', style: 'Data-driven, educational' },
]

export function SettingsScreen() {
  const { user, profile } = useUser()
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'dark',
    notifications: true,
    emailDigest: 'weekly',
    defaultGoal: 'get_clients',
    publicProfile: false,
    marketingEmails: false,
  })
  const [selectedCreators, setSelectedCreators] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (profile?.preferences) {
      setPreferences(prev => ({
        ...prev,
        ...profile.preferences,
      }))
    }
    if (profile?.creator_mix) {
      setSelectedCreators(profile.creator_mix)
    }
  }, [profile])

  const handleSavePreferences = async () => {
    if (!user) return

    setSaving(true)
    try {
      const supabase = createClient()
      await supabase
        .from('profiles')
        .update({
          preferences,
          creator_mix: selectedCreators,
        })
        .eq('user_id', user.id)

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Error saving preferences:', error)
    } finally {
      setSaving(false)
    }
  }

  const toggleCreator = (creatorId: string) => {
    setSelectedCreators(prev =>
      prev.includes(creatorId)
        ? prev.filter(id => id !== creatorId)
        : [...prev, creatorId]
    )
  }

  if (!user) {
    return (
      <div className="screen">
        <div className="screen-header">
          <h2>Settings</h2>
          <p>Sign in to manage your preferences</p>
        </div>
      </div>
    )
  }

  return (
    <div className="settings-container">
      <div className="screen-header">
        <h2>Settings</h2>
        <p>Customize your PostRoast experience</p>
      </div>

      {saved && <div className="success-alert">✓ Preferences saved</div>}

      {/* Account Section */}
      <div className="settings-section">
        <h3>Account</h3>
        <div className="setting-item">
          <div className="setting-label">
            <div className="label-title">Email</div>
            <div className="label-desc">Your login email</div>
          </div>
          <div className="setting-value">{user.email}</div>
        </div>
        <div className="setting-item">
          <div className="setting-label">
            <div className="label-title">Profile Name</div>
            <div className="label-desc">Public display name</div>
          </div>
          <input
            type="text"
            className="input"
            defaultValue={user.user_metadata?.full_name || ''}
          />
        </div>
        <div className="setting-item">
          <div className="setting-label">
            <div className="label-title">Public Profile</div>
            <div className="label-desc">Show your profile on leaderboard</div>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={preferences.publicProfile}
              onChange={e =>
                setPreferences(prev => ({
                  ...prev,
                  publicProfile: e.target.checked,
                }))
              }
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      {/* Creator Mix */}
      <div className="settings-section">
        <h3>Creator Intelligence</h3>
        <p className="section-desc">
          Select creators whose writing style influences your AI rewrites
        </p>
        <div className="creators-grid">
          {CREATOR_CATEGORIES.map(creator => (
            <button
              key={creator.id}
              className={`creator-card ${selectedCreators.includes(creator.id) ? 'selected' : ''}`}
              onClick={() => toggleCreator(creator.id)}
            >
              <div className="creator-name">{creator.name}</div>
              <div className="creator-style">{creator.style}</div>
              <div className="checkmark">✓</div>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="settings-section">
        <h3>Notifications</h3>
        <div className="setting-item">
          <div className="setting-label">
            <div className="label-title">Push Notifications</div>
            <div className="label-desc">New features, tips, and achievements</div>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={preferences.notifications}
              onChange={e =>
                setPreferences(prev => ({
                  ...prev,
                  notifications: e.target.checked,
                }))
              }
            />
            <span className="toggle-slider" />
          </label>
        </div>
        <div className="setting-item">
          <div className="setting-label">
            <div className="label-title">Email Digest</div>
            <div className="label-desc">Weekly summary of your activity</div>
          </div>
          <select
            className="input select"
            value={preferences.emailDigest}
            onChange={e =>
              setPreferences(prev => ({
                ...prev,
                emailDigest: e.target.value as any,
              }))
            }
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="never">Never</option>
          </select>
        </div>
      </div>

      {/* Display */}
      <div className="settings-section">
        <h3>Display</h3>
        <div className="setting-item">
          <div className="setting-label">
            <div className="label-title">Theme</div>
            <div className="label-desc">Dark mode is better for your eyes</div>
          </div>
          <div className="theme-select">
            <button
              className={`theme-opt ${preferences.theme === 'dark' ? 'active' : ''}`}
              onClick={() => setPreferences(prev => ({ ...prev, theme: 'dark' }))}
            >
              🌙 Dark
            </button>
            <button
              className={`theme-opt ${preferences.theme === 'light' ? 'active' : ''}`}
              onClick={() => setPreferences(prev => ({ ...prev, theme: 'light' }))}
            >
              ☀️ Light
            </button>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="settings-section">
        <h3>Privacy</h3>
        <div className="setting-item">
          <div className="setting-label">
            <div className="label-title">Marketing Emails</div>
            <div className="label-desc">Updates about new features and offers</div>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={preferences.marketingEmails}
              onChange={e =>
                setPreferences(prev => ({
                  ...prev,
                  marketingEmails: e.target.checked,
                }))
              }
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="settings-section danger-zone">
        <h3>Danger Zone</h3>
        <button className="btn btn-danger">Delete Account</button>
      </div>

      {/* Save Button */}
      <div className="settings-footer">
        <button
          className="btn btn-primary btn-lg"
          onClick={handleSavePreferences}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  )
}
