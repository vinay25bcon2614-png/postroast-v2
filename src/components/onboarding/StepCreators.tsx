import React, { useState, useCallback } from 'react';

interface Creator {
  id: string;
  name: string;
  icon: string;
}

const CREATORS = [
  { id: 'hormozi', name: 'Hormozi', icon: '💼' },
  { id: 'welsh', name: 'Justin Welsh', icon: '📝' },
  { id: 'orlob', name: 'Alex Cattoni', icon: '✨' },
  { id: 'lara', name: 'Lara', icon: '🎯' },
  { id: 'bartlett', name: 'Bartlett', icon: '🚀' },
  { id: 'shaan', name: 'Shaan', icon: '🔥' },
];

interface StepCreatorsProps {
  onNext: (creators: string[]) => void;
  onBack?: () => void;
}

export function StepCreators({ onNext, onBack }: StepCreatorsProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleCreator = useCallback((creatorId: string) => {
    setSelected(prev =>
      prev.includes(creatorId)
        ? prev.filter(id => id !== creatorId)
        : [...prev, creatorId]
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
        <h2>Who influences your writing style?</h2>
        <p>Select 3-5 creators to model your voice after</p>
      </div>

      <div className="creators-list">
        {CREATORS.map(creator => (
          <div
            key={creator.id}
            className={`creator-card ${selected.includes(creator.id) ? 'selected' : ''}`}
            onClick={() => toggleCreator(creator.id)}
          >
            <div className="creator-avatar">{creator.icon}</div>
            <h3>{creator.name}</h3>
            <div className="creator-checkbox">
              {selected.includes(creator.id) && <span>✓</span>}
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

export default StepCreators;
