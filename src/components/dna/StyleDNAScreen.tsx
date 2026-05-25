'use client'
import { useState } from 'react'
import { useStyleDNA } from '@/hooks/useStyleDNA'
import { useUser } from '@/hooks/useUser'
import { EmptyState } from '@/components/shared/EmptyState'
import { CardSkeleton } from '@/components/shared/LoadingSkeleton'
import { createClient } from '@/lib/supabase/client'

const VOICE_SLIDERS = [
  { key: 'directness',   label: 'Direct',      sub: 'vs Storytelling' },
  { key: 'analytical',   label: 'Data-driven',  sub: 'vs Emotional'    },
  { key: 'contrarian',   label: 'Contrarian',   sub: 'vs Agreeable'    },
  { key: 'professional', label: 'Professional', sub: 'vs Casual'       },
  { key: 'energy',       label: 'High energy',  sub: 'vs Minimalist'   },
]

const DNA_LEVELS = [
  { min: 0,  max: 4,  label: 'Not started',   desc: 'Roast 5 posts to unlock voice detection',          color: 'rgba(255,255,255,.3)' },
  { min: 5,  max: 9,  label: 'Partial DNA',   desc: 'Voice patterns emerging. 10 posts for full DNA.',  color: '#f59e0b'              },
  { min: 10, max: 19, label: 'Full DNA',       desc: 'Rewrites now sound like you.',                     color: '#22c55e'              },
  { min: 20, max: 999,label: 'Advanced DNA',   desc: 'Micro-patterns detected. Deep voice match.',       color: '#a855f7'              },
]

function getDNALevel(count: number) {
  return DNA_LEVELS.find(l => count >= l.min && count <= l.max) || DNA_LEVELS[0]
}

