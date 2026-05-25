'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'

interface LinkedInData {
  connected: boolean
  profileUrl?: string
  lastSync?: string
  followers?: number
  impressions?: number
  engagement?: number
}

export function IntegrationsScreen() {
  const { user, isPro } = useUser()
  const [linkedin, setLinkedin] = useState<LinkedInData>({ connected: false })
  const [importing, setImporting] = useState(false)
  const [importMsg, setImportMsg] = useState('')
  const supabase = createClient()

  useEffect(() => {
    if (!user) return
    loadIntegrations()
  }, [user])

  async function loadIntegrations() {
    if (!user) return
    try {
      const { data } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      if (data?.linkedin_connected) {
        setLinkedin({
          connected: true,
          profileUrl: data.linkedin_url,
          lastSync: data.linkedin_last_sync,
          followers: data.linkedin_followers,
          impressions: data.linkedin_impressions,
          engagement: data.linkedin_engagement
        })
      }
    } catch (e) {
      // No integrations yet
    }
  }

  async function handleConnectLinkedIn() {
    const redirectUrl = `${window.location.origin}/api/linkedin/connect`
    window.location.href = redirectUrl
  }

  async function handleDisconnect() {
    if (!user) return
    try {
      await supabase
        .from('integrations')
        .delete()
        .eq('user_id', user.id)
      setLinkedin({ connected: false })
    } catch (e) {
      console.error('Disconnect failed:', e)
    }
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
      <div style={{ maxWidth: '600px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Integrations</h2>
        <p style={{ color: '#888', marginBottom: '32px' }}>Connect your accounts to sync data and post directly.</p>

        {/* LinkedIn Card */}
        <div style={{
          background: '#111',
          border: '1px solid #333',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '28px' }}>🔗</div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600 }}>LinkedIn</div>
                <div style={{ fontSize: '13px', color: '#888' }}>
                  {linkedin.connected ? 'Connected' : 'Not connected'}
                </div>
              </div>
            </div>
            <button
              onClick={linkedin.connected ? handleDisconnect : handleConnectLinkedIn}
              style={{
                padding: '8px 16px',
                background: linkedin.connected ? '#EF4444' : '#FF5C00',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              {linkedin.connected ? 'Disconnect' : 'Connect'}
            </button>
          </div>

          {linkedin.connected && (
            <div style={{ paddingTop: '16px', borderTop: '1px solid #222' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#888' }}>Followers</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#FF5C00' }}>
                    {linkedin.followers || '—'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#888' }}>Impressions</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#FF5C00' }}>
                    {linkedin.impressions || '—'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#888' }}>Engagement Rate</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#FF5C00' }}>
                    {linkedin.engagement ? `${linkedin.engagement}%` : '—'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#888' }}>Last Sync</div>
                  <div style={{ fontSize: '13px', color: '#ccc' }}>
                    {linkedin.lastSync ? new Date(linkedin.lastSync).toLocaleDateString() : 'Never'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Coming soon */}
        <div style={{
          background: 'rgba(168, 85, 247, 0.1)',
          border: '1px solid rgba(168, 85, 247, 0.2)',
          borderRadius: '12px',
          padding: '20px',
          opacity: 0.6
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '28px' }}>📧</div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>Google Docs</div>
              <div style={{ fontSize: '13px', color: '#888' }}>Coming soon</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
