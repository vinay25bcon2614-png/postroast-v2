'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { EmptyState } from '@/components/shared/EmptyState'

const GOAL_META: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  get_clients: { label: 'Get Inbound Clients', icon: '💼', color: '#FF5C00', bg: 'rgba(255,92,0,.10)' },
  authority: { label: 'Build Authority', icon: '⭐', color: '#f59e0b', bg: 'rgba(245,158,11,.12)' },
  grow_audience: { label: 'Grow Audience', icon: '👥', color: '#3b82f6', bg: 'rgba(59,130,246,.12)' },
  thought_leader: { label: 'Thought Leader', icon: '🎤', color: '#a855f7', bg: 'rgba(168,85,247,.12)' },
  viral: { label: 'Go Viral', icon: '🔥', color: '#ef4444', bg: 'rgba(239,68,68,.12)' },
  personal_brand: { label: 'Personal Brand', icon: '🏢', color: '#22c55e', bg: 'rgba(34,197,94,.12)' },
}

const GOAL_RECOMMENDATIONS: Record<string, (avgScore: number, ctaAvg: number, postCount: number) => string> = {
  get_clients: (avg, cta, count) =>
    cta < 50 ? 'Your CTA scores are weak. Use command words: "DM me" instead of "reach out".' :
    avg < 60 ? 'Focus on case studies and social proof formats to build client trust.' :
    'Great momentum. Keep posting consistently and track your inquiry rate.',
  authority: (avg, _, count) =>
    count < 5 ? 'Roast at least 5 posts to build your authority profile.' :
    avg < 65 ? 'Include data, research, and specific examples in every post.' :
    'You\'re establishing authority well. Mix teaching posts with contrarian takes.',
  grow_audience: (avg, _, count) =>
    avg < 60 ? 'Your engagement hooks need work. Open with questions or surprising stats.' :
    'Good growth trajectory. Consistency matters more than perfection here.',
  default: (avg) => `Average score: ${avg}. Keep posting consistently and use the Format Library to improve structure.`,
}

interface GoalStats {
  goalId: string
  priority: number
  postCount: number
  avgScore: number
  avgCTA: number
  bestFormat: string | null
  formatBreakdown: Record<string, number>
}

