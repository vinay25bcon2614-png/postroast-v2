# PostRoast Backend + Frontend Integration

> Full-stack implementation of PostRoast with Express backend, Supabase database, Claude AI scoring, and React + TypeScript frontend

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     PostRoast Stack                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Frontend (React + TypeScript)                             │
│  ├── App.jsx (React Router)                                │
│  ├── Dashboard.tsx (Main UI)                               │
│  ├── AuthContext.jsx (Auth state)                          │
│  └── lib/backend.js (API client)                           │
│                                                             │
│  ↕ (HTTP + Bearer Token)                                  │
│                                                             │
│  Backend (Express + Node.js)                               │
│  ├── server/index.js (Routes + middleware)                │
│  ├── routes/ (7 API endpoints)                            │
│  ├── lib/supabase.js (DB client)                          │
│  └── lib/prompts.js (Claude prompts)                      │
│                                                             │
│  ↕ (REST API)                                             │
│                                                             │
│  Supabase (Database + Auth)                                │
│  ├── users (auth)                                          │
│  ├── roasts (post scores & analysis)                      │
│  ├── user_goals (goal preferences)                        │
│  ├── user_creator_preferences (creator mix)               │
│  ├── style_dna (voice fingerprinting)                     │
│  └── streaks (daily posting streaks)                      │
│                                                             │
│  ↕ (REST API)                                             │
│                                                             │
│  Claude API (Anthropic)                                    │
│  ├── POST /api/roast → claudeScore()                      │
│  ├── POST /api/rewrite → claudeRewrite()                  │
│  ├── POST /api/hooks → claudeHooks()                      │
│  └── POST /api/cta → claudeCTA()                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Supabase account with API keys
- Anthropic API key for Claude

### Setup

1. **Navigate to project**
   ```bash
   cd e:\postroast-v2\my-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment (.env)**
   ```env
   # Supabase
   VITE_SUPABASE_URL=https://...supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_URL=https://...supabase.co
   SUPABASE_ANON_KEY=eyJ...
   
   # Claude API
   ANTHROPIC_API_KEY=sk-ant-...
   
   # Backend
   VITE_API_URL=http://localhost:3001
   PORT=3001
   ```

4. **Start development**
   ```bash
   npm run dev:all
   ```

5. **Open in browser**
   - Frontend: http://localhost:5175
   - Backend: http://localhost:3001

## 📚 API Endpoints

### Authentication
- **POST /auth/signup** - Create new account
- **POST /auth/login** - Login with email/password
- **POST /auth/logout** - Logout

### Roasting Endpoints
- **POST /api/roast** - Score post across 8 dimensions
- **POST /api/rewrite** - Generate improved version
- **POST /api/hooks** - Generate 5 hook variations
- **POST /api/cta** - Generate goal-optimized CTAs
- **POST /api/audit** - Quality check before posting

### Analytics
- **GET /api/analytics** - User statistics & trends
- **GET /api/dna** - Voice fingerprinting analysis
- **GET /api/leaderboard** - User rankings

## 🛠 Project Structure

```
my-app/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx (Main interface)
│   │   ├── ComposerCard.tsx (Input component)
│   │   ├── ScoreCard.tsx (Display results)
│   │   ├── auth/
│   │   │   ├── LoginScreen.jsx
│   │   │   └── SignupScreen.jsx
│   │   └── ...
│   ├── contexts/
│   │   └── AuthContext.jsx (Auth state management)
│   ├── lib/
│   │   ├── backend.js (API client)
│   │   ├── userdata.ts (Supabase queries)
│   │   └── ...
│   ├── styles/
│   │   ├── design-system.css (Design tokens)
│   │   ├── auth.css
│   │   └── ...
│   ├── App.jsx (React Router setup)
│   └── main.jsx
│
├── server/
│   ├── index.js (Express server)
│   ├── lib/
│   │   ├── supabase.js (DB client)
│   │   ├── prompts.js (Claude prompts)
│   │   └── auth.js (JWT helpers)
│   └── routes/
│       ├── roast.js
│       ├── rewrite.js
│       ├── hooks.js
│       ├── cta.js
│       ├── audit.js
│       ├── dna.js
│       └── analytics.js
│
├── package.json
├── vite.config.js
├── tsconfig.json
└── .env
```

## 🔌 API Client Usage

```javascript
import { 
  getRoast, 
  getHooks, 
  getCTAs, 
  getAnalytics,
  auditPost,
  getStyleDNA 
} from '@/lib/backend';

