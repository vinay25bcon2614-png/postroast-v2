import React, { useState } from "react";
import "../components/screens.css";

export function HookBuilderScreen() {
  const [topic, setTopic] = useState("");
  const [hooks, setHooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const generateHooks = () => {
    setLoading(true);
    setTimeout(() => {
      setHooks([
        { id: "1", text: "Did you know that...", strength: 8 },
        { id: "2", text: "Everyone gets this wrong...", strength: 9 },
        { id: "3", text: "I learned this the hard way...", strength: 7 },
        { id: "4", text: "The truth is...", strength: 8 },
        { id: "5", text: "Most people miss this...", strength: 9 },
      ]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="screen-container">
      <div className="screen-header">
        <h2>Hook Builder</h2>
        <p>Generate compelling opening lines</p>
      </div>
      <div className="builder-controls">
        <div className="form-group">
          <label>Topic</label>
          <input type="text" placeholder="What's your post about?" value={topic} onChange={(e) => setTopic(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={generateHooks} disabled={!topic || loading}>{loading ? "Generating..." : "Generate"}</button>
      </div>
      <div className="hooks-grid">
        {hooks.map(hook => (
          <div key={hook.id} className="hook-card">
            <p className="hook-text">{hook.text}</p>
            <div className="hook-meta">
              <span className="strength">Strength: {hook.strength}/10</span>
              <button className="btn-small">Copy</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HookBuilderScreen;
