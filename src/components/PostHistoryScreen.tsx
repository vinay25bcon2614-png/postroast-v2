import React from "react";
import "../components/screens.css";

export function PostHistoryScreen() {
  const posts = [
    { id: "1", text: "Just shipped a new feature...", score: 82, engagements: 234, date: "2h ago" },
    { id: "2", text: "Here is what I learned...", score: 76, engagements: 189, date: "1d ago" },
    { id: "3", text: "Nobody talks about this...", score: 69, engagements: 145, date: "3d ago" },
    { id: "4", text: "The biggest mistake...", score: 88, engagements: 412, date: "5d ago" },
  ];

  return (
    <div className="screen-container">
      <div className="screen-header">
        <h2>Post History</h2>
        <p>Your recent posts and performance</p>
      </div>
      <div className="posts-list">
        {posts.map(post => (
          <div key={post.id} className="post-item">
            <div className="post-content"><p>{post.text}</p></div>
            <div className="post-meta">
              <div className="meta-item"><span className="label">Score</span><span className="score" style={{color: post.score >= 80 ? "#22c55e" : "#eab308"}}>{post.score}</span></div>
              <div className="meta-item"><span className="label">Engagements</span><span className="value">{post.engagements}</span></div>
              <div className="meta-item"><span className="label">Date</span><span className="value">{post.date}</span></div>
              <button className="btn-small">Re-roast</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostHistoryScreen;
