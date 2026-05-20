# PostRoast v2 - Implementation Roadmap (Next Steps)

**Start Date:** May 20, 2026  
**Status:** Architecture Complete · Ready for Implementation Testing

---

## 🎯 Phase 1: Verify Everything Works (2-3 hours)

### 1.1 Start Backend Server
```bash
cd my-app
npm run server
```

**Expected Output:**
```
🚀 PostRoast Backend running on http://localhost:3001
📡 Environment: development
📡 Site URL: http://localhost:5174
📡 Supabase connected to https://zipuuq...
✅ Allowed Origins: [...]
```

**If error:** Check NODE_ENV, ANTHROPIC_API_KEY, SUPABASE_URL in .env.local

### 1.2 Start Frontend
```bash
cd my-app
npm run dev
```

**Expected Output:**
```
VITE v8.0.10 ready in ... ms
➜  Local:   http://localhost:5174/
```

### 1.3 Verify Database Connection
```bash
# Option A: In Supabase dashboard
# Go to: https://app.supabase.co
# Select project: postroast-v2
# Check: SQL Editor → Run query

SELECT 1;  -- Should return 1

# Option B: Via Supabase CLI
supabase status

# Option C: Via Node
node -e "const { createClient } = require('@supabase/supabase-js'); const c = createClient('YOUR_URL', 'YOUR_KEY'); c.from('profiles').select('count()').then(r => console.log(r))"
```

### 1.4 Test Roast API
**Using Postman or curl:**

```bash
# First, get a test token from Supabase Auth
# Then use it in this request:

curl -X POST http://localhost:3001/api/roast \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN" \
  -d '{
    "postText": "Sales is NOT about convincing people. It'\''s about finding people who already want what you'\''re selling and showing them the path forward. Nobody buys what they don'\''t want.",
    "goals": [{"id": "get_clients", "label": "Get Clients"}],
    "creatorMix": ["hormozi"]
  }'
```

**Expected Response:**
```json
{
  "roastId": "550e8400-e29b-41d4-a716-446655440000",
  "analysis": {
    "compositeScore": 82,
    "scores": {
      "hook": 85,
      "clarity": 80,
      "authority": 78,
      "engagement": 85,
      "format": 80,
      "goalAlignment": 87,
      "cta": 65,
      "originality": 88
    },
    "formatDetected": "Contrarian",
    "summary": "Strong contrarian post that challenges...",
    "weaknesses": ["No clear CTA", "Could be more specific"],
    "keyInsight": "The contrarian hook is compelling",
    "improvement": "Add 'DM me if you want to learn more'"
  }
}
```

**If error:** Check:
- Is backend running? (netstat -ano | grep 3001)
- Is token valid? (JWT valid from Supabase)
- Are env vars set?

### 1.5 Verify Database Insert
```bash
# Check if roast was saved
# In Supabase SQL Editor:

SELECT id, composite_score, created_at 
FROM roasts 
ORDER BY created_at DESC 
LIMIT 1;
```

**Expected:** One row with your roast

---

## 🟢 Phase 2: Build Authentication (2-3 hours)

### 2.1 Create Auth Context
**File: `src/contexts/AuthContext.tsx`**

```typescript
import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const AuthContext = createContext<any>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, supabase }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
```

### 2.2 Create Sign In Page
**File: `src/components/auth/SignIn.tsx`**

```typescript
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { supabase } = useAuth()
  const navigate = useNavigate()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) throw authError

      if (data.user) {
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '40px 20px' }}>
      <h1>Sign In</h1>
      {error && <div style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</div>}
      <form onSubmit={handleSignIn}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '16px' }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
```

### 2.3 Create Sign Up Page
**File: `src/components/auth/SignUp.tsx`**

```typescript
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { supabase } = useAuth()
  const navigate = useNavigate()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (authError) throw authError

      // Create profile
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: data.user.email,
          plan_type: 'free'
        })

        alert('Sign up successful! Check your email to confirm.')
        navigate('/signin')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '40px 20px' }}>
      <h1>Create Account</h1>
      {error && <div style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</div>}
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
        />
        <input
          type="password"
          placeholder="Password (6+ chars)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
          style={{ width: '100%', padding: '8px', marginBottom: '16px' }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Sign Up'}
        </button>
      </form>
    </div>
  )
}
```

