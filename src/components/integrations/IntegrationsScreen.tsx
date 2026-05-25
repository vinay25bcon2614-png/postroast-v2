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
    loadLinkedInData()
  }, [user])

  async function loadLinkedInData() {
    if (!user) return
    try {
      const { data } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'linkedin')
        .single()
      
      if (data) {
        setLinkedin({
          connected: true,
          profileUrl: data.profile_url,
          lastSync: data.last_synced,
          followers: data.followers_count,
          impressions: data.impressions_this_month,
          engagement: data.engagement_rate,
        })
      }
    } catch (err) {
      console.error('Error loading LinkedIn:', err)
    }
  }

  async function handleImport() {
    setImporting(true)
    setImportMsg('')
    try {
      const response = await fetch('/api/integrations/linkedin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id }),
      })
      
      if (response.ok) {
        setImportMsg('✅ Posts imported successfully!')
        setTimeout(() => setImportMsg(''), 3000)
        await loadLinkedInData()
      } else {
        setImportMsg('❌ Import failed. Try again.')
      }
    } catch (err) {
      setImportMsg('❌ Error importing posts')
      console.error(err)
    } finally {
      setImporting(false)
    }
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        
        {/* LinkedIn Integration */}
        <div style={{
          background: 'var(--bg-3)',
          border: '1px solid var(--b-1)',
          borderRadius: 'var(--r-lg)',
          padding: '20px',
          marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 32, marginTop: 4 }}>🔗</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 'var(--t-base)', fontWeight: 600, color: 'var(--tx-1)', margin: '0 0 4px 0' }}>
                LinkedIn Integration
              </h3>
              <p style={{ fontSize: 'var(--t-sm)', color: 'var(--tx-3)', margin: 0 }}>
                Import your posts and track performance
              </p>
            </div>
          </div>

          {linkedin.connected ? (
            <>
              <div style={{
                padding: 12,
                background: 'var(--bg-4)',
                borderRadius: 'var(--r-md)',
                marginBottom: 16,
              }}>
                <div style={{ fontSize: 'var(--t-xs)', fontWeight: 500, color: 'var(--tx-2)', textTransform: 'uppercase', marginBottom: 8 }}>
                  Connected Profile
                </div>
                <a 
                  href={linkedin.profileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    fontSize: 'var(--t-sm)', 
                    color: 'var(--acc)', 
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >
                  {linkedin.profileUrl}
                </a>
                <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 'var(--t-2xs)', color: 'var(--tx-4)', textTransform: 'uppercase' }}>
                      Followers
                    </div>
                    <div style={{ fontSize: 'var(--t-lg)', fontWeight: 600, color: 'var(--acc)' }}>
                      {linkedin.followers?.toLocaleString() || '—'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--t-2xs)', color: 'var(--tx-4)', textTransform: 'uppercase' }}>
                      Impressions
                    </div>
                    <div style={{ fontSize: 'var(--t-lg)', fontWeight: 600, color: '#22c55e' }}>
                      {linkedin.impressions?.toLocaleString() || '—'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--t-2xs)', color: 'var(--tx-4)', textTransform: 'uppercase' }}>
                      Engagement
                    </div>
                    <div style={{ fontSize: 'var(--t-lg)', fontWeight: 600, color: '#f59e0b' }}>
                      {linkedin.engagement ? `${(linkedin.engagement * 100).toFixed(1)}%` : '—'}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <button
                  onClick={handleImport}
                  disabled={importing}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: importing ? 'var(--bg-4)' : 'var(--acc-m)',
                    color: importing ? 'var(--tx-3)' : 'var(--acc)',
                    border: `1px solid ${importing ? 'var(--b-1)' : 'var(--acc-b)'}`,
                    borderRadius: 'var(--r-md)',
                    fontSize: 'var(--t-sm)',
                    fontWeight: 500,
                    cursor: importing ? 'not-allowed' : 'pointer',
                    opacity: importing ? 0.6 : 1,
                  }}
                >
                  {importing ? '⏳ Importing posts...' : '📥 Import Recent Posts'}
                </button>
              </div>

              {linkedin.lastSync && (
                <div style={{ fontSize: 'var(--t-xs)', color: 'var(--tx-4)', textAlign: 'center' }}>
                  Last synced: {new Date(linkedin.lastSync).toLocaleDateString()}
                </div>
              )}
            </>
          ) : (
            <>
              <p style={{ fontSize: 'var(--t-sm)', color: 'var(--tx-3)', marginBottom: 16 }}>
                Connect your LinkedIn profile to import posts and track real-world performance metrics.
              </p>
              <button
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  background: 'linear-gradient(135deg, #0A66C2 0%, #004182 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--r-md)',
                  fontSize: 'var(--t-sm)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                🔐 Connect LinkedIn
              </button>
            </>
          )}

          {importMsg && (
            <div style={{
              marginTop: 12,
              padding: '8px 12px',
              background: importMsg.includes('❌') ? 'rgba(239,68,68,.12)' : 'rgba(34,197,94,.12)',
              color: importMsg.includes('❌') ? '#ef4444' : '#22c55e',
              borderRadius: 'var(--r-md)',
              fontSize: 'var(--t-sm)',
              textAlign: 'center',
            }}>
              {importMsg}
            </div>
          )}
        </div>

        {/* Other Integrations */}
        <div style={{
          background: 'var(--bg-3)',
          border: '1px solid var(--b-1)',
          borderRadius: 'var(--r-lg)',
          padding: '20px',
          opacity: 0.6,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 28 }}>📄</div>
            <div>
              <h3 style={{ fontSize: 'var(--t-base)', fontWeight: 600, color: 'var(--tx-1)', margin: 0 }}>
                Google Docs
              </h3>
              <p style={{ fontSize: 'var(--t-xs)', color: 'var(--tx-4)', margin: '4px 0 0 0' }}>
                Coming soon
              </p>
            </div>
          </div>
        </div>

        {/* Pro Feature */}
        {!isPro && (
          <div style={{
            marginTop: 20,
            padding: '16px',
            background: 'rgba(168, 85, 247, 0.1)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            borderRadius: 'var(--r-lg)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 'var(--t-sm)', fontWeight: 500, color: 'var(--tx-1)', marginBottom: 8 }}>
              ⭐ Unlock More Integrations
            </div>
            <p style={{ fontSize: 'var(--t-xs)', color: 'var(--tx-3)', margin: 0 }}>
              Upgrade to Pro to access additional tools and integrations
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
