import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { User, UserGoal, UserProfile, Subscription } from '@/lib/database.types'

export interface UserData {
  user: User | null
  profile: UserProfile | null
  goals: UserGoal[]
  subscription: Subscription | null
  isPro: boolean
}

export function useUser(): UserData & { loading: boolean; error: any; canRoast: boolean } {
  const { user: authUser } = useAuth()
  const supabase = getSupabaseClient()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState<UserData>({
    user: null,
    profile: null,
    goals: [],
    subscription: null,
    isPro: false
  })

  useEffect(() => {
    if (!authUser?.id) {
      setLoading(false)
      return
    }

    async function loadUserData() {
      try {
        setError(null)

        // Fetch user record
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (userError && userError.code !== 'PGRST116') throw userError

        // Fetch user profile
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', authUser.id)
          .single()

        // Fetch user goals
        const { data: goalsData } = await supabase
          .from('user_goals')
          .select('*')
          .eq('user_id', authUser.id)
          .order('priority', { ascending: true })

        // Fetch subscription
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', authUser.id)
          .single()

        const isPro = subData?.plan_type === 'pro' && subData?.status === 'active'

        setData({
          user: userData,
          profile: profileData,
          goals: goalsData || [],
          subscription: subData,
          isPro
        })
      } catch (err) {
        console.error('Error loading user data:', err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [authUser?.id, supabase])

  const canRoast = useCallback(() => {
    if (!authUser?.id) return false
    if (data.isPro) return true
    // Free plan: 3 roasts per day (would need to check usage_logs)
    return true // TODO: Check actual usage
  }, [authUser?.id, data.isPro])

  return {
    ...data,
    loading,
    error,
    canRoast: canRoast()
  }
}
