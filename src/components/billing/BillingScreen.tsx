'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'

interface SubscriptionData {
  plan: 'free' | 'pro' | 'team'
  status: 'active' | 'cancelled' | 'past_due'
  currentPeriodEnd?: string
  cancelAtPeriodEnd: boolean
  roastsToday: number
  roastLimit: number
}

export function BillingScreen() {
  const { user, isPro } = useUser()
  const [subscription, setSubscription] = useState<SubscriptionData>({
    plan: 'free',
    status: 'active',
    cancelAtPeriodEnd: false,
    roastsToday: 0,
    roastLimit: 3,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!user) return
    loadSubscription()
  }, [user])

  async function loadSubscription() {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (data) {
        setSubscription({
          plan: data.plan || 'free',
          status: data.status || 'active',
          currentPeriodEnd: data.current_period_end,
          cancelAtPeriodEnd: data.cancel_at_period_end || false,
          roastsToday: data.roasts_today || 0,
          roastLimit: data.plan === 'pro' ? 100 : data.plan === 'team' ? 500 : 3,
        })
      }
    } catch (err) {
      console.error('Error loading subscription:', err)
    }
    setLoading(false)
  }

  const PLANS = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        '3 roasts/day',
        '8-dimension scoring',
        '1 creator',
        '7-day history',
        'Email support',
      ],
      limits: ['No Style DNA', 'No Leaderboard', 'No Integrations'],
      cta: 'Current Plan',
      highlight: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$29',
      period: '/month',
      features: [
        '100 roasts/day',
        'All 8-D scoring',
        'All 9 creators',
        '365-day history',
        'Style DNA detection',
        'Leaderboard access',
        'LinkedIn integration',
        'Priority support',
      ],
      limits: [],
      cta: isPro ? 'Current Plan' : 'Upgrade Now',
      highlight: true,
    },
    {
      id: 'team',
      name: 'Team',
      price: '$99',
      period: '/month',
      features: [
        '500 roasts/month',
        'All Pro features',
        'Team analytics',
        'Admin dashboard',
        'SSO + SAML',
        'Dedicated support',
        'Custom integrations',
      ],
      limits: [],
      cta: 'Contact Sales',
      highlight: false,
    },
  ]

  if (loading) {
    return (
      <div style={{ padding: '32px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: 'var(--t-base)', color: 'var(--tx-3)' }}>
          Loading billing...
        </div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        
        {/* Current Plan */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 'var(--t-lg)', fontWeight: 700, color: 'var(--tx-1)', marginBottom: 16 }}>
            Billing & Subscription
          </h2>

          <div style={{
            background: 'var(--bg-3)',
            border: '1px solid var(--b-1)',
            borderRadius: 'var(--r-lg)',
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 16,
            marginBottom: 32,
          }}>
            <div>
              <div style={{ fontSize: 'var(--t-2xs)', color: 'var(--tx-4)', textTransform: 'uppercase', marginBottom: 4 }}>
                Current Plan
              </div>
              <div style={{ fontSize: 'var(--t-xl)', fontWeight: 700, color: 'var(--acc)', textTransform: 'capitalize' }}>
                {subscription.plan}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 'var(--t-2xs)', color: 'var(--tx-4)', textTransform: 'uppercase', marginBottom: 4 }}>
                Roasts Today
              </div>
              <div style={{ fontSize: 'var(--t-xl)', fontWeight: 700, color: '#22c55e' }}>
                {subscription.roastsToday} / {subscription.roastLimit}
              </div>
            </div>

            {subscription.currentPeriodEnd && (
              <div>
                <div style={{ fontSize: 'var(--t-2xs)', color: 'var(--tx-4)', textTransform: 'uppercase', marginBottom: 4 }}>
                  Renews On
                </div>
                <div style={{ fontSize: 'var(--t-base)', fontWeight: 600, color: 'var(--tx-1)' }}>
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Plans */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 'var(--t-base)', fontWeight: 600, color: 'var(--tx-1)', marginBottom: 16 }}>
            Plans
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {PLANS.map(plan => (
              <div
                key={plan.id}
                style={{
                  background: plan.highlight ? 'var(--acc-m)' : 'var(--bg-3)',
                  border: `1px solid ${plan.highlight ? 'var(--acc-b)' : 'var(--b-1)'}`,
                  borderRadius: 'var(--r-lg)',
                  padding: '24px',
                  position: 'relative',
                  transform: plan.highlight ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all var(--dur-fast)',
                }}
              >
                {plan.highlight && (
                  <div style={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--acc)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: 'var(--r-full)',
                    fontSize: 'var(--t-2xs)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}>
                    Most Popular
                  </div>
                )}

                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ fontSize: 'var(--t-base)', fontWeight: 600, color: 'var(--tx-1)', margin: '0 0 8px 0' }}>
                    {plan.name}
                  </h4>
                  <div style={{ fontSize: 'var(--t-2xl)', fontWeight: 700, color: plan.highlight ? 'white' : 'var(--acc)' }}>
                    {plan.price}
                    <span style={{ fontSize: 'var(--t-sm)', color: plan.highlight ? 'rgba(255,255,255,.8)' : 'var(--tx-3)', marginLeft: 4 }}>
                      {plan.period}
                    </span>
                  </div>
                </div>

                <button
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: plan.highlight ? 'white' : 'var(--bg-4)',
                    color: plan.highlight ? 'var(--acc)' : 'var(--tx-1)',
                    border: plan.highlight ? 'none' : '1px solid var(--b-1)',
                    borderRadius: 'var(--r-md)',
                    fontSize: 'var(--t-sm)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginBottom: 16,
                    transition: 'all var(--dur-fast)',
                  }}
                  disabled={plan.cta === 'Current Plan'}
                >
                  {plan.cta}
                </button>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 'var(--t-2xs)', fontWeight: 600, color: plan.highlight ? 'rgba(255,255,255,.8)' : 'var(--tx-3)', textTransform: 'uppercase', marginBottom: 8 }}>
                    Includes
                  </div>
                  {plan.features.map((feat, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 'var(--t-sm)', color: plan.highlight ? 'rgba(255,255,255,.9)' : 'var(--tx-2)' }}>
                      <span>✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {plan.limits.length > 0 && (
                  <div>
                    <div style={{ fontSize: 'var(--t-2xs)', fontWeight: 600, color: 'var(--tx-4)', textTransform: 'uppercase', marginBottom: 6 }}>
                      Limits
                    </div>
                    {plan.limits.map((limit, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4, fontSize: 'var(--t-sm)', color: 'var(--tx-4)' }}>
                        <span>✕</span>
                        <span>{limit}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Billing History */}
        <div>
          <h3 style={{ fontSize: 'var(--t-base)', fontWeight: 600, color: 'var(--tx-1)', marginBottom: 16 }}>
            Billing History
          </h3>

          <div style={{
            background: 'var(--bg-3)',
            border: '1px solid var(--b-1)',
            borderRadius: 'var(--r-lg)',
            padding: '20px',
          }}>
            {subscription.plan === 'free' ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--tx-3)' }}>
                <p>No billing history on the Free plan</p>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 'var(--t-sm)', color: 'var(--tx-3)', textAlign: 'center' }}>
                  Invoices will appear here
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
