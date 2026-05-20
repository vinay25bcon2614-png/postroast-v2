import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
const apiUrl = import.meta.env.VITE_API_URL

export interface AppUser {
  id: string
  email: string
  username?: string
  avatar_url?: string
  plan_type: 'free' | 'pro' | 'premium'
  roasts_today: number
  roasts_month: number
  roasts_to_date: number
  stripe_customer_id?: string
  created_at: string
  last_roast_at?: string
}

export interface UserProfile {
  id: string
  email: string
  username?: string
  avatar_url?: string
  bio?: string
  plan_type: 'free' | 'pro' | 'premium'
}

export interface UserGoal {
  id: string
  goal_id: string
  priority: number
}

export function useUser() {
  const [user, setUser] = useState<AppUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [goals, setGoals] = useState<UserGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [isPro, setIsPro] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true)

        // Get session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.user) {
          setUser(null)
          setProfile(null)
          setLoading(false)
          return
        }

        // Get profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profileData) {
          setProfile(profileData)
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            username: profileData.username,
            avatar_url: profileData.avatar_url,
            plan_type: profileData.plan_type || 'free',
            roasts_today: profileData.roasts_today || 0,
            roasts_month: profileData.roasts_month || 0,
            roasts_to_date: profileData.roasts_today || 0, // Placeholder
            stripe_customer_id: profileData.stripe_customer_id,
            created_at: profileData.created_at,
            last_roast_at: profileData.last_roast_at
          })
          
          setIsPro(profileData.plan_type === 'pro' || profileData.plan_type === 'premium')
        }

        // Get user goals
        const { data: goalsData } = await supabase
          .from('user_goals')
          .select('*')
          .eq('user_id', session.user.id)
          .order('priority')

        if (goalsData) {
          setGoals(goalsData)
        }
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadUser()
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const canRoast = useCallback(() => {
    if (!user) return false
    if (isPro) return true
    if (user.plan_type === 'free') {
      return user.roasts_today < 3
    }
    return true
  }, [user, isPro])

  const primaryGoal = goals.length > 0 ? goals[0]?.goal_id : null

  return {
    user,
    profile,
    goals,
    loading,
    isPro,
    primaryGoal,
    canRoast: canRoast()
  }
}
