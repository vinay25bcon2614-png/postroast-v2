import { useState, useCallback } from 'react'
import { useUser } from './useUser'

const apiUrl = import.meta.env.VITE_API_URL
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

export interface StyleDNA {
  dnaLevel: string
  roastsAnalyzed: number
  directness: number
  storytelling: number
  authority: number
  humor: number
  specificity: number
  formality: number
  urgency: number
  personalization: number
}

export function useStyleDNA() {
  const [dna, setDna] = useState<StyleDNA | null>(null)
  const [loading, setLoading] = useState(false)
  const [analysing, setAnalysing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()

  const fetchStyleDNA = useCallback(async () => {
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

      const response = await fetch(`${apiUrl}/api/dna`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch Style DNA')
      }

      const result = await response.json()
      setDna(result.dna)
      return result.dna
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      console.error('Style DNA error:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [user])

  const reanalyse = useCallback(async () => {
    if (!user) {
      setError('Not authenticated')
      return false
    }

    try {
      setAnalysing(true)
      setError(null)

      const { data: { session } } = await (
        await import('@supabase/supabase-js')
      ).createClient(supabaseUrl, import.meta.env.VITE_SUPABASE_ANON_KEY).auth.getSession()

      if (!session?.access_token) {
        setError('No auth token')
        return false
      }

      const response = await fetch(`${apiUrl}/api/dna/analyse`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      await fetchStyleDNA()
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      console.error('Reanalyse error:', err)
      return false
    } finally {
      setAnalysing(false)
    }
  }, [user, fetchStyleDNA])

  const dnaLevel = dna ? dna.dnaLevel : 'not_started'

  return {
    dna,
    dnaLevel,
    loading,
    analysing,
    error,
    fetchStyleDNA,
    reanalyse
  }
}
