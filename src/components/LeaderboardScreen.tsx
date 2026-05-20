import React, { useState } from "react";
import "../components/screens.css";
import { useLeaderboard } from "../hooks/useLeaderboard";

export function LeaderboardScreen() {
  const [tab, setTab] = useState("week");
  const { data: leaderboard, loading, error } = useLeaderboard(tab);

  if (loading) {
    return (
      <div className="screen-container">
        <div className="screen-header">
          <h2>Leaderboard</h2>
          <p>Top performers</p>
        </div>
        <div style={{ textAlign: "center", padding: "40px", color: "var(--t2)" }}>
          Loading leaderboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="screen-container">
        <div className="screen-header">
          <h2>Leaderboard</h2>
          <p>Top performers</p>
        </div>
        <div style={{ textAlign: "center", padding: "40px", color: "var(--bad)" }}>
          Error loading leaderboard: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="screen-container">
      <div className="screen-header">
        <h2>Leaderboard</h2>
        <p>Top performers {tab === "week" ? "this week" : tab === "month" ? "this month" : "all time"}</p>
      </div>
      <div className="leaderboard-tabs">
        <button 
          className={`tab-btn ${tab === "week" ? "active" : ""}`} 
          onClick={() => setTab("week")}
          style={{ background: tab === "week" ? "var(--acc)" : "var(--b2)", color: tab === "week" ? "white" : "var(--tx)" }}
        >
          This Week
        </button>
        <button 
          className={`tab-btn ${tab === "month" ? "active" : ""}`} 
          onClick={() => setTab("month")}
          style={{ background: tab === "month" ? "var(--acc)" : "var(--b2)", color: tab === "month" ? "white" : "var(--tx)" }}
        >
          This Month
        </button>
        <button 
          className={`tab-btn ${tab === "all" ? "active" : ""}`} 
          onClick={() => setTab("all")}
          style={{ background: tab === "all" ? "var(--acc)" : "var(--b2)", color: tab === "all" ? "white" : "var(--tx)" }}
        >
          All Time
        </button>
      </div>
      <div className="leaderboard-list">
        {leaderboard && leaderboard.length > 0 ? (
          leaderboard.map((user: any, idx: number) => (
            <div key={idx} className="leaderboard-row">
              <div className="rank">{user.rank || idx + 1}</div>
              <div className="user-info">
                <h4>{user.name || user.username}</h4>
              </div>
              <div className="user-score">{user.score || 0}</div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--t2)" }}>
            No leaderboard data available
          </div>
        )}
      </div>
    </div>
  );
}

export default LeaderboardScreen;
