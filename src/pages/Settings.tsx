import { useState } from 'react';

export default function SettingsPage() {
  const [plan, setPlan] = useState('Pro');

  return (
    <section className="card" style={{ maxWidth: 720 }}>
      <h3 style={{ marginTop: 0 }}>Settings & Account</h3>
      <div style={{ display: 'grid', gap: 14 }}>
        <label>
          <div className="muted small">Profile</div>
          <input className="textarea" style={{ minHeight: 44 }} value="Sarah Chen" readOnly />
        </label>

        <label>
          <div className="muted small">Email</div>
          <input className="textarea" style={{ minHeight: 44 }} value="sarah@postroast.app" readOnly />
        </label>

        <div>
          <div className="muted small" style={{ marginBottom: 8 }}>Plan</div>
          <div className="goal-row">
            {['Free', 'Pro'].map((item) => (
              <button key={item} className={`pill ${plan === item ? 'active' : ''}`} onClick={() => setPlan(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
