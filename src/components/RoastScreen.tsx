'use client'
import React, { useState } from 'react'
import { useRoast } from '../hooks/useRoast'
import { useUser } from '../hooks/useUser'
import { ErrorState, RoastLoadingSteps, UpgradeWall } from './shared'
import { GOALS } from '../lib/goals'
import type { GoalId } from '../types'
import '../components/screens.css'

type Mode = 'full-roast' | 'hook' | 'rewrite' | 'audit'

const MODES: { id: Mode; label: string }[] = [
  { id: 'full-roast', label: 'Full Roast' },
  { id: 'hook', label: 'Hook Only' },
  { id: 'rewrite', label: 'Rewrite' },
  { id: 'audit', label: 'Pre-Audit' }
]

export function RoastScreen() {
  const [postText, setPostText] = useState('')
  const [mode, setMode] = useState<Mode>('full-roast')
  const [selectedGoals, setSelectedGoals] = useState<GoalId[]>(['get_clients'])
  const { roast, loading, error } = useRoast()
  const { user, isPro, canRoast } = useUser()
  const [result, setResult] = useState<any>(null)

  const handleRoast = async () => {
    if (!user) {
      alert('Please sign in first')
      return
    }

    if (!canRoast && !isPro) {
      alert('Free plan limit reached. Upgrade to Pro for unlimited roasts.')
      return
    }

    const goals = selectedGoals.map(id => ({
      id,
      label: GOALS[id]?.label || id
    }))

    const analysis = await roast(postText, goals, [])

    if (analysis) {
      setResult(analysis)
    }
  }

  if (!user?.id) {
    return (
      <div className="screen-container">
        <ErrorState
          title="Sign in required"
          message="Please sign in to use the roast engine"
        />
      </div>
    )
  }

  if (!isPro && !canRoast) {
    return (
      <div className="screen-container">
        <UpgradeWall
          feature="Free Plan (3 roasts/day)"
          description="You've reached your daily limit. Upgrade to Pro for unlimited analysis."
          onUpgrade={() => alert('Redirect to billing')}
        />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="screen-container">
        <RoastLoadingSteps />
      </div>
    )
  }

  if (error) {
    return (
      <div className="screen-container">
        <ErrorState
          title="Analysis failed"
          message={error}
          onRetry={() => handleRoast()}
        />
      </div>
    )
  }

  return (
    <div className="screen-container">
      <div className="screen-header">
        <h2>🔥 Roast Engine</h2>
        <p>Get detailed feedback on your LinkedIn posts</p>
      </div>

      <div className="roast-container">
        <div className="roast-form">
          {/* Goal Selection */}
          <div className="form-section">
            <label>What's your goal?</label>
            <div className="goal-chips">
              {Object.entries(GOALS).map(([id, goal]) => (
                <button
                  key={id}
                  className={`chip ${selectedGoals.includes(id as GoalId) ? 'active' : ''}`}
                  onClick={() =>
                    setSelectedGoals(prev =>
                      prev.includes(id as GoalId)
                        ? prev.filter(g => g !== id)
                        : [...prev, id as GoalId]
                    )
                  }
                >
                  {goal.emoji} {goal.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Selection */}
          <div className="form-section">
            <label>Analysis type</label>
            <div className="mode-buttons">
              {MODES.map(m => (
                <button
                  key={m.id}
                  className={`mode-btn ${mode === m.id ? 'active' : ''}`}
                  onClick={() => setMode(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Post Input */}
          <div className="form-section">
            <label>Your post</label>
            <textarea
              className="roast-textarea"
              placeholder="Paste your LinkedIn post here..."
              value={postText}
              onChange={e => setPostText(e.target.value)}
              rows={6}
            />
          </div>

          <button
            className="btn-primary"
            onClick={handleRoast}
            disabled={!postText || loading}
          >
            {loading ? 'Analyzing...' : 'Get Roast'}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="roast-results">
            <div className="score-card">
              <div className="score-main">
                <span className="score-number">{result.compositeScore}</span>
                <span className="score-label">Score</span>
              </div>
            </div>

            <div className="result-content">
              <h3>Analysis</h3>
              <p className="summary">{result.summary}</p>

              {result.keyInsight && (
                <div className="insight-box">
                  <strong>Key Insight:</strong> {result.keyInsight}
                </div>
              )}

              {result.weaknesses?.length > 0 && (
                <div className="weaknesses-section">
                  <strong>Opportunities:</strong>
                  <ul>
                    {result.weaknesses.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.improvement && (
                <div className="improvement-box">
                  <strong>Suggested Fix:</strong> {result.improvement}
                </div>
              )}

              <div className="scores-grid">
                {Object.entries(result.scores || {}).map(([key, score]) => (
                  <div key={key} className="score-bar">
                    <span className="label">{key}</span>
                    <div className="bar-container">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${Math.min(score as number, 100)}%`,
                          background: (score as number) > 70 ? '#22c55e' : '#f59e0b'
                        }}
                      />
                    </div>
                    <span className="value">{Math.round(score as number)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RoastScreen
