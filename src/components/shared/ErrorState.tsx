import React from 'react'

interface ErrorStateProps {
  title: string
  message: string
  onRetry?: () => void
}

export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  return (
    <div style={styles.container}>
      <div style={styles.icon}>⚠️</div>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.message}>{message}</p>
      {onRetry && (
        <button onClick={onRetry} style={styles.button}>
          Try Again
        </button>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '32px 24px',
    background: 'rgba(239,68,68,.08)',
    borderRadius: '12px',
    border: '1px solid rgba(239,68,68,.20)',
    textAlign: 'center'
  },
  icon: {
    fontSize: '40px',
    marginBottom: '12px'
  },
  title: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#ef4444'
  },
  message: {
    fontSize: '13px',
    color: 'rgba(255,255,255,.60)',
    marginBottom: '16px',
    maxWidth: '360px'
  },
  button: {
    padding: '8px 16px',
    borderRadius: '6px',
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer'
  }
}
