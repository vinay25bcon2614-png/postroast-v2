'use client'
import { useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { EmptyState } from '@/components/shared/EmptyState'
import '../styles/screens.css'

interface Format {
  id: string
  name: string
  category: 'client' | 'growth' | 'authority' | 'personal'
  desc: string
  whyWorks: string
  bestGoal: string
  ctaStyle: string
  rating: number
  tags: string[]
  template?: string
}

const FORMATS: Format[] = [
  {
    id: 'case_study',
    name: 'Case Study — Before/After',
    category: 'client',
    desc: 'Show a real transformation. Problem → process → measurable result.',
    whyWorks: 'Specific proof beats any claim. Readers project themselves into the story.',
    bestGoal: 'get_clients',
    ctaStyle: 'DM or book call',
    rating: 4.9,
    tags: ['High Trust', 'Get Clients', 'Authority'],
    template: 'Client came in with [PROBLEM]. We [PROCESS]. Result: [NUMBER/OUTCOME].',
  },
  {
    id: 'contrarian',
    name: 'Contrarian Take',
    category: 'growth',
    desc: 'Challenge what everyone believes. Give your unique angle.',
    whyWorks: 'Controversy drives engagement. People stop to debate you.',
    bestGoal: 'grow_audience',
    ctaStyle: 'Ask provocative question',
    rating: 4.6,
    tags: ['Viral', 'Engagement', 'Growth'],
    template: 'Everyone says [COMMON BELIEF]. But the truth is [YOUR TAKE].',
  },
  {
    id: 'story',
    name: 'Story/Vulnerability',
    category: 'personal',
    desc: 'Share a personal challenge, failure, or realization.',
    whyWorks: 'Vulnerability builds connection. People see themselves in your journey.',
    bestGoal: 'personal_brand',
    ctaStyle: 'Ask relatable question',
    rating: 4.7,
    tags: ['Connection', 'Personal', 'Authority'],
    template: 'I used to [MISTAKE]. Then [REALIZATION]. Now [RESULT].',
  },
  {
    id: 'list',
    name: 'List/Breakdown',
    category: 'growth',
    desc: 'Top 5/10 tips, mistakes, lessons. Scannable and shareable.',
    whyWorks: 'Lists are easy to digest and save. High engagement.',
    bestGoal: 'grow_audience',
    ctaStyle: 'Save this post',
    rating: 4.5,
    tags: ['Educational', 'Viral', 'Growth'],
    template: '[NUMBER] [THING] you need to know:\n1. [FIRST]\n2. [SECOND]\n...',
  },
  {
    id: 'data_driven',
    name: 'Data/Stats',
    category: 'authority',
    desc: 'Lead with surprising statistic. Back it up with insight.',
    whyWorks: 'Numbers arrest attention. Data proves authority.',
    bestGoal: 'authority',
    ctaStyle: 'Follow for insights',
    rating: 4.4,
    tags: ['Authority', 'Credibility', 'Data'],
    template: '[NUMBER]% of [GROUP] [SURPRISING FACT]. Here\'s why:',
  },
  {
    id: 'framework',
    name: 'Framework/System',
    category: 'authority',
    desc: 'Teach a proven system. Step-by-step or matrix format.',
    whyWorks: 'Frameworks give people permission and clarity to act.',
    bestGoal: 'thought_leader',
    ctaStyle: 'Save and use',
    rating: 4.8,
    tags: ['Educational', 'Authority', 'Valuable'],
    template: 'The [NAME] framework:\n[STEP 1]\n[STEP 2]\n[STEP 3]',
  },
  {
    id: 'question',
    name: 'Question/Poll',
    category: 'growth',
    desc: 'Pose an engaging question. Let audience answer in comments.',
    whyWorks: 'Engagement algorithm loves comments. Drives conversation.',
    bestGoal: 'grow_audience',
    ctaStyle: 'Reply in comments',
    rating: 4.3,
    tags: ['Engagement', 'Growth', 'Interaction'],
    template: 'Quick question:\n[YOUR Q]?\n\nI think the answer is [X].',
  },
  {
    id: 'insider_leak',
    name: 'Insider Leak',
    category: 'authority',
    desc: 'Share something the industry doesn\'t talk about publicly.',
    whyWorks: 'FOMO + insider knowledge = high engagement and reach.',
    bestGoal: 'authority',
    ctaStyle: 'Follow for more insights',
    rating: 4.6,
    tags: ['Authority', 'Viral', 'Insider'],
    template: 'Nobody talks about this, but [INSIDER INFO]...',
  },
]

const CATEGORIES = [
  { id: 'all', label: 'All formats', count: FORMATS.length },
  { id: 'client', label: 'Get Clients', count: FORMATS.filter(f => f.category === 'client').length },
  { id: 'growth', label: 'Grow Audience', count: FORMATS.filter(f => f.category === 'growth').length },
  { id: 'authority', label: 'Authority', count: FORMATS.filter(f => f.category === 'authority').length },
  { id: 'personal', label: 'Personal Brand', count: FORMATS.filter(f => f.category === 'personal').length },
]

export function FormatLibraryScreen() {
  const [category, setCategory] = useState<string>('all')
  const [selectedFormat, setSelectedFormat] = useState<Format | null>(null)
  const { user } = useUser()

  const filteredFormats = category === 'all'
    ? FORMATS
    : FORMATS.filter(f => f.category === category)

  if (!user) {
    return (
      <div className="screen">
        <EmptyState
          icon="📋"
          title="Format Library"
          description="Sign in to access proven LinkedIn post templates"
        />
      </div>
    )
  }

  return (
    <div className="format-library">
      <div className="screen-header">
        <h2>Format Library</h2>
        <p>8 proven formats that get engagement and reach</p>
      </div>

      {/* Categories */}
      <div className="category-filter">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`category-btn ${category === cat.id ? 'active' : ''}`}
            onClick={() => setCategory(cat.id)}
          >
            {cat.label}
            <span className="count-badge">{cat.count}</span>
          </button>
        ))}
      </div>

      {/* Formats Grid */}
      <div className="formats-grid">
        {filteredFormats.map(format => (
          <div
            key={format.id}
            className={`format-card ${selectedFormat?.id === format.id ? 'selected' : ''}`}
            onClick={() => setSelectedFormat(format)}
          >
            <div className="format-header">
              <h3>{format.name}</h3>
              <div className="rating">
                {'⭐'.repeat(Math.floor(format.rating))}
                <span className="rating-value">{format.rating}</span>
              </div>
            </div>
            <p className="format-desc">{format.desc}</p>
            <div className="format-meta">
              <span className="best-goal">Best for: {format.bestGoal}</span>
              <span className="cta-style">{format.ctaStyle}</span>
            </div>
            <div className="tag-list">
              {format.tags.map(tag => (
                <span key={tag} className="format-tag">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Detail View */}
      {selectedFormat && (
        <div className="format-detail">
          <div className="detail-header">
            <button className="close-btn" onClick={() => setSelectedFormat(null)}>×</button>
            <h2>{selectedFormat.name}</h2>
          </div>

          <div className="detail-content">
            <div className="detail-section">
              <h3>Why This Works</h3>
              <p>{selectedFormat.whyWorks}</p>
            </div>

            <div className="detail-section">
              <h3>Template</h3>
              <div className="template-box">
                <code>{selectedFormat.template}</code>
              </div>
              <button className="btn btn-primary">
                Copy Template
              </button>
            </div>

            <div className="detail-section">
              <h3>Best For</h3>
              <p>Goal: <strong>{selectedFormat.bestGoal}</strong></p>
              <p>CTA: <strong>{selectedFormat.ctaStyle}</strong></p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
