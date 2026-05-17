import { createClient } from '@supabase/supabase-js';

export function createSupabaseClient(token) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // If a token is provided, use it to authenticate
  if (token) {
    supabase.auth.setSession({
      access_token: token,
      refresh_token: '',
      user: null
    });
  }

  return supabase;
}

export function getUser(token) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
  
  if (!token) return null;
  
  // Decode JWT to get user info (in production, verify the signature)
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return { id: payload.sub, email: payload.email };
  } catch (e) {
    return null;
  }
}
