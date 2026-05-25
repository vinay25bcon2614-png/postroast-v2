import { createClient } from '@supabase/supabase-js';

export function getSupabaseServerClient() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function createUserContextClient(accessToken) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // If a token is provided, use it to authenticate
  if (accessToken) {
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: '',
      user: null
    });
  }

  return supabase;
}

export function getTokenFromRequest(req) {
  return req.headers.authorization?.replace('Bearer ', '') || null;
}

export function createSupabaseClient(token) {
  return createUserContextClient(token);
}

export function getUser(token) {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return { id: payload.sub, email: payload.email };
  } catch (e) {
    return null;
  }
}
