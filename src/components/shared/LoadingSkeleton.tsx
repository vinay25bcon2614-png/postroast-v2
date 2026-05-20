import React from 'react'

export function LoadingSkeleton() {
  return (
    <div style={styles.skeleton}>
      <div style={styles.skeletonBar} />
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div style={styles.card}>
      <div style={styles.skeletonBar} />
      <div style={styles.skeletonBar} />
      <div style={{ ...styles.skeletonBar, width: '60%' }} />
    </div>
  )
}

export function KPISkeleton() {
  return (
    <div style={styles.kpiCard}>
      <div style={{ ...styles.skeletonBar, height: '32px', marginBottom: '12px' }} />
      <div style={styles.skeletonBar} />
    </div>
  )
}

export function RoastLoadingSteps() {
  return (
    <div style={styles.loadingContainer}>
      <div style={styles.step}>
        <div style={styles.stepNumber}>1</div>
        <div>Analyzing structure...</div>
      </div>
      <div style={styles.step}>
        <div style={styles.stepNumber}>2</div>
        <div>Scoring dimensions...</div>
      </div>
      <div style={styles.step}>
        <div style={styles.stepNumber}>3</div>
        <div>Generating insights...</div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  skeleton: {
    padding: '16px',
    background: 'rgba(255,255,255,.03)',
    borderRadius: '8px',
    marginBottom: '12px'
  },
  skeletonBar: {
    height: '16px',
    background: 'linear-gradient(90deg, rgba(255,255,255,.05), rgba(255,255,255,.10), rgba(255,255,255,.05))',
    borderRadius: '4px',
    marginBottom: '8px',
    animation: 'pulse 1.5s infinite'
  },
  card: {
    padding: '16px',
    background: 'rgba(17,17,20,1)',
    border: '1px solid rgba(255,255,255,.055)',
    borderRadius: '12px',
    marginBottom: '12px'
  },
  kpiCard: {
    padding: '16px',
    background: 'rgba(17,17,20,1)',
    borderRadius: '12px'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '32px 24px'
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  stepNumber: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#FF5C00',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600'
  }
}
