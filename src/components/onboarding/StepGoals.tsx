import React, { useState, useCallback } from 'react';
import './onboarding.css';

const GOALS = [
  {
    id: 'get_clients',
    icon: '💼',
    title: 'Get inbound clients',
    description: 'Attract high-value clients through LinkedIn authority',
    creators: ['hormozi', 'orlob', 'welsh']
  },
  {
    id: 'grow_audience',
    icon: '📈',
    title: 'Grow audience',
    description: 'Build a larger, more engaged follower base',
    creators: ['lara', 'bartlett', 'shaan']
  },
  {
    id: 'authority',
    icon: '🏆',
    title: 'Build authority',
    description: 'Establish yourself as an industry expert',
    creators: ['welsh', 'priestley', 'sabbagh']
  },
  {
    id: 'viral',
    icon: '🚀',
    title: 'Go viral',
    description: 'Create content that gets massive reach',
    creators: ['acosta', 'bartlett', 'lara']
  }
];

interface StepGoalsProps {
  onNext: (goals: string[]) => void;
  onBack?: () => void;
}

export function StepGoals({ onNext, onBack }: StepGoalsProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleGoal = useCallback((goalId: string) => {
    setSelected(prev =>
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  }, []);

  const handleNext = useCallback(() => {
    if (selected.length > 0) {
      onNext(selected);
    }
  }, [selected, onNext]);

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>What's your primary goal?</h2>
        <p>We'll optimize your scoring and suggestions based on your goal</p>
      </div>

      <div className="goals-grid">
        {GOALS.map(goal => (
          <div
            key={goal.id}
            className={`goal-card ${selected.includes(goal.id) ? 'selected' : ''}`}
            onClick={() => toggleGoal(goal.id)}
          >
            <div className="goal-icon">{goal.icon}</div>
            <h3>{goal.title}</h3>
            <p>{goal.description}</p>
            <div className="goal-checkbox">
              {selected.includes(goal.id) && <span>✓</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="step-actions">
        {onBack && (
          <button className="btn-secondary" onClick={onBack}>
            Back
          </button>
        )}
        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={selected.length === 0}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default StepGoals;
