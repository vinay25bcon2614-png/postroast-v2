'use client'
import { useState } from 'react'
import { useUser } from '@/hooks/useUser'

const CTA_GOAL_OPTIONS = [
  { value: 'get_clients', label: 'Get inbound clients' },
  { value: 'grow_audience', label: 'Grow audience' },
  { value: 'authority', label: 'Build authority' },
  { value: 'thought_leader', label: 'Thought leader' },
  { value: 'viral', label: 'Viral / shares' },
]

const CTA_TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  dm: { bg: 'rgba(255,92,0,.15)', color: '#FF5C00' },
  comment: { bg: 'rgba(59,130,246,.12)', color: '#3b82f6' },
  visit: { bg: 'rgba(34,197,94,.12)', color: '#22c55e' },
  repost: { bg: 'rgba(34,197,94,.12)', color: '#22c55e' },
}

export function CTABuilderScreen() {
  const [goalId, setGoalId] = useState('get_clients')
  const [context, setContext] = useState('')
  const [ctas, setCtas] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generate = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/cta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: goalId, context: context || undefined }),
      })
      const data = await response.json()
      if (response.ok) {
        setCtas(data.ctas || [])
      } else {
        setError(data.error || 'Failed to generate CTAs')
      }
    } catch (err) {
      setError('Error generating CTAs')
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
          Primary Goal
        </label>
        <select
          value={goalId}
          onChange={(e) => setGoalId(e.target.value)}
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
        >
          {CTA_GOAL_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <label style={{ display: 'block', fontSize: 'var(--t-xs)', fontWeight: 600, color: 'var(--tx-2)', marginBottom: 6, textTransform: 'uppercase' }}>
          Post Context (Optional)
        </label>
        <textarea
          placeholder="e.g., Teaching about LinkedIn growth, sharing a case study..."
          value={context}
          onChange={(e) => setContext(e.target.value)}
          style={{
            width: '100%',
            minHeight: '80px',
            padding: '10px 12px',
            background: 'var(--bg-3)',
            border: '1px solid var(--b-1)',
            borderRadius: 'var(--r-md)',
            color: 'var(--tx-1)',
            fontSize: 'var(--t-sm)',
            fontFamily: 'var(--font)',
            marginBottom: 12,
            resize: 'vertical',
          }}
        />

        <button
          onClick={generate}
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px 16px',
            background: loading ? 'var(--bg-4)' : 'var(--acc-m)',
            color: loading ? 'var(--tx-3)' : 'var(--acc)',
            border: `1px solid ${loading ? 'var(--b-1)' : 'var(--acc-b)'}`,
            borderRadius: 'var(--r-md)',
            fontSize: 'var(--t-sm)',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? '⏳ Generating...' : '🎯 Generate CTAs'}
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
        {ctas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--tx-3)' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>📢</div>
            <p>Generate CTAs to get started</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ctas.map((cta, idx) => {
              const typeColor = CTA_TYPE_COLORS[cta.type] || CTA_TYPE_COLORS.dm
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
                      {cta.type}
                    </div>
                    {cta.effectiveness && (
                      <div style={{
                        fontSize: 'var(--t-base)',
                        fontWeight: 700,
                        color: getScoreColor(cta.effectiveness),
                      }}>
                        {Math.round(cta.effectiveness)}%
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: 'var(--t-sm)', color: 'var(--tx-1)', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                    {cta.text}
                  </p>
                  {cta.rationale && (
                    <p style={{ fontSize: 'var(--t-xs)', color: 'var(--tx-3)', marginTop: 8, marginBottom: 0 }}>
                      💡 {cta.rationale}
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
