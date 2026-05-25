'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { EmptyState } from '@/components/shared/EmptyState'
import { UpgradeWall } from '@/components/shared/UpgradeWall'

interface Post {
  id: string
  text: string
  score: number
  format: string
  goals: any[]
  date: string
  scores: any
}

export function PostHistoryScreen({ onReroast }: { onReroast: (text: string) => void }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [goalFilter, setGoalFilter] = useState('all')
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const { user, isPro } = useUser()
  const supabase = createClient()

  const PAGE_SIZE = 20
  const HISTORY_DAYS = isPro ? 365 : 7

  useEffect(() => { if (user) load() }, [user, page, search, goalFilter])

  async function load() {
    setLoading(true)
    const start = page * PAGE_SIZE
    try {
      let query = supabase
        .from('roasts')
        .select('*', { count: 'exact' })
        .eq('user_id', user?.id)
        .gte('created_at', new Date(Date.now() - HISTORY_DAYS * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })

      if (search) query = query.or(`text.ilike.%${search}%,format_detected.ilike.%${search}%`)
      if (goalFilter !== 'all') query = query.cs('goals', `{${goalFilter}}`)

      const { data, count } = await query.range(start, start + PAGE_SIZE - 1)
      if (data) {
        setPosts(data.map(r => ({
          id: r.id,
          text: r.text || '',
          score: r.scores?.overall || 0,
          format: r.format_detected || 'Unknown',
          goals: r.goals || [],
          date: r.created_at,
          scores: r.scores,
        })))
        setTotal(count || 0)
      }
    } catch (err) {
      console.error('Error loading posts:', err)
    }
    setLoading(false)
  }

  const getScoreColor = (s: number) => s >= 70 ? '#22c55e' : s >= 50 ? '#f59e0b' : '#ef4444'
  const fmt = (iso: string) => {
    const d = new Date(iso), now = Date.now(), diff = now - d.getTime()
    if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`
    if (diff < 604800000) return `${Math.floor(diff/86400000)}d ago`
    return d.toLocaleDateString()
  }

  if (!loading && posts.length === 0 && !search) {
    return (
      <EmptyState
        icon="📜"
        title="No History Yet"
        description={`History available for last ${HISTORY_DAYS} days`}
        action={{ label: 'Start Roasting', onClick: () => window.location.href = '/roast' }}
      />
    )
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {/* Search & Filter */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--b-1)', display: 'flex', gap: 8 }}>
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          style={{
            flex: 1,
            padding: '8px 12px',
            background: 'var(--bg-3)',
            border: '1px solid var(--b-1)',
            borderRadius: 'var(--r-md)',
            color: 'var(--tx-1)',
            fontSize: 'var(--t-sm)',
          }}
        />
      </div>

      {/* Posts List */}
      <div style={{ padding: '12px 16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--tx-3)', padding: '32px 0' }}>
            Loading posts...
          </div>
        ) : (
          <>
            {posts.map(post => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                style={{
                  background: 'var(--bg-3)',
                  border: '1px solid var(--b-1)',
                  borderRadius: 'var(--r-lg)',
                  padding: '12px',
                  marginBottom: 10,
                  cursor: 'pointer',
                  transition: 'all var(--dur-fast)',
                }}
              >
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: getScoreColor(post.score),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: 'var(--t-lg)',
                      flexShrink: 0,
                    }}
                  >
                    {Math.round(post.score)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 'var(--t-sm)',
                      color: 'var(--tx-2)',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      marginBottom: 6,
                    }}>
                      {post.text.substring(0, 140)}...
                    </div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 'var(--t-xs)', color: 'var(--tx-4)' }}>
                      <span>{post.format}</span>
                      <span>•</span>
                      <span>{fmt(post.date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {total > PAGE_SIZE && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, padding: '12px 0' }}>
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  style={{
                    padding: '8px 12px',
                    background: page === 0 ? 'var(--bg-4)' : 'var(--bg-3)',
                    color: 'var(--tx-2)',
                    border: '1px solid var(--b-1)',
                    borderRadius: 'var(--r-md)',
                    cursor: page === 0 ? 'not-allowed' : 'pointer',
                    opacity: page === 0 ? 0.5 : 1,
                  }}
                >
                  ← Previous
                </button>
                <div style={{ fontSize: 'var(--t-xs)', color: 'var(--tx-3)' }}>
                  Page {page + 1} of {Math.ceil(total / PAGE_SIZE)}
                </div>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={(page + 1) * PAGE_SIZE >= total}
                  style={{
                    padding: '8px 12px',
                    background: (page + 1) * PAGE_SIZE >= total ? 'var(--bg-4)' : 'var(--bg-3)',
                    color: 'var(--tx-2)',
                    border: '1px solid var(--b-1)',
                    borderRadius: 'var(--r-md)',
                    cursor: (page + 1) * PAGE_SIZE >= total ? 'not-allowed' : 'pointer',
                    opacity: (page + 1) * PAGE_SIZE >= total ? 0.5 : 1,
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedPost && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
        }} onClick={() => setSelectedPost(null)}>
          <div
            style={{
              background: 'var(--bg-2)',
              borderRadius: 'var(--r-lg)',
              padding: '24px',
              maxWidth: 500,
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 'var(--t-base)', fontWeight: 600, color: 'var(--tx-1)', marginBottom: 12 }}>
              Post Details
            </h3>

            <div style={{ marginBottom: 16, padding: '12px', background: 'var(--bg-3)', borderRadius: 'var(--r-md)' }}>
              <p style={{ fontSize: 'var(--t-sm)', color: 'var(--tx-2)', lineHeight: 1.6, margin: 0 }}>
                {selectedPost.text}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              <div style={{ padding: 10, background: 'var(--bg-3)', borderRadius: 'var(--r-md)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--t-xs)', color: 'var(--tx-4)' }}>Overall</div>
                <div style={{ fontSize: 'var(--t-lg)', fontWeight: 700, color: getScoreColor(selectedPost.score) }}>
                  {Math.round(selectedPost.score)}
                </div>
              </div>
              <div style={{ padding: 10, background: 'var(--bg-3)', borderRadius: 'var(--r-md)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--t-xs)', color: 'var(--tx-4)' }}>Format</div>
                <div style={{ fontSize: 'var(--t-sm)', fontWeight: 600, color: 'var(--tx-1)' }}>
                  {selectedPost.format}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onReroast(selectedPost.text)
                setSelectedPost(null)
              }}
              style={{
                width: '100%',
                padding: '10px 16px',
                background: 'var(--acc-m)',
                color: 'var(--acc)',
                border: '1px solid var(--acc-b)',
                borderRadius: 'var(--r-md)',
                fontSize: 'var(--t-sm)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Re-roast This Post
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
