'use client'
import { useState } from 'react'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { EmptyState } from '@/components/shared/EmptyState'
import { CardSkeleton } from '@/components/shared/LoadingSkeleton'

type Tab = 'overall' | 'improved' | 'hooks'

const TAB_LABELS: Record<Tab, string> = {
  overall: 'Overall score',
  improved: 'Most improved',
  hooks: 'Best hooks',
}

const SCORE_FIELD: Record<Tab, string> = {
  overall: 'avg_score',
  improved: 'improvement_this_week',
  hooks: 'best_hook_score',
}

export function LeaderboardScreen() {
  const [tab, setTab] = useState<Tab>('overall')
  const { data, loading, error } = useLeaderboard(tab)

  const getScoreColor = (s: number) => s >= 75 ? '#22c55e' : s >= 55 ? '#f59e0b' : '#ef4444'
  const getImpColor = (s: number) => s > 0 ? '#22c55e' : s < 0 ? '#ef4444' : '#f59e0b'

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {/* Tab Selector */}
      <div style={{ padding: '16px', display: 'flex', gap: 8, borderBottom: '1px solid var(--b-1)' }}>
        {Object.entries(TAB_LABELS).map(([tabId, label]) => (
          <button
            key={tabId}
            onClick={() => setTab(tabId as Tab)}
            style={{
              padding: '8px 14px',
              background: tab === tabId ? 'var(--acc-m)' : 'transparent',
              color: tab === tabId ? 'var(--acc)' : 'var(--tx-3)',
              border: tab === tabId ? `1px solid var(--acc-b)` : 'none',
              borderRadius: 'var(--r-md)',
              fontSize: 'var(--t-sm)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all var(--dur-fast)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1,2,3,4,5].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : !data || data.entries.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
          <EmptyState
            icon="🏆"
            title="No Leaderboard Yet"
            description="Roast more posts to climb the rankings"
            action={{ label: 'Start Roasting', onClick: () => window.location.href = '/roast' }}
          />
        </div>
      ) : (
        <div>
          {/* User Rank */}
          {data.userRank && (
            <div style={{
              padding: '16px',
              background: 'var(--acc-m)',
              border: '1px solid var(--acc-b)',
              margin: '16px',
              borderRadius: 'var(--r-lg)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44,
                  height: 44,
                  background: 'var(--acc)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 700,
                  color: 'white',
                }}>
                  #{data.userRank.rank}
                </div>
                <div>
                  <div style={{ fontSize: 'var(--t-sm)', fontWeight: 600, color: 'var(--tx-1)' }}>
                    You're Ranked {data.userRank.rank}
                  </div>
                  <div style={{ fontSize: 'var(--t-xs)', color: 'var(--tx-3)' }}>
                    Score: {Math.round(data.userRank[SCORE_FIELD[tab] as keyof typeof data.userRank] || 0)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rankings */}
          <div style={{ padding: '16px' }}>
            {data.entries.map((entry, idx) => {
              const score = entry[SCORE_FIELD[tab] as keyof typeof entry] as number || 0
              const isCurrentUser = entry.user_id === data.currentUserId
              return (
                <div
                  key={entry.user_id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px',
                    background: isCurrentUser ? 'var(--acc-m)' : 'var(--bg-3)',
                    border: `1px solid ${isCurrentUser ? 'var(--acc-b)' : 'var(--b-1)'}`,
                    borderRadius: 'var(--r-md)',
                    marginBottom: 8,
                  }}
                >
                  <div style={{
                    width: 32,
                    height: 32,
                    background: 'var(--bg-4)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--t-sm)',
                    fontWeight: 600,
                    color: idx === 0 ? '#f59e0b' : idx === 1 ? '#c0c0c0' : idx === 2 ? '#b87333' : 'var(--tx-3)',
                  }}>
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 'var(--t-sm)', fontWeight: 500, color: 'var(--tx-1)' }}>
                      {entry.user_name}
                    </div>
                    <div style={{ fontSize: 'var(--t-xs)', color: 'var(--tx-4)' }}>
                      {entry.user_posts || 0} posts
                    </div>
                  </div>
                  <div style={{
                    fontSize: 'var(--t-base)',
                    fontWeight: 700,
                    color: getScoreColor(score),
                  }}>
                    {Math.round(score)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
