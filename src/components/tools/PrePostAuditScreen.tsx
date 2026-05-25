'use client'
import { useState } from 'react'
import { useUser } from '@/hooks/useUser'

interface AuditCheck {
  id: string
  label: string
  pass: boolean
  warn: boolean
  detail: string
}

interface AuditResult {
  checks: AuditCheck[]
  verdict: { status: string; label: string; detail: string }
  predictedScore: number
  hookScore: number
}

export function PrePostAuditScreen() {
  const [postText, setPostText] = useState('')
  const [result, setResult] = useState<AuditResult | null>(null)
  const [loading, setLoading] = useState(false)
  const { goals } = useUser()
  const primaryGoal = goals[0]?.goal_id || 'get_clients'

  const audit = async () => {
    if (!postText.trim()) return
    setLoading(true)
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: postText, goal: primaryGoal }),
      })
      const data = await response.json()
      if (response.ok) {
        setResult(data)
      }
    } catch (err) {
      console.error('Error auditing:', err)
    } finally {
      setLoading(false)
    }
  }

  const getVerdictColor = (status: string) => {
    if (status === 'pass') return '#22c55e'
    if (status === 'warn') return '#f59e0b'
    return '#ef4444'
  }

  const getCheckColor = (check: AuditCheck) => {
    if (check.pass) return '#22c55e'
    if (check.warn) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {/* Input Section */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--b-1)' }}>
        <label style={{ display: 'block', fontSize: 'var(--t-xs)', fontWeight: 600, color: 'var(--tx-2)', marginBottom: 6, textTransform: 'uppercase' }}>
          Post Content
        </label>
        <textarea
          placeholder="Paste your LinkedIn post here..."
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          style={{
            width: '100%',
            minHeight: '120px',
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

        <div style={{ fontSize: 'var(--t-xs)', color: 'var(--tx-4)', marginBottom: 12 }}>
          {postText.length} characters
        </div>

        <button
          onClick={audit}
          disabled={!postText.trim() || loading}
          style={{
            width: '100%',
            padding: '10px 16px',
            background: loading || !postText.trim() ? 'var(--bg-4)' : 'var(--acc-m)',
            color: loading || !postText.trim() ? 'var(--tx-3)' : 'var(--acc)',
            border: `1px solid ${loading || !postText.trim() ? 'var(--b-1)' : 'var(--acc-b)'}`,
            borderRadius: 'var(--r-md)',
            fontSize: 'var(--t-sm)',
            fontWeight: 600,
            cursor: loading || !postText.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !postText.trim() ? 0.6 : 1,
          }}
        >
          {loading ? '⏳ Auditing...' : '✅ Run Audit'}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div style={{ padding: '16px' }}>
          {/* Verdict */}
          <div
            style={{
              padding: '16px',
              background: `${getVerdictColor(result.verdict.status)}22`,
              border: `1px solid ${getVerdictColor(result.verdict.status)}44`,
              borderRadius: 'var(--r-lg)',
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: getVerdictColor(result.verdict.status),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                color: 'white',
              }}>
                {result.verdict.status === 'pass' ? '✓' : result.verdict.status === 'warn' ? '⚠' : '✕'}
              </div>
              <div>
                <div style={{ fontSize: 'var(--t-base)', fontWeight: 600, color: getVerdictColor(result.verdict.status) }}>
                  {result.verdict.label}
                </div>
                <div style={{ fontSize: 'var(--t-xs)', color: 'var(--tx-3)' }}>
                  {result.verdict.detail}
                </div>
              </div>
            </div>

            {/* Score Predictions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
              <div style={{ padding: 10, background: 'var(--bg-3)', borderRadius: 'var(--r-md)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--t-xs)', color: 'var(--tx-4)' }}>Predicted Score</div>
                <div style={{ fontSize: 'var(--t-lg)', fontWeight: 700, color: 'var(--acc)' }}>
                  {Math.round(result.predictedScore)}
                </div>
              </div>
              <div style={{ padding: 10, background: 'var(--bg-3)', borderRadius: 'var(--r-md)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--t-xs)', color: 'var(--tx-4)' }}>Hook Score</div>
                <div style={{ fontSize: 'var(--t-lg)', fontWeight: 700, color: '#22c55e' }}>
                  {Math.round(result.hookScore)}
                </div>
              </div>
            </div>
          </div>

          {/* Checks */}
          <h3 style={{ fontSize: 'var(--t-sm)', fontWeight: 600, color: 'var(--tx-1)', marginBottom: 12, margin: '16px 0 12px 0' }}>
            Quality Checks
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {result.checks.map(check => (
              <div
                key={check.id}
                style={{
                  padding: '12px',
                  background: 'var(--bg-3)',
                  border: `1px solid ${getCheckColor(check)}33`,
                  borderRadius: 'var(--r-md)',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    fontSize: 'var(--t-lg)',
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {check.pass ? '✓' : check.warn ? '⚠' : '✕'}
                </div>
                <div>
                  <div style={{ fontSize: 'var(--t-sm)', fontWeight: 500, color: getCheckColor(check), marginBottom: 2 }}>
                    {check.label}
                  </div>
                  <div style={{ fontSize: 'var(--t-xs)', color: 'var(--tx-3)' }}>
                    {check.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!result && !loading && (
        <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--tx-3)' }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>🔍</div>
          <p>Audit your post before publishing</p>
        </div>
      )}
    </div>
  )
}