export function GoalTrackerScreen({ onNavigate }: { onNavigate: (s: string) => void }) {
  const { user, goals } = useUser()
  const [stats, setStats] = useState<GoalStats[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!user || goals.length === 0) { setLoading(false); return }
    loadStats()
  }, [user, goals])

  async function loadStats() {
    setLoading(true)
    try {
      const { data: roasts } = await supabase
        .from('roasts')
        .select('scores, format_detected, goals')
        .eq('user_id', user?.id)

      const statMap: Record<string, GoalStats> = {}

      goals.forEach(g => {
        statMap[g.goal_id] = {
          goalId: g.goal_id,
          priority: g.priority,
          postCount: 0,
          avgScore: 0,
          avgCTA: 0,
          bestFormat: null,
          formatBreakdown: {},
        }
      })

      if (roasts && roasts.length > 0) {
        roasts.forEach(roast => {
          const scores = roast.scores || {}
          const fmt = roast.format_detected || 'Unknown'
          const postGoals = roast.goals || []

          postGoals.forEach((goalId: string) => {
            if (statMap[goalId]) {
              statMap[goalId].postCount += 1
              statMap[goalId].avgScore += scores.overall || 0
              statMap[goalId].avgCTA += scores.cta || 0
              statMap[goalId].formatBreakdown[fmt] = (statMap[goalId].formatBreakdown[fmt] || 0) + 1
            }
          })
        })

        Object.values(statMap).forEach(stat => {
          if (stat.postCount > 0) {
            stat.avgScore = stat.avgScore / stat.postCount
            stat.avgCTA = stat.avgCTA / stat.postCount
            stat.bestFormat = Object.entries(stat.formatBreakdown).sort((a, b) => b[1] - a[1])[0]?.[0] || null
          }
        })
      }

      setStats(Object.values(statMap).sort((a, b) => a.priority - b.priority))
    } catch (err) {
      console.error('Error loading stats:', err)
    }
    setLoading(false)
  }

  if (!loading && goals.length === 0) {
    return (
      <EmptyState
        icon="🎯"
        title="No Goals Set"
        description="Set your primary goals to track progress"
        action={{ label: 'Go to Settings', onClick: () => onNavigate('settings') }}
      />
    )
  }

  const getRecommendation = (stat: GoalStats) => {
    const fn = GOAL_RECOMMENDATIONS[stat.goalId] || GOAL_RECOMMENDATIONS.default
    return fn(stat.avgScore, stat.avgCTA, stat.postCount)
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {loading ? (
        <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--tx-3)' }}>
          Loading goal stats...
        </div>
      ) : (
        <div style={{ padding: '16px' }}>
          {stats.map(stat => {
            const meta = GOAL_META[stat.goalId] || GOAL_META.get_clients
            return (
              <div
                key={stat.goalId}
                style={{
                  background: 'var(--bg-3)',
                  border: '1px solid var(--b-1)',
                  borderRadius: 'var(--r-lg)',
                  padding: '16px',
                  marginBottom: 12,
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ fontSize: 28 }}>{meta.icon}</div>
                  <div>
                    <h3 style={{ fontSize: 'var(--t-base)', fontWeight: 600, color: 'var(--tx-1)', margin: 0 }}>
                      {meta.label}
                    </h3>
                    <div style={{ fontSize: 'var(--t-xs)', color: 'var(--tx-4)' }}>
                      Priority {stat.priority}
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
                  <div style={{ background: 'var(--bg-4)', padding: 10, borderRadius: 'var(--r-md)', textAlign: 'center' }}>
                    <div style={{ fontSize: 'var(--t-xs)', color: 'var(--tx-4)' }}>Posts</div>
                    <div style={{ fontSize: 'var(--t-lg)', fontWeight: 700, color: 'var(--tx-1)' }}>
                      {stat.postCount}
                    </div>
                  </div>
                  <div style={{ background: 'var(--bg-4)', padding: 10, borderRadius: 'var(--r-md)', textAlign: 'center' }}>
                    <div style={{ fontSize: 'var(--t-xs)', color: 'var(--tx-4)' }}>Avg Score</div>
                    <div style={{ fontSize: 'var(--t-lg)', fontWeight: 700, color: stat.avgScore >= 70 ? '#22c55e' : stat.avgScore >= 50 ? '#f59e0b' : '#ef4444' }}>
                      {Math.round(stat.avgScore)}
                    </div>
                  </div>
                  <div style={{ background: 'var(--bg-4)', padding: 10, borderRadius: 'var(--r-md)', textAlign: 'center' }}>
                    <div style={{ fontSize: 'var(--t-xs)', color: 'var(--tx-4)' }}>CTA</div>
                    <div style={{ fontSize: 'var(--t-lg)', fontWeight: 700, color: stat.avgCTA >= 70 ? '#22c55e' : stat.avgCTA >= 50 ? '#f59e0b' : '#ef4444' }}>
                      {Math.round(stat.avgCTA)}
                    </div>
                  </div>
                  <div style={{ background: 'var(--bg-4)', padding: 10, borderRadius: 'var(--r-md)', textAlign: 'center' }}>
                    <div style={{ fontSize: 'var(--t-xs)', color: 'var(--tx-4)' }}>Best Format</div>
                    <div style={{ fontSize: 'var(--t-sm)', fontWeight: 600, color: 'var(--tx-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {stat.bestFormat || '—'}
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div style={{
                  padding: 10,
                  background: 'var(--acc-m)',
                  border: '1px solid var(--acc-b)',
                  borderRadius: 'var(--r-md)',
                  fontSize: 'var(--t-sm)',
                  color: 'var(--acc)',
                  lineHeight: 1.5,
                }}>
                  💡 {getRecommendation(stat)}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