### 2.4 Wire Auth into App.jsx
```typescript
import { AuthProvider } from '@/contexts/AuthContext'
import { SignIn } from '@/components/auth/SignIn'
import { SignUp } from '@/components/auth/SignUp'
import { useAuth } from '@/contexts/AuthContext'

function ProtectedRoute({ children }: any) {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <SignIn />

  return children
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
```

---

## 🔵 Phase 3: Wire Dashboard Data (1-2 hours)

### 3.1 Update DashboardScreen.tsx
```typescript
import { useUser } from '@/hooks/useUser'

export function DashboardScreen() {
  const { user, profile, loading } = useUser()

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>Welcome, {profile?.username || user?.email}!</h1>
      <div>Plan: {user?.plan_type}</div>
      <div>Roasts Today: {user?.roasts_today}</div>
      <div>Last Roast: {user?.last_roast_at}</div>
    </div>
  )
}
```

### 3.2 Update AnalyticsScreen.tsx
```typescript
import { useAnalytics } from '@/hooks/useAnalytics'
import { useState } from 'react'

export function AnalyticsScreen() {
  const [days, setDays] = useState(30)
  const { data, fetchAnalytics, loading } = useAnalytics()

  useEffect(() => {
    fetchAnalytics(days)
  }, [days])

  if (loading) return <div>Loading...</div>
  if (!data) return <div>No data</div>

  return (
    <div>
      <h2>Analytics</h2>
      <div>Avg Score: {data.avgScore}</div>
      <div>Total Posts: {data.totalPosts}</div>
      <div>Improvement: {data.improvementPercent}%</div>
    </div>
  )
}
```

---

## 🟠 Phase 4: Deploy (2-3 hours)

### 4.1 Frontend: Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set env vars in Vercel dashboard
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_API_URL=https://your-backend.com
```

### 4.2 Backend: Railway or Render
```bash
# Option A: Railway
railway link
railway up

# Option B: Render
# Push to GitHub, connect repo to Render
# Set env vars in Render dashboard
```

### 4.3 Production Validation
```bash
# Test sign-up
# Test roast flow
# Check Supabase inserts
# Monitor backend logs
```

---

## ✅ Success Criteria

Phase 1 Complete When:
- [ ] Backend starts without errors
- [ ] Frontend loads
- [ ] Database connected
- [ ] Roast API returns valid response
- [ ] Data saved to Supabase

Phase 2 Complete When:
- [ ] Can sign up
- [ ] Can sign in
- [ ] Session persists on refresh
- [ ] Can access dashboard

Phase 3 Complete When:
- [ ] Dashboard shows real user data
- [ ] Analytics load real data
- [ ] Leaderboard shows rankings
- [ ] All screens display data

Phase 4 Complete When:
- [ ] Site live on production domain
- [ ] Full flow works end-to-end
- [ ] No errors in console
- [ ] Mobile responsive

---

## 📋 Checklist Template

```
[ ] Phase 1: Backend/DB verification
  [ ] Backend starts
  [ ] Frontend loads
  [ ] DB connection works
  [ ] Roast API works
  [ ] Data persists

[ ] Phase 2: Authentication
  [ ] SignIn page created
  [ ] SignUp page created
  [ ] AuthContext wired
  [ ] Session persists
  [ ] Protected routes work

[ ] Phase 3: Data Wiring
  [ ] Dashboard loads real data
  [ ] Analytics loads data
  [ ] Leaderboard loads data
  [ ] All screens responsive

[ ] Phase 4: Deploy
  [ ] Frontend deployed
  [ ] Backend deployed
  [ ] Env vars set
  [ ] End-to-end test passed
  [ ] Production validated
```

---

## 🆘 Troubleshooting

### Issue: "Can't connect to Supabase"
**Solution:**
1. Check SUPABASE_URL is correct
2. Check SUPABASE_ANON_KEY is correct
3. Verify Supabase project is active
4. Check internet connection

### Issue: "API returns 401 Unauthorized"
**Solution:**
1. Verify JWT token is valid
2. Check Authorization header format: `Bearer TOKEN`
3. Verify token not expired
4. Check Supabase auth is configured

### Issue: "Data not saving to database"
**Solution:**
1. Check RLS policies allow insert
2. Verify user_id is correct
3. Check all required fields present
4. Look at Supabase logs

### Issue: "Frontend can't reach backend"
**Solution:**
1. Check VITE_API_URL is correct
2. Verify backend is running
3. Check CORS configuration
4. Look at browser network tab

---

**Estimated Total Time: 6-8 hours**  
**Ready to Ship After: Phase 3**  
**Nice-to-Have Before Launch: Phase 4**

Good luck! 🚀
