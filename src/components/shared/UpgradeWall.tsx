import React from 'react'

interface UpgradeWallProps {
  feature: string
  description?: string
  onUpgrade?: () => void
}

export function UpgradeWall({ feature, description, onUpgrade }: UpgradeWallProps) {
  return (
    <div style={styles.container}>
      <div style={styles.icon}>🔒</div>
      <h3 style={styles.title}>{feature} is a Pro feature</h3>
      {description && <p style={styles.description}>{description}</p>}
      <p style={styles.subtext}>Upgrade to PostRoast Pro to unlock unlimited roasts and advanced features.</p>
      <button onClick={onUpgrade} style={styles.button}>
        Upgrade to Pro
      </button>
      <p style={styles.pricing}>$9/month or $90/year</p>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    background: 'linear-gradient(135deg, rgba(168,85,247,.10), rgba(255,92,0,.08))',
    borderRadius: '12px',
    border: '1px solid rgba(168,85,247,.15)',
    textAlign: 'center',
    minHeight: '300px'
  },
  icon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  title: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '8px',
    color: 'rgba(255,255,255,.93)'
  },
  description: {
    fontSize: '14px',
    color: 'rgba(255,255,255,.70)',
    marginBottom: '12px'
  },
  subtext: {
    fontSize: '13px',
    color: 'rgba(255,255,255,.50)',
    marginBottom: '24px',
    maxWidth: '320px'
  },
  button: {
    padding: '10px 24px',
    borderRadius: '6px',
    background: 'linear-gradient(135deg, #FF5C00, #ff7530)',
    color: '#fff',
    border: 'none',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '12px'
  },
  pricing: {
    fontSize: '12px',
    color: 'rgba(255,255,255,.40)'
  }
}