export function StyleDNAScreen() {
  const { dna, loading, analysing, reanalyse, dnaLevel } = useStyleDNA()
  const { user, isPro } = useUser()
  const [sliders, setSliders] = useState<Record<string, number>>({})
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const postsAnalysed = dna?.posts_analysed || 0
  const level = getDNALevel(postsAnalysed)
  const targetPosts = postsAnalysed < 5 ? 5 : postsAnalysed < 10 ? 10 : 20
  const progress = Math.min(postsAnalysed / targetPosts, 1)

  const getSliderValue = (key: string) =>
    sliders[key] ?? dna?.[key as keyof typeof dna] ?? 50

  const handleSliderChange = async (key: string, value: number) => {
    if (!user) return
    setSliders(s => ({ ...s, [key]: value }))
    setSaving(true)
    try {
      await supabase
        .from('style_dna')
        .update({ [key]: value })
        .eq('user_id', user.id)
    } catch (err) {
      console.error('Failed to save:', err)
    }
    setSaving(false)
  }

  if (loading) return (
    <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {[1,2,3,4,5].map(i => <CardSkeleton key={i} />)}
    </div>
  )

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {/* Progress Section */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--b-1)' }}>
        <h3 style={{ fontSize: 'var(--t-sm)', fontWeight: 600, marginBottom: 8, color: 'var(--tx-1)' }}>
          Voice DNA Detection
        </h3>
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 'var(--t-xs)', color: 'var(--tx-3)' }}>
              {postsAnalysed} / {targetPosts} posts
            </span>
            <span style={{ fontSize: 'var(--t-xs)', fontWeight: 500, color: level.color }}>
              {level.label}
            </span>
          </div>
          <div style={{ height: 4, background: 'var(--bg-4)', borderRadius: 'var(--r-full)', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${progress * 100}%`,
                background: `linear-gradient(90deg, ${level.color} 0%, ${level.color}dd 100%)`,
                transition: 'width 300ms var(--ease)'
              }}
            />
          </div>
        </div>
        <p style={{ fontSize: 'var(--t-xs)', color: 'var(--tx-3)', margin: 0 }}>{level.desc}</p>
      </div>

      {/* Analysis Button */}
      {postsAnalysed >= 5 && (
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--b-1)' }}>
          <button
            onClick={reanalyse}
            disabled={analysing}
            style={{
              width: '100%',
              padding: '10px 16px',
              background: analysing ? 'var(--bg-4)' : 'var(--acc-m)',
              color: analysing ? 'var(--tx-3)' : 'var(--acc)',
              border: `1px solid ${analysing ? 'var(--b-1)' : 'var(--acc-b)'}`,
              borderRadius: 'var(--r-md)',
              fontSize: 'var(--t-sm)',
              fontWeight: 500,
              cursor: analysing ? 'not-allowed' : 'pointer',
              transition: 'all var(--dur-fast)',
              opacity: analysing ? 0.6 : 1,
            }}
          >
            {analysing ? '🔄 Analysing...' : '🎯 Re-analyse'}
          </button>
        </div>
      )}

      {/* Voice Sliders */}
      {postsAnalysed > 0 && (
        <div style={{ padding: '16px', borderBottom: '1px solid var(--b-1)' }}>
          <h3 style={{ fontSize: 'var(--t-sm)', fontWeight: 600, marginBottom: 12, color: 'var(--tx-1)' }}>
            Your Voice Profile
          </h3>
          {VOICE_SLIDERS.map(slider => (
            <div key={slider.key} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 'var(--t-xs)', fontWeight: 500, color: 'var(--tx-1)' }}>
                    {slider.label}
                  </div>
                  <div style={{ fontSize: 'var(--t-2xs)', color: 'var(--tx-4)' }}>
                    {slider.sub}
                  </div>
                </div>
                <div style={{ fontSize: 'var(--t-sm)', fontWeight: 600, color: 'var(--acc)', minWidth: 30, textAlign: 'right' }}>
                  {getSliderValue(slider.key)}
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={getSliderValue(slider.key)}
                onChange={(e) => handleSliderChange(slider.key, parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: 4,
                  borderRadius: 'var(--r-full)',
                  background: `linear-gradient(90deg, var(--bg-4) 0%, var(--acc) ${getSliderValue(slider.key)}%, var(--bg-4) ${getSliderValue(slider.key)}%, var(--bg-4) 100%)`,
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Sample Sentence */}
      {dna?.sample_sentence && (
        <div style={{ padding: '16px', borderBottom: '1px solid var(--b-1)' }}>
          <h3 style={{ fontSize: 'var(--t-sm)', fontWeight: 600, marginBottom: 8, color: 'var(--tx-1)' }}>
            Detected Writing Pattern
          </h3>
          <div style={{
            padding: 12,
            background: 'var(--bg-4)',
            borderRadius: 'var(--r-md)',
            fontSize: 'var(--t-sm)',
            color: 'var(--tx-2)',
            fontStyle: 'italic',
            lineHeight: 1.6,
          }}>
            "{dna.sample_sentence}"
          </div>
          <div style={{ marginTop: 8, fontSize: 'var(--t-xs)', color: 'var(--tx-4)' }}>
            Confidence: {Math.round((dna.confidence || 0) * 100)}%
          </div>
        </div>
      )}

      {/* Empty State */}
      {postsAnalysed === 0 && (
        <div style={{ padding: '32px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🧬</div>
          <h3 style={{ fontSize: 'var(--t-base)', fontWeight: 600, marginBottom: 6, color: 'var(--tx-1)' }}>
            No Voice DNA Yet
          </h3>
          <p style={{ fontSize: 'var(--t-sm)', color: 'var(--tx-3)', marginBottom: 12 }}>
            Roast 5 of your posts to unlock AI voice detection
          </p>
          <button
            onClick={() => window.location.href = '/roast'}
            style={{
              padding: '8px 16px',
              background: 'var(--acc-m)',
              color: 'var(--acc)',
              border: '1px solid var(--acc-b)',
              borderRadius: 'var(--r-md)',
              fontSize: 'var(--t-sm)',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Start Roasting →
          </button>
        </div>
      )}
    </div>
  )
}
