'use client'
import { useState, useCallback } from 'react'
import { useRoast } from '@/hooks/useRoast'
import { useUser } from '@/hooks/useUser'
import { UpgradeWall } from '@/components/shared/UpgradeWall'
import { RoastLoadingSteps } from '@/components/shared/LoadingSkeleton'
import '../styles/screens.css'

type Mode = 'full-roast' | 'hook-only' | 'rewrite-only' | 'cta-only' | 'viral' | 'authority'
type RightTab = 'rewrite' | 'templates' | 'versions'

const MODES: { id: Mode; label: string; pro?: boolean; desc: string }[] = [
  { id: 'full-roast', label: 'Full Roast', desc: 'All 8 dimensions + feedback' },
  { id: 'hook-only', label: 'Hook Only', desc: '5 variations to test' },
  { id: 'rewrite-only', label: 'Rewrite', desc: 'Full AI rewrite' },
  { id: 'cta-only', label: 'CTA Only', desc: 'Goal-specific calls-to-action' },
  { id: 'viral', label: 'Viral Mode', pro: true, desc: 'Optimize for reach' },
  { id: 'authority', label: 'Authority', pro: true, desc: 'Position as expert' },
]

const DIMENSIONS = [
  { key: 'hook', label: 'Hook', color: '#FF5C00' },
  { key: 'clarity', label: 'Clarity', color: '#22c55e' },
  { key: 'credibility', label: 'Credibility', color: '#3b82f6' },
  { key: 'emotion', label: 'Emotion', color: '#a855f7' },
  { key: 'cta', label: 'CTA', color: '#f59e0b' },
  { key: 'structure', label: 'Structure', color: '#ec4899' },
  { key: 'originality', label: 'Originality', color: '#14b8a6' },
  { key: 'goalAlignment', label: 'Goal Fit', color: '#06b6d4' },
]

interface ScoreResult {
  compositeScore: number
  scores: Record<string, number>
  format: string
  primaryStrength: string
  primaryWeakness: string
  improvements: string[]
  feedback: Record<string, string>
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'
  const percentage = Math.min(100, Math.max(0, score))

  return (
    <div className="score-row">
      <div className="score-label">{label}</div>
      <div className="score-track">
        <div
          className="score-fill"
          style={{
            width: `${percentage}%`,
            background: color,
          }}
        />
      </div>
      <div className="score-val">{Math.round(score)}</div>
    </div>
  )
}

