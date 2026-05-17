import React, { useState } from 'react';
import '../styles/onboarding.css';

interface OnboardingGoalsProps {
  onComplete?: (goal: string) => void;
}

export const OnboardingGoals: React.FC<OnboardingGoalsProps> = ({
  onComplete,
}) => {
  const [selected, setSelected] = useState<string>('');

  const goals = [
    {
      id: 'get_clients',
      icon: '💰',
      title: 'Get Clients',
      description: 'Convert followers into paying customers',
    },
    {
      id: 'build_audience',
      icon: '📈',
      title: 'Build Audience',
      description: 'Maximize reach, engagement, and followers',
    },
    {
      id: 'thought_leader',
      icon: '🎓',
      title: 'Thought Leader',
      description: 'Establish expertise and credibility',
    },
    {
      id: 'balanced',
      icon: '⚖️',
      title: 'Balanced',
      description: 'Grow audience + convert to clients',
    },
  ];

  return (
    <div className="onboarding-container">
      <div className="onboarding-header">
        <div className="logo">
          <div className="logo-mark">P</div>
          PostRoast
        </div>
        <span className="onboarding-tagline">Sign in to your account</span>
      </div>

      <div className="onboarding-content">
        <div className="onboarding-section">
          <h1 className="onboarding-title">What's your primary goal?</h1>
          <p className="onboarding-subtitle">
            We'll optimize everything for your objective
          </p>

          <div className="goal-grid">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className={`goal-card ${selected === goal.id ? 'selected' : ''}`}
                onClick={() => setSelected(goal.id)}
              >
                <div className="goal-rank">
                  {goals.findIndex((g) => g.id === goal.id) + 1}
                </div>
                <div className="goal-icon">{goal.icon}</div>
                <h3 className="goal-title">{goal.title}</h3>
                <p className="goal-description">{goal.description}</p>
              </div>
            ))}
          </div>

          <div className="onboarding-footer">
            <button className="btn-skip">Skip for now</button>
            <button
              className="btn-next"
              disabled={!selected}
              onClick={() => onComplete?.(selected)}
            >
              Next Step
            </button>
          </div>

          <div className="onboarding-progress">
            <div className="progress-dot active"></div>
            <div className="progress-dot"></div>
            <div className="progress-dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface OnboardingCreatorsProps {
  onComplete?: () => void;
  onBack?: () => void;
}

export const OnboardingCreators: React.FC<OnboardingCreatorsProps> = ({
  onComplete,
  onBack,
}) => {
  const [selected, setSelected] = useState<string[]>([]);

  const creators = [
    {
      id: 'justin_welsh',
      name: 'Justin Welsh',
      desc: 'Philosophical & warm',
      ex: '"Remember: Freedom is a choice"',
    },
    {
      id: 'alex_hormozi',
      name: 'Alex Hormozi',
      desc: 'Aggressive & direct',
      ex: '"Listen: Here\'s what most miss..."',
    },
    {
      id: 'chris_orlob',
      name: 'Chris Orlob',
      desc: 'Educational & sharp',
      ex: '"Most people get this wrong..."',
    },
    {
      id: 'lara_acosta',
      name: 'Lara Acosta',
      desc: 'Strategic & viral',
      ex: '"Here\'s my strategy..."',
    },
  ];

  const toggleCreator = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-header">
        <div className="logo">
          <div className="logo-mark">P</div>
          PostRoast
        </div>
        <span className="onboarding-tagline">Step 2 of 4</span>
      </div>

      <div className="onboarding-content">
        <div className="onboarding-section">
          <h1 className="onboarding-title">Pick your creator DNA</h1>
          <p className="onboarding-subtitle">
            Which styles resonate with you? (Pick 1-3)
          </p>

          <div className="creator-grid">
            {creators.map((creator) => (
              <div
                key={creator.id}
                className={`creator-card ${
                  selected.includes(creator.id) ? 'selected' : ''
                }`}
                onClick={() => toggleCreator(creator.id)}
              >
                <div className="creator-name">{creator.name}</div>
                <p className="creator-desc">{creator.desc}</p>
                <div className="creator-example">
                  <em>{creator.ex}</em>
                </div>
              </div>
            ))}
          </div>

          <div className="onboarding-footer">
            <button className="btn-skip" onClick={onBack}>
              Back
            </button>
            <button
              className="btn-next"
              disabled={selected.length === 0}
              onClick={onComplete}
            >
              Next Step
            </button>
          </div>

          <div className="onboarding-progress">
            <div className="progress-dot active"></div>
            <div className="progress-dot active"></div>
            <div className="progress-dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface OnboardingVoiceProps {
  onComplete?: () => void;
  onBack?: () => void;
}

export const OnboardingVoice: React.FC<OnboardingVoiceProps> = ({
  onComplete,
  onBack,
}) => {
  const [settings, setSettings] = useState({
    tone: 'balanced',
    formality: 50,
    engagement: 70,
  });

  return (
    <div className="onboarding-container">
      <div className="onboarding-header">
        <div className="logo">
          <div className="logo-mark">P</div>
          PostRoast
        </div>
        <span className="onboarding-tagline">Step 3 of 4</span>
      </div>

      <div className="onboarding-content">
        <div className="onboarding-section">
          <h1 className="onboarding-title">Define your voice</h1>
          <p className="onboarding-subtitle">
            Customize your unique writing style
          </p>

          <div className="voice-settings">
            <div className="setting-group">
              <label className="setting-label">Tone</label>
              <div className="tone-options">
                {['Raw', 'Balanced', 'Professional'].map((tone) => (
                  <button
                    key={tone}
                    className={`tone-btn ${
                      settings.tone === tone.toLowerCase() ? 'active' : ''
                    }`}
                    onClick={() =>
                      setSettings({ ...settings, tone: tone.toLowerCase() })
                    }
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-group">
              <label className="setting-label">Formality Level</label>
              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.formality}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      formality: parseInt(e.target.value),
                    })
                  }
                  className="slider"
                />
                <div className="slider-labels">
                  <span>Casual</span>
                  <span>{settings.formality}</span>
                  <span>Formal</span>
                </div>
              </div>
            </div>

            <div className="setting-group">
              <label className="setting-label">Engagement Level</label>
              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.engagement}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      engagement: parseInt(e.target.value),
                    })
                  }
                  className="slider"
                />
                <div className="slider-labels">
                  <span>Low</span>
                  <span>{settings.engagement}</span>
                  <span>High</span>
                </div>
              </div>
            </div>
          </div>

          <div className="onboarding-footer">
            <button className="btn-skip" onClick={onBack}>
              Back
            </button>
            <button className="btn-next" onClick={onComplete}>
              Complete Setup
            </button>
          </div>

          <div className="onboarding-progress">
            <div className="progress-dot active"></div>
            <div className="progress-dot active"></div>
            <div className="progress-dot active"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingGoals;
