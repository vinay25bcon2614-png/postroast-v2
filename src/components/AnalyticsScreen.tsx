import React from "react";
import "../components/screens.css";

export function AnalyticsScreen() {
  return (
    <div className="screen-container">
      <div className="screen-header">
        <h2>Analytics</h2>
        <p>Your performance insights</p>
      </div>
      <div className="analytics-grid">
        <div className="kpi-card">
          <p className="kpi-value">78</p>
          <p className="kpi-label">Avg Score</p>
          <p className="kpi-trend">? 5%</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-value">24</p>
          <p className="kpi-label">Posts Roasted</p>
          <p className="kpi-trend">? 3 this week</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-value">342</p>
          <p className="kpi-label">Total Engagements</p>
          <p className="kpi-trend">? 12%</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-value">7d</p>
          <p className="kpi-label">Current Streak</p>
          <p className="kpi-trend">Keep it up!</p>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsScreen;