export function RoastScreen() {
  const [postText, setPostText] = useState('')
  const [mode, setMode] = useState<Mode>('full-roast')
  const [rightTab, setRightTab] = useState<RightTab>('rewrite')
  const { loading, error, result, roastId, runRoast } = useRoast()
  const { user, isPro, canRoast } = useUser()
  const [showUpgrade, setShowUpgrade] = useState(false)

  const handleRoast = useCallback(async () => {
    if (!user) {
      alert('Please sign in first')
      return
    }

    if (!canRoast && !isPro) {
      setShowUpgrade(true)
      return
    }

    await runRoast(postText, mode)
  }, [user, canRoast, isPro, postText, mode, runRoast])

  const isProMode = mode === 'viral' || mode === 'authority'
  const canUseMode = !isProMode || isPro

  if (!user) {
    return (
      <div className="screen">
        <div className="screen-header">
          <h2>Roast Engine</h2>
          <p>Sign in to analyze your posts</p>
        </div>
      </div>
    )
  }

  return (
    <div className="roast-container">
      {/* Left Panel - Input */}
      <div className="roast-left">
        <div className="screen-header">
          <h2>Roast Engine</h2>
          <p>Paste your LinkedIn post and get instant 8D analysis</p>
        </div>

        {/* Mode Selector */}
        <div className="mode-selector">
          {MODES.map(m => (
            <button
              key={m.id}
              className={`mode-btn ${mode === m.id ? 'active' : ''} ${m.pro && !isPro ? 'disabled' : ''}`}
              onClick={() => canUseMode && setMode(m.id)}
              title={m.pro && !isPro ? 'Upgrade to Pro' : m.desc}
              disabled={m.pro && !isPro}
            >
              {m.label}
              {m.pro && <span className="pro-badge">Pro</span>}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="input-section">
          <label className="input-label">Your post</label>
          <textarea
            className="post-input"
            placeholder="Paste your LinkedIn post here (max 2000 words)..."
            value={postText}
            onChange={e => setPostText(e.target.value.substring(0, 2000))}
            maxLength={2000}
            rows={8}
          />
          <div className="input-footer">
            <span className="char-count">{postText.length}/2000</span>
            <button
              className="btn btn-primary"
              onClick={handleRoast}
              disabled={!postText.trim() || loading}
            >
              {loading ? 'Analyzing...' : 'Roast Now'}
            </button>
          </div>
        </div>

        {error && <div className="error-alert">{error}</div>}
      </div>

      {/* Right Panel - Results */}
      <div className="roast-right">
        {loading ? (
          <RoastLoadingSteps />
        ) : result ? (
          <div className="results-panel">
            {/* Composite Score */}
            <div className="composite-score">
              <div className="score-circle">
                <div className="score-number">{Math.round(result.compositeScore)}</div>
                <div className="score-label-small">Score</div>
              </div>
              <div className="score-details">
                <div className="detail-item">
                  <span className="detail-label">Format</span>
                  <span className="detail-value">{result.format}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Strength</span>
                  <span className="detail-value">{result.primaryStrength}</span>
                </div>
              </div>
            </div>

            {/* Dimension Scores */}
            <div className="dimensions-section">
              <h3>Dimension Breakdown</h3>
              <div className="dimensions-grid">
                {DIMENSIONS.map(dim => (
                  <ScoreBar
                    key={dim.key}
                    label={dim.label}
                    score={result.scores[dim.key] || 0}
                  />
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="tabs-section">
              <div className="tab-buttons">
                <button
                  className={`tab-btn ${rightTab === 'rewrite' ? 'active' : ''}`}
                  onClick={() => setRightTab('rewrite')}
                >
                  Rewrite
                </button>
                <button
                  className={`tab-btn ${rightTab === 'templates' ? 'active' : ''}`}
                  onClick={() => setRightTab('templates')}
                >
                  Templates
                </button>
                <button
                  className={`tab-btn ${rightTab === 'versions' ? 'active' : ''}`}
                  onClick={() => setRightTab('versions')}
                >
                  Versions
                </button>
              </div>

              {/* Tab Content */}
              {rightTab === 'rewrite' && (
                <div className="tab-content">
                  <h4>AI Rewrite</h4>
                  <p className="rewrite-text">{result.improvements?.[0] || 'Generating rewrite...'}</p>
                  <button className="btn btn-ghost btn-sm">Copy</button>
                </div>
              )}

              {rightTab === 'templates' && (
                <div className="tab-content">
                  <h4>Format Templates</h4>
                  <p>Use these proven templates for {result.format}</p>
                  <ul className="template-list">
                    {result.improvements?.map((imp, i) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {rightTab === 'versions' && (
                <div className="tab-content">
                  <h4>Improvement Ideas</h4>
                  <div className="versions-list">
                    {result.improvements?.map((imp, i) => (
                      <div key={i} className="version-item">
                        <span className="version-number">{i + 1}</span>
                        <span>{imp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Weakness */}
            {result.primaryWeakness && (
              <div className="weakness-alert">
                <span className="alert-icon">⚠️</span>
                <div>
                  <div className="alert-title">Main Issue</div>
                  <div className="alert-text">{result.primaryWeakness}</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-results">
            <div className="empty-icon">🔥</div>
            <div className="empty-title">Ready to roast</div>
            <div className="empty-text">Paste a post to get instant feedback on all 8 dimensions</div>
          </div>
        )}
      </div>

      {showUpgrade && (
        <UpgradeWall
          trigger="roasts"
          onClose={() => setShowUpgrade(false)}
        />
      )}
    </div>
  )
}
