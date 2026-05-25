import { createClient } from '@supabase/supabase-js'

/**
 * Server-side Supabase client for Express backend
 * Uses service role key for admin operations
 */
export function getSupabaseServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase server environment variables')
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

/**
 * User-context Supabase client (uses user's token from request)
 * For operations that should respect row-level security policies
 */
export function createUserContextClient(accessToken: string) {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  const client = createClient(supabaseUrl, supabaseKey)
  
  // Set the user's access token for this request
  client.auth.setSession({
    access_token: accessToken,
    refresh_token: '',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: 'bearer',
    user: null as any
  })

  return client
}

/**
 * Extract token from request headers
 */
export function getTokenFromRequest(req: any): string | null {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}
