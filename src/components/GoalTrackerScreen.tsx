import React, { useState, useEffect } from "react";
import "../components/screens.css";
import { API_BASE_URL } from "../lib/apiConfig";

export function GoalTrackerScreen() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await (window as any).supabase.auth.getSession();
      if (!session) {
        setError('You must be logged in');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/goals`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }

      const data = await response.json();
      setGoals(Array.isArray(data.goals) ? data.goals : []);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Error fetching goals');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="screen-container">
        <div className="screen-header">
          <h2>Goal Tracker</h2>
          <p>Progress toward your objectives</p>
        </div>
        <div style={{ textAlign: "center", padding: "40px", color: "var(--t2)" }}>
          Loading goals...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="screen-container">
        <div className="screen-header">
          <h2>Goal Tracker</h2>
          <p>Progress toward your objectives</p>
        </div>
        <div style={{ textAlign: "center", padding: "40px", color: "var(--bad)" }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="screen-container">
      <div className="screen-header">
        <h2>Goal Tracker</h2>
        <p>Progress toward your objectives</p>
      </div>
      <div className="goals-tracker">
        {goals.length > 0 ? (
          goals.map((goal: any, idx: number) => {
            const percentage = (goal.current / goal.target) * 100;
            return (
              <div key={idx} className="goal-progress">
                <div className="progress-header">
                  <h3>{goal.name}</h3>
                  <span className={`trend ${goal.trend >= 0 ? 'positive' : 'negative'}`}>
                    {goal.trend >= 0 ? '↑' : '↓'} {Math.abs(goal.trend || 0)}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.min(percentage, 100)}%` }} />
                </div>
                <div className="progress-stats">
                  <div className="stat">
                    <span className="label">Current</span>
                    <span className="value">{goal.current}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Target</span>
                    <span className="value">{goal.target}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Metric</span>
                    <span className="value">{goal.metric}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--t2)" }}>
            No goals yet. Set your first goal!
          </div>
        )}
      </div>
    </div>
  );
}

export default GoalTrackerScreen;
