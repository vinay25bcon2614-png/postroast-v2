import React from "react";
import "../components/screens.css";

export function GoalTrackerScreen() {
  const goals = [
    { name: "Get clients", current: 12, target: 20, metric: "proposals", trend: 8 },
    { name: "Grow audience", current: 2840, target: 5000, metric: "followers", trend: 24 },
    { name: "Build authority", current: 68, target: 85, metric: "avg score", trend: 3 },
  ];

  return (
    <div className="screen-container">
      <div className="screen-header">
        <h2>Goal Tracker</h2>
        <p>Progress toward your objectives</p>
      </div>
      <div className="goals-tracker">
        {goals.map((goal, idx) => {
          const percentage = (goal.current / goal.target) * 100;
          return (
            <div key={idx} className="goal-progress">
              <div className="progress-header">
                <h3>{goal.name}</h3>
                <span className="trend positive">? {goal.trend}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${Math.min(percentage, 100)}%` }} />
              </div>
              <div className="progress-stats">
                <div className="stat"><span className="label">Current</span><span className="value">{goal.current}</span></div>
                <div className="stat"><span className="label">Target</span><span className="value">{goal.target}</span></div>
                <div className="stat"><span className="label">Metric</span><span className="value">{goal.metric}</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GoalTrackerScreen;
