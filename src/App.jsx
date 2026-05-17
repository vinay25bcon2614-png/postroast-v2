import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import './App.css'
import './styles/globals.css'
import './components/onboarding/onboarding.css'
import './components/screens.css'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { StepGoals } from './components/onboarding/StepGoals'
import { StepCreators } from './components/onboarding/StepCreators'
import { StepVoice } from './components/onboarding/StepVoice'
import { StepFirstRoast } from './components/onboarding/StepFirstRoast'
import { OnboardingPage } from './components/onboarding/OnboardingPage'
import Dashboard from './components/Dashboard'
import RoastScreen from './components/RoastScreen'
import AnalyticsScreen from './components/AnalyticsScreen'
import LeaderboardScreen from './components/LeaderboardScreen'
import HookBuilderScreen from './components/HookBuilderScreen'
import CTABuilderScreen from './components/CTABuilderScreen'
import PrePostAuditScreen from './components/PrePostAuditScreen'
import SettingsScreen from './components/SettingsScreen'
import StyleDNAScreen from './components/StyleDNAScreen'
import FormatLibraryScreen from './components/FormatLibraryScreen'
import GoalTrackerScreen from './components/GoalTrackerScreen'
import PostHistoryScreen from './components/PostHistoryScreen'
import LoginScreen from './components/auth/LoginScreen'
import SignupScreen from './components/auth/SignupScreen'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="loading">Loading...</div>
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function MainLayout({ children }) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Roast', path: '/roast', icon: '🔥' },
    { label: 'Hook Builder', path: '/hooks', icon: '🎣' },
    { label: 'CTA Builder', path: '/cta', icon: '📢' },
    { label: 'Audit', path: '/audit', icon: '✅' },
    { label: 'Analytics', path: '/analytics', icon: '📈' },
    { label: 'Leaderboard', path: '/leaderboard', icon: '🏆' },
    { label: 'Goal Tracker', path: '/goals', icon: '🎯' },
    { label: 'Post History', path: '/history', icon: '📜' },
    { label: 'Formats', path: '/formats', icon: '📋' },
    { label: 'Style DNA', path: '/style-dna', icon: '🧬' },
    { label: 'Settings', path: '/settings', icon: '⚙️' },
  ]

  return (
    <div className="app-layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h1>PostRoast</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="toggle-btn">
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="nav-item"
            >
              <span className="icon">{item.icon}</span>
              {sidebarOpen && <span className="label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginScreen /> : <Navigate to="/dashboard" replace />} />
      <Route path="/signup" element={!user ? <SignupScreen /> : <Navigate to="/onboarding" replace />} />
      
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/roast"
        element={
          <ProtectedRoute>
            <MainLayout>
              <RoastScreen />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/hooks"
        element={
          <ProtectedRoute>
            <MainLayout>
              <HookBuilderScreen />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/cta"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CTABuilderScreen />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/audit"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PrePostAuditScreen />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AnalyticsScreen />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <LeaderboardScreen />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/goals"
        element={
          <ProtectedRoute>
            <MainLayout>
              <GoalTrackerScreen />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PostHistoryScreen />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/formats"
        element={
          <ProtectedRoute>
            <MainLayout>
              <FormatLibraryScreen />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/style-dna"
        element={
          <ProtectedRoute>
            <MainLayout>
              <StyleDNAScreen />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SettingsScreen />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}
