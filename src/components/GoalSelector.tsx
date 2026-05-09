import React from 'react';
import { GoalId } from '../types';
import { getAllGoals } from '../lib/goals';
import './GoalSelector.css';

interface GoalSelectorProps {
  selectedGoal: GoalId;
  onSelectGoal: (goal: GoalId) => void;
}

export function GoalSelector({ selectedGoal, onSelectGoal }: GoalSelectorProps) {
  const goals = getAllGoals();

  return (
    <div className="goal-selector">
      <div className="goal-selector-header">
        <h2>What's your primary goal?</h2>
        <p>PostRoast will optimize rewrites based on your goal</p>
      </div>

      <div className="goal-selector-grid">
        {goals.map((goal) => (
          <button
            key={goal.id}
            className={`goal-card ${selectedGoal === goal.id ? 'active' : ''}`}
            onClick={() => onSelectGoal(goal.id)}
            aria-pressed={selectedGoal === goal.id}
          >
            <div className="goal-emoji">{goal.emoji}</div>
            <div className="goal-label">{goal.label}</div>
            <div className="goal-description">{goal.description}</div>

            {selectedGoal === goal.id && (
              <div className="goal-checkmark">✓</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
