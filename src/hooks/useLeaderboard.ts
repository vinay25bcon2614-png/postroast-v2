import { useState, useCallback } from 'react'
import { useUser } from './useUser'

const apiUrl = import.meta.env.VITE_API_URL
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  avatarUrl?: string
  avgScore: number
  totalPosts: number
  bestScore: number
  improvement: number
  optedIn: boolean
}

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()

  const fetchLeaderboard = useCallback(
    async (metric: string = 'overall') => {
      try {
        setLoading(true)
        setError(null)

        const { data: { session } } = await (
          await import('@supabase/supabase-js')
        ).createClient(supabaseUrl, import.meta.env.VITE_SUPABASE_ANON_KEY).auth.getSession()

        const headers: HeadersInit = {
          'Content-Type': 'application/json'
        }

        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`
        }

        const response = await fetch(
          `${apiUrl}/api/leaderboard?metric=${metric}`,
          { headers }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard')
        }

        const result = await response.json()
        setEntries(result.entries)
        if (result.userRank && user) {
          setUserRank(result.userRank)
        }
        return result.entries
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
        console.error('Leaderboard error:', err)
        return null
      } finally {
        setLoading(false)
      }
    },
    [user]
  )

  return { entries, userRank, fetchLeaderboard, loading, error }
}
