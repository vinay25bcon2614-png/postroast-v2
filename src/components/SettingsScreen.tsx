import React, { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../lib/apiConfig';

interface SettingsForm {
  name: string;
  email: string;
  bio: string;
  emailNotifications: boolean;
  weeklyDigest: boolean;
  publicProfile: boolean;
}

export function SettingsScreen() {
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState<SettingsForm>({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    bio: '',
    emailNotifications: true,
    weeklyDigest: true,
    publicProfile: false
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback((field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await (window as any).supabase.auth.getSession();
      if (!session) {
        setError('You must be logged in to save settings');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/user/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      setSaved(true);
      setLoading(false);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message || 'Error saving settings');
      setLoading(false);
    }
  }, [settings]);

  return (
    <div className="screen-container">
      <div className="screen-header">
        <h2>Settings</h2>
        <p>Manage your account and preferences</p>
      </div>

      <div className="settings-form">
        <div className="form-section">
          <h3>Profile</h3>
          
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={settings.email}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={settings.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Preferences</h3>
          
          <div className="form-checkbox">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleChange('emailNotifications', e.target.checked)}
              id="email-notif"
            />
            <label htmlFor="email-notif">Email notifications</label>
          </div>

          <div className="form-checkbox">
            <input
              type="checkbox"
              checked={settings.weeklyDigest}
              onChange={(e) => handleChange('weeklyDigest', e.target.checked)}
              id="weekly"
            />
            <label htmlFor="weekly">Weekly digest</label>
          </div>

          <div className="form-checkbox">
            <input
              type="checkbox"
              checked={settings.publicProfile}
              onChange={(e) => handleChange('publicProfile', e.target.checked)}
              id="public"
            />
            <label htmlFor="public">Public profile</label>
          </div>
        </div>

        <div className="form-actions">
          {error && <span className="error-msg">{error}</span>}
          {saved && <span className="saved-msg">✓ Saved successfully</span>}
          <button onClick={handleSave} className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="form-section danger">
          <h3>Account</h3>
          <button onClick={logout} className="btn-danger">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsScreen;
