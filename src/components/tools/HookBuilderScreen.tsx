'use client'
import { useState } from 'react'
import { useUser } from '@/hooks/useUser'

const HOOK_TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  stat: { bg: 'rgba(34,197,94,.12)', color: '#22c55e' },
  contrarian: { bg: 'rgba(245,158,11,.12)', color: '#f59e0b' },
  question: { bg: 'rgba(59,130,246,.12)', color: '#3b82f6' },
  story: { bg: 'rgba(168,85,247,.12)', color: '#a855f7' },
  'bold-claim': { bg: 'rgba(255,92,0,.15)', color: '#FF5C00' },
}

export function HookBuilderScreen() {
  const [topic, setTopic] = useState('')
  const [audience, setAudience] = useState('')
  const [hooks, setHooks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { goals } = useUser()
  const primaryGoal = goals[0]?.goal_id || 'get_clients'

  const generate = async () => {
    if (!topic.trim()) return
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, audience: audience || undefined, goal: primaryGoal }),
      })
      const data = await response.json()
      if (response.ok) {
        setHooks(data.hooks || [])
      } else {
        setError(data.error || 'Failed to generate hooks')
      }
    } catch (err) {
      setError('Error generating hooks')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (s: number) => s >= 75 ? '#22c55e' : s >= 55 ? '#f59e0b' : '#ef4444'

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {/* Input Section */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--b-1)' }}>
        <label style={{ display: 'block', fontSize: 'var(--t-xs)', fontWeight: 600, color: 'var(--tx-2)', marginBottom: 6, textTransform: 'uppercase' }}>
          Topic or Post Idea
        </label>
        <input
          type="text"
          placeholder="e.g., How to write better LinkedIn posts..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            background: 'var(--bg-3)',
            border: '1px solid var(--b-1)',
            borderRadius: 'var(--r-md)',
            color: 'var(--tx-1)',
            fontSize: 'var(--t-sm)',
            marginBottom: 12,
          }}
        />

        <label style={{ display: 'block', fontSize: 'var(--t-xs)', fontWeight: 600, color: 'var(--tx-2)', marginBottom: 6, textTransform: 'uppercase' }}>
          Target Audience (Optional)
        </label>
        <input
          type="text"
          placeholder="e.g., Founders, Growth marketers..."
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            background: 'var(--bg-3)',
            border: '1px solid var(--b-1)',
            borderRadius: 'var(--r-md)',
            color: 'var(--tx-1)',
            fontSize: 'var(--t-sm)',
            marginBottom: 12,
          }}
        />

        <button
          onClick={generate}
          disabled={!topic.trim() || loading}
          style={{
            width: '100%',
            padding: '10px 16px',
            background: loading || !topic.trim() ? 'var(--bg-4)' : 'var(--acc-m)',
            color: loading || !topic.trim() ? 'var(--tx-3)' : 'var(--acc)',
            border: `1px solid ${loading || !topic.trim() ? 'var(--b-1)' : 'var(--acc-b)'}`,
            borderRadius: 'var(--r-md)',
            fontSize: 'var(--t-sm)',
            fontWeight: 600,
            cursor: loading || !topic.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !topic.trim() ? 0.6 : 1,
          }}
        >
          {loading ? '⏳ Generating...' : '✨ Generate Hooks'}
        </button>

        {error && (
          <div style={{
            marginTop: 12,
            padding: '10px 12px',
            background: 'rgba(239,68,68,.12)',
            color: '#ef4444',
            borderRadius: 'var(--r-md)',
            fontSize: 'var(--t-sm)',
          }}>
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      <div style={{ padding: '16px' }}>
        {hooks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--tx-3)' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>🎣</div>
            <p>Generate hooks to get started</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {hooks.map((hook, idx) => {
              const typeColor = HOOK_TYPE_COLORS[hook.type] || HOOK_TYPE_COLORS.stat
              return (
                <div
                  key={idx}
                  style={{
                    padding: '12px',
                    background: typeColor.bg,
                    border: `1px solid ${typeColor.color}33`,
                    borderRadius: 'var(--r-lg)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                    <div style={{
                      display: 'inline-block',
                      padding: '3px 8px',
                      background: typeColor.color,
                      color: 'white',
                      borderRadius: '3px',
                      fontSize: 'var(--t-2xs)',
                      fontWeight: 600,
                      textTransform: 'capitalize',
                    }}>
                      {hook.type.replace('-', ' ')}
                    </div>
                    {hook.score && (
                      <div style={{
                        fontSize: 'var(--t-base)',
                        fontWeight: 700,
                        color: getScoreColor(hook.score),
                      }}>
                        {Math.round(hook.score)}
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: 'var(--t-sm)', color: 'var(--tx-1)', lineHeight: 1.5, margin: 0 }}>
                    {hook.hook}
                  </p>
                  {hook.reason && (
                    <p style={{ fontSize: 'var(--t-xs)', color: 'var(--tx-3)', marginTop: 8, marginBottom: 0 }}>
                      💡 {hook.reason}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
