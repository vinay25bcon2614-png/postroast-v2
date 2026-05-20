import { useState, useCallback } from 'react'
import { useUser } from './useUser'

const apiUrl = import.meta.env.VITE_API_URL
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

export interface AnalyticsData {
  avgScore: number
  totalPosts: number
  improvementPercent: number
  topDimensions: Array<{ label: string; score: number }>
  trendData: Array<{ date: string; score: number }>
  weeklyAvg: number
  monthlyAvg: number
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()

  const fetchAnalytics = useCallback(
    async (days: number = 30) => {
      if (!user) {
        setError('Not authenticated')
        return null
      }

      try {
        setLoading(true)
        setError(null)

        const { data: { session } } = await (
          await import('@supabase/supabase-js')
        ).createClient(supabaseUrl, import.meta.env.VITE_SUPABASE_ANON_KEY).auth.getSession()

        if (!session?.access_token) {
          setError('No auth token')
          return null
        }

        const response = await fetch(`${apiUrl}/api/analytics?days=${days}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch analytics')
        }

        const result = await response.json()
        setData(result.analytics)
        return result.analytics
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
        console.error('Analytics error:', err)
        return null
      } finally {
        setLoading(false)
      }
    },
    [user]
  )

  return { data, fetchAnalytics, loading, error }
}
