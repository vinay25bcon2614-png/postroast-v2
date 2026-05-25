'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    desc: 'Get started with PostRoast',
    features: [
      '3 roasts per day',
      '8-dimension scoring',
      '7-day post history',
      '4 score dimensions visible',
      'Community support'
    ],
    cta: 'Current Plan',
    highlighted: false
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    desc: 'For serious content creators',
    features: [
      'Unlimited roasts',
      'All 8 dimensions',
      'Unlimited post history',
      'Style DNA matching',
      'Advanced analytics',
      'Priority support',
      'LinkedIn integration',
      'Format library (full access)'
    ],
    cta: 'Upgrade Now',
    highlighted: true
  },
  {
    name: 'Team',
    price: '$99',
    period: '/month',
    desc: 'For agencies & teams',
    features: [
      'Everything in Pro',
      'Up to 5 team members',
      'Shared workspace',
      'Content calendar',
      'Team analytics',
      'Priority support',
      'Custom branding'
    ],
    cta: 'Contact Sales',
    highlighted: false
  }
]

export function BillingScreen() {
  const { user, isPro } = useUser()
  const [roastsToday, setRoastsToday] = useState(0)
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!user) return
    loadData()
  }, [user])

  async function loadData() {
    if (!user) return
    try {
      const { data } = await supabase
        .from('usage_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', new Date().toISOString().split('T')[0])
      
      setRoastsToday(data?.length || 0)

      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      setSubscription(sub)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpgrade(plan: string) {
    if (plan === 'Free') return
    // In production, this would redirect to Paddle checkout
    alert(`Redirecting to ${plan} checkout...`)
  }

  if (loading) return <div style={{ padding: '20px' }}>Loading billing...</div>

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
      <div style={{ maxWidth: '900px', marginX: 'auto' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Billing & Plans</h2>
        <p style={{ color: '#888', marginBottom: '32px' }}>Manage your subscription and view usage.</p>

        {/* Usage card */}
        <div style={{
          background: '#111',
          border: '1px solid #333',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', marginBottom: '8px' }}>Today's Roasts</div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#FF5C00' }}>{roastsToday}</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                {isPro ? 'Unlimited' : `3 remaining`}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', marginBottom: '8px' }}>Current Plan</div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#22C55E' }}>
                {isPro ? 'Pro' : 'Free'}
              </div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                {subscription?.status || 'Active'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', marginBottom: '8px' }}>Renewal Date</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#ccc' }}>
                {subscription?.renewal_date
                  ? new Date(subscription.renewal_date).toLocaleDateString()
                  : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Choose Your Plan</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                style={{
                  background: '#111',
                  border: plan.highlighted ? '2px solid #FF5C00' : '1px solid #333',
                  borderRadius: '12px',
                  padding: '24px',
                  position: 'relative'
                }}
              >
                {plan.highlighted && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '20px',
                    background: '#FF5C00',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600
                  }}>
                    MOST POPULAR
                  </div>
                )}

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>{plan.name}</div>
                  <div style={{ color: '#888', fontSize: '13px' }}>{plan.desc}</div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '32px', fontWeight: 700 }}>
                    {plan.price}
                    {plan.period && (
                      <span style={{ fontSize: '16px', color: '#888' }}>{plan.period}</span>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  {plan.features.map((feature, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '10px', fontSize: '14px' }}>
                      <span style={{ color: '#22C55E' }}>✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleUpgrade(plan.name)}
                  disabled={plan.name === 'Free' && !isPro}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: plan.name === 'Free' && isPro ? '#666' : '#FF5C00',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: 600,
                    cursor: plan.name === 'Free' && isPro ? 'not-allowed' : 'pointer',
                    opacity: plan.name === 'Free' && isPro ? 0.7 : 1
                  }}
                >
                  {isPro && plan.name === 'Pro' ? 'Current Plan' : plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Billing history */}
        <div style={{
          background: '#111',
          border: '1px solid #333',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '32px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Billing History</h3>
          {subscription ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', fontSize: '13px' }}>
              <div>
                <div style={{ color: '#888', marginBottom: '4px' }}>Invoice</div>
                <div>#INV-{subscription.id.slice(0, 8).toUpperCase()}</div>
              </div>
              <div>
                <div style={{ color: '#888', marginBottom: '4px' }}>Amount</div>
                <div>${subscription.amount_paid}</div>
              </div>
              <div>
                <div style={{ color: '#888', marginBottom: '4px' }}>Date</div>
                <div>{new Date(subscription.created_at).toLocaleDateString()}</div>
              </div>
              <button
                style={{
                  background: 'transparent',
                  border: '1px solid #444',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  color: '#ccc',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Download
              </button>
            </div>
          ) : (
            <div style={{ color: '#888' }}>No billing history yet. Upgrade to see invoices.</div>
          )}
        </div>
      </div>
    </div>
  )
}