// Score a post
const roast = await getRoast(
  "My LinkedIn draft here...",
  [{ id: "get_clients" }],
  [{ key: "expert", weight: 1.0 }]
);

// Get hooks
const hooks = await getHooks(
  "AI productivity",
  "entrepreneurs", 
  [{ id: "growth" }],
  []
);

// Get analytics
const stats = await getAnalytics();
console.log(stats.avgScore, stats.postsCount);
```

## 🔐 Authentication Flow

```
User → Frontend (React) → Supabase Auth
                ↓ (JWT Token)
         Backend (Express) → Gets user from token
                ↓ (Bearer Token in header)
         API queries with user_id
```

### Token Lifecycle
1. User signs up via Supabase Auth
2. JWT token stored in localStorage
3. Token sent in Authorization header: `Bearer <token>`
4. Backend decodes token to extract user_id
5. All DB queries filtered by user_id
6. Token persists across page refreshes

## 🎯 Testing

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for detailed testing procedures.

Quick test:
```bash
# Start dev servers
npm run dev:all

# In another terminal, test roast endpoint
curl -X POST http://localhost:3001/api/roast \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "postText": "My post here",
    "goals": [{"id": "get_clients"}],
    "creatorMix": []
  }'
```

## 📊 Database Schema

### users (Supabase Auth)
- id, email, name, created_at

### roasts
- id, user_id, content, scores (JSON), insights, format, created_at

### user_goals
- id, user_id, goal_id, priority, weight

### user_creator_preferences  
- id, user_id, creator_id, weight, position

### style_dna
- id, user_id, post_count, voice_traits, tone, patterns, maturity_level

### streaks
- id, user_id, current_streak, longest_streak, last_post_date

## 🚨 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Invalid token | Log out and back in |
| Cannot POST /api/roast | Route not registered | Check server/index.js |
| CORS error | Frontend URL not allowed | Update cors() middleware |
| Claude API Error | Invalid key or rate limit | Check ANTHROPIC_API_KEY |
| Port already in use | Process using 3001/5175 | Kill process or change port |

## 🎨 Design System

CSS variables defined in `src/styles/design-system.css`:
```css
--bg: #0c0c0e         /* Background */
--acc: #FF5C00        /* Accent (orange) */
--tx: #ffffff         /* Text primary */
--t2: #b0b0b0         /* Text secondary */
--b1: #1a1a1e         /* Border */
--r10: 10px           /* Border radius */
--r20: 20px           /* Border radius */
```

## 📈 Performance

- Frontend build: 58.21 KB CSS + 486 KB JS
- Backend startup: ~500ms
- First page load: ~1-2s
- API response time: ~3-5s (includes Claude)

## 🔄 Development Workflow

1. **Frontend changes**
   ```bash
   npm run dev  # Vite hot reload
   ```

2. **Backend changes**
   ```bash
   npm run server  # Requires manual restart (nodemon can be added)
   ```

3. **Both together**
   ```bash
   npm run dev:all  # Uses concurrently
   ```

## 📝 Environment Variables

**Frontend (.env):**
```env
VITE_SUPABASE_URL=https://...supabase.co
VITE_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGc...
VITE_API_URL=http://localhost:3001
```

**Backend (.env):**
```env
SUPABASE_URL=https://...supabase.co
SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGc...
ANTHROPIC_API_KEY=sk-ant-v1-...
PORT=3001
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes in frontend/backend
3. Test thoroughly (see TESTING_GUIDE.md)
4. Submit PR

## 📄 License

Proprietary - PostRoast

---

**Documentation Last Updated:** May 15, 2026  
**Backend Status:** ✅ Production Ready  
**Frontend Status:** ✅ Component Library Complete  
**Integration Status:** 🟡 In Progress
