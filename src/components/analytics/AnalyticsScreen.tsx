'use client'
import { useState } from 'react'
import { useAnalytics } from '@/hooks/useAnalytics'
import { EmptyState } from '@/components/shared/EmptyState'
import { CardSkeleton } from '@/components/shared/LoadingSkeleton'
import { ErrorState } from '@/components/shared/ErrorState'

function MiniChart({ data, height = 60 }: { data: number[]; height?: number }) {
  if (!data.length) return null
  const max = Math.max(...data, 1)
  const getColor = (v: number) => v >= 70 ? '#22c55e' : v >= 50 ? '#f59e0b' : '#ef4444'
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height }}>
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${(v / max) * 100}%`,
            background: getColor(v),
            borderRadius: '2px',
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  )
}

function DimensionBar({ label, score }: { label: string; score: number }) {
  const color = score >= 70 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
      <span style={{ fontSize: 'var(--t-xs)', fontWeight: 500, color: 'var(--tx-2)', minWidth: 60 }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 4, background: 'var(--bg-5)', borderRadius: 'var(--r-full)', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${score}%`,
            background: color,
            borderRadius: 'inherit',
          }}
        />
      </div>
      <span style={{ fontSize: 'var(--t-sm)', fontWeight: 600, color, minWidth: 30, textAlign: 'right' }}>
        {score}
      </span>
    </div>
  )
}

export function AnalyticsScreen() {
  const [days, setDays] = useState(30)
  const { data, loading, error } = useAnalytics(days)

  if (loading) return (
    <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {[1,2,3,4,5].map(i => <CardSkeleton key={i} />)}
    </div>
  )

  if (error) return <ErrorState description={error} action={{ label: 'Retry', onClick: () => window.location.reload() }} />

  if (data?.empty) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 16px', gap: 10 }}>
      <EmptyState 
        icon="📊"
        title="No Data Yet"
        description="Roast 3+ posts to see analytics"
        action={{ label: 'Start Roasting', onClick: () => window.location.href = '/roast' }}
      />
    </div>
  )

  const scoreHistory = data?.scoreHistory?.map((p: any) => p.score) || []
  const dimAvgs = data?.dimensionAverages || {}
  const fmtPerf = data?.formatPerformance || {}

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {/* Time Range Selector */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--b-1)', display: 'flex', gap: 8 }}>
        {[7, 30, 90, 365].map(d => (
          <button
            key={d}
            onClick={() => setDays(d)}
            style={{
              padding: '6px 12px',
              background: days === d ? 'var(--acc-m)' : 'var(--bg-3)',
              color: days === d ? 'var(--acc)' : 'var(--tx-3)',
              border: `1px solid ${days === d ? 'var(--acc-b)' : 'var(--b-1)'}`,
              borderRadius: 'var(--r-md)',
              fontSize: 'var(--t-xs)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all var(--dur-fast)',
            }}
          >
            {d}d
          </button>
        ))}
      </div>

      {/* Score Trend */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--b-1)' }}>
        <h3 style={{ fontSize: 'var(--t-sm)', fontWeight: 600, color: 'var(--tx-1)', marginBottom: 12, margin: 0 }}>
          Score Trend
        </h3>
        <div style={{ height: 80, marginBottom: 8 }}>
          <MiniChart data={scoreHistory} height={80} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, fontSize: 'var(--t-xs)', color: 'var(--tx-3)' }}>
          <div>Avg: {Math.round(data?.averageScore || 0)}</div>
          <div>Min: {Math.min(...scoreHistory, 0)}</div>
          <div>Max: {Math.max(...scoreHistory, 0)}</div>
        </div>
      </div>

      {/* Dimension Averages */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--b-1)' }}>
        <h3 style={{ fontSize: 'var(--t-sm)', fontWeight: 600, color: 'var(--tx-1)', marginBottom: 12, margin: 0 }}>
          Dimension Averages
        </h3>
        {Object.entries(dimAvgs).map(([dim, score]) => (
          <DimensionBar key={dim} label={dim.charAt(0).toUpperCase() + dim.slice(1)} score={Math.round(score as number)} />
        ))}
      </div>

      {/* Format Performance */}
      <div style={{ padding: '16px' }}>
        <h3 style={{ fontSize: 'var(--t-sm)', fontWeight: 600, color: 'var(--tx-1)', marginBottom: 12, margin: 0 }}>
          Format Performance
        </h3>
        <div style={{ display: 'grid', gap: 10 }}>
          {Object.entries(fmtPerf).slice(0, 5).map(([fmt, score]) => (
            <div key={fmt} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 'var(--t-xs)', fontWeight: 500, color: 'var(--tx-2)', minWidth: 80 }}>
                {fmt}
              </span>
              <div style={{ flex: 1, height: 4, background: 'var(--bg-4)', borderRadius: 'var(--r-full)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${(score as number)}%`,
                    background: `hsl(${(score as number) * 1.2}, 70%, 50%)`,
                }}
                />
              </div>
              <span style={{ fontSize: 'var(--t-xs)', fontWeight: 600, minWidth: 30, textAlign: 'right' }}>
                {Math.round(score as number)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
