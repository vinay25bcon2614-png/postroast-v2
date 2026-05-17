import React, { useState } from "react";
import "../components/screens.css";

export function LeaderboardScreen() {
  const [tab, setTab] = useState("week");

  const leaderboard = [
    { rank: 1, name: "Sarah Chen", score: 89, badge: "??" },
    { rank: 2, name: "Marcus Dev", score: 87, badge: "??" },
    { rank: 3, name: "You", score: 82, badge: "??" },
    { rank: 4, name: "Alex Walsh", score: 79, badge: "" },
    { rank: 5, name: "Jordan Lee", score: 76, badge: "" },
  ];

  return (
    <div className="screen-container">
      <div className="screen-header">
        <h2>Leaderboard</h2>
        <p>Top performers this week</p>
      </div>
      <div className="leaderboard-tabs">
        <button className={`tab-btn ${tab === "week" ? "active" : ""}`} onClick={() => setTab("week")}>This Week</button>
        <button className={`tab-btn ${tab === "month" ? "active" : ""}`} onClick={() => setTab("month")}>This Month</button>
        <button className={`tab-btn ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>All Time</button>
      </div>
      <div className="leaderboard-list">
        {leaderboard.map(user => (
          <div key={user.rank} className="leaderboard-row">
            <div className="rank">{user.badge || user.rank}</div>
            <div className="user-info">
              <h4>{user.name}</h4>
            </div>
            <div className="user-score">{user.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeaderboardScreen;
