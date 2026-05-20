import React from 'react'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  illustrationUrl?: string
}

export function EmptyState({
  icon = '📭',
  title,
  description,
  action,
  illustrationUrl
}: EmptyStateProps) {
  return (
    <div style={styles.container}>
      {illustrationUrl ? (
        <img src={illustrationUrl} alt="" style={styles.illustration} />
      ) : (
        <div style={styles.icon}>{icon}</div>
      )}
      <h3 style={styles.title}>{title}</h3>
      {description && <p style={styles.description}>{description}</p>}
      {action && (
        <button onClick={action.onClick} style={styles.button}>
          {action.label}
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
    justifyContent: 'center',
    padding: '48px 24px',
    textAlign: 'center',
    minHeight: '320px'
  },
  icon: {
    fontSize: '56px',
    marginBottom: '16px'
  },
  illustration: {
    width: '200px',
    height: '200px',
    marginBottom: '16px',
    objectFit: 'cover'
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '8px',
    color: 'rgba(255,255,255,.93)'
  },
  description: {
    fontSize: '14px',
    color: 'rgba(255,255,255,.50)',
    marginBottom: '24px',
    maxWidth: '400px'
  },
  button: {
    padding: '8px 16px',
    borderRadius: '6px',
    background: '#FF5C00',
    color: '#fff',
    border: 'none',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  }
}
