import { createBrowserClient } from '@supabase/ssr'

/**
 * Browser client with proper session persistence using cookies
 * This is used in React components and contexts
 */
export function createClient() {
  return createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  )
}

// Singleton instance for use in components
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient()
  }
  return supabaseInstance
}
