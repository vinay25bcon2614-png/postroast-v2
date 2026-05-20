import React, { useState, useEffect } from "react";
import "../components/screens.css";
import { useAnalytics } from "../hooks/useAnalytics";

export function AnalyticsScreen() {
  const [days, setDays] = useState(30);
  const { data: analytics, loading, error } = useAnalytics(days);

  if (loading) {
    return (
      <div className="screen-container">
        <div className="screen-header">
          <h2>Analytics</h2>
          <p>Your performance insights</p>
        </div>
        <div style={{ textAlign: "center", padding: "40px", color: "var(--t2)" }}>
          Loading analytics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="screen-container">
        <div className="screen-header">
          <h2>Analytics</h2>
          <p>Your performance insights</p>
        </div>
        <div style={{ textAlign: "center", padding: "40px", color: "var(--bad)" }}>
          Error loading analytics: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="screen-container">
      <div className="screen-header">
        <h2>Analytics</h2>
        <p>Your performance insights</p>
      </div>
      
      <div style={{ marginBottom: "20px" }}>
        <button 
          onClick={() => setDays(7)}
          style={{ marginRight: "8px", padding: "8px 16px", background: days === 7 ? "var(--acc)" : "var(--b2)", color: days === 7 ? "white" : "var(--tx)", border: "none", borderRadius: "8px", cursor: "pointer" }}
        >
          7 Days
        </button>
        <button 
          onClick={() => setDays(30)}
          style={{ marginRight: "8px", padding: "8px 16px", background: days === 30 ? "var(--acc)" : "var(--b2)", color: days === 30 ? "white" : "var(--tx)", border: "none", borderRadius: "8px", cursor: "pointer" }}
        >
          30 Days
        </button>
        <button 
          onClick={() => setDays(90)}
          style={{ padding: "8px 16px", background: days === 90 ? "var(--acc)" : "var(--b2)", color: days === 90 ? "white" : "var(--tx)", border: "none", borderRadius: "8px", cursor: "pointer" }}
        >
          90 Days
        </button>
      </div>

      <div className="analytics-grid">
        <div className="kpi-card">
          <p className="kpi-value">{analytics?.avgScore?.toFixed(1) || 0}</p>
          <p className="kpi-label">Avg Score</p>
          <p className="kpi-trend">{analytics?.scoreChange || 0}% change</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-value">{analytics?.postsCount || 0}</p>
          <p className="kpi-label">Posts Roasted</p>
          <p className="kpi-trend">{analytics?.postsThisWeek || 0} this week</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-value">{analytics?.totalEngagements || 0}</p>
          <p className="kpi-label">Total Engagements</p>
          <p className="kpi-trend">{analytics?.engagementChange || 0}% change</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-value">{analytics?.currentStreak || 0}d</p>
          <p className="kpi-label">Current Streak</p>
          <p className="kpi-trend">Keep it up!</p>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsScreen;
