import { useState, useCallback } from 'react'
import { useUser } from './useUser'
import { GoalId } from '../types'

const apiUrl = import.meta.env.VITE_API_URL
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

export interface RoastScore {
  overall: number
  dimensions: {
    hookStrength: number
    clarity: number
    authority: number
    engagement: number
    format: number
    goalAlignment: number
    cta: number
    originality: number
  }
}

export interface RoastAnalysis {
  roastId: string
  compositeScore: number
  scores: Record<string, number>
  formatDetected: string
  summary: string
  weaknesses: string[]
  keyInsight: string
  improvement: string
  goals: GoalId[]
}

export function useRoast() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()

  const roast = useCallback(
    async (
      postText: string,
      goals: Array<{ id: GoalId; label: string }>,
      creatorMix: string[] = []
    ): Promise<RoastAnalysis | null> => {
      if (!user) {
        setError('Not authenticated')
        return null
      }

      try {
        setLoading(true)
        setError(null)

        // Get auth token
        const { data: { session } } = await (
          await import('@supabase/supabase-js')
        ).createClient(supabaseUrl, import.meta.env.VITE_SUPABASE_ANON_KEY).auth.getSession()

        if (!session?.access_token) {
          setError('No auth token')
          return null
        }

        const response = await fetch(`${apiUrl}/api/roast`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            postText,
            goals,
            creatorMix
          })
        })

        if (!response.ok) {
          const errData = await response.json()
          throw new Error(errData.error || 'Roast failed')
        }

        const data = await response.json()
        return {
          roastId: data.roastId,
          compositeScore: data.analysis.compositeScore,
          scores: data.analysis.scores,
          formatDetected: data.analysis.formatDetected,
          summary: data.analysis.summary,
          weaknesses: data.analysis.weaknesses || [],
          keyInsight: data.analysis.keyInsight,
          improvement: data.analysis.improvement,
          goals: goals.map(g => g.id)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
        console.error('Roast error:', err)
        return null
      } finally {
        setLoading(false)
      }
    },
    [user]
  )

  return { roast, loading, error }
}
