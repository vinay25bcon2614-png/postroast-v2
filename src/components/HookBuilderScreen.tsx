import React, { useState } from "react";
import "../components/screens.css";
import { API_BASE_URL } from "../lib/apiConfig";

export function HookBuilderScreen() {
  const [topic, setTopic] = useState("");
  const [hooks, setHooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateHooks = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await (window as any).supabase.auth.getSession();
      if (!session) {
        setError('You must be logged in to generate hooks');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/hooks/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          topic,
          count: 5
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate hooks');
      }

      const data = await response.json();
      setHooks(Array.isArray(data.hooks) ? data.hooks : []);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Error generating hooks');
      setLoading(false);
    }
  };

  const copyHook = (text: string) => {
    navigator.clipboard.writeText(text);
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
          <input 
            type="text" 
            placeholder="What's your post about?" 
            value={topic} 
            onChange={(e) => setTopic(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && generateHooks()}
          />
        </div>
        {error && <div style={{ color: 'var(--bad)', fontSize: '14px' }}>{error}</div>}
        <button className="btn-primary" onClick={generateHooks} disabled={!topic || loading}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
      <div className="hooks-grid">
        {hooks.length > 0 ? (
          hooks.map((hook, idx) => (
            <div key={idx} className="hook-card">
              <p className="hook-text">{hook.text || hook}</p>
              <div className="hook-meta">
                <span className="strength">{hook.strength ? `Strength: ${hook.strength}/10` : 'Generated'}</span>
                <button className="btn-small" onClick={() => copyHook(hook.text || hook)}>Copy</button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--t2)' }}>
            Enter a topic and click Generate to create hooks
          </div>
        )}
      </div>
    </div>
  );
}

export default HookBuilderScreen;
