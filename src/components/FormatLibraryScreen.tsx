import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../lib/apiConfig';

interface Format {
  id: string;
  name: string;
  description: string;
  template: string;
  saved: boolean;
  uses: number;
}

export function FormatLibraryScreen() {
  const [formats, setFormats] = useState<Format[]>([
    {
      id: '1',
      name: 'Problem-Observation-Solution',
      description: 'Identify problem → Share observation → Give actionable solution',
      template: 'Here\'s the problem...\n\nWhat I\'ve noticed...\n\nHere\'s what you can do...',
      saved: true,
      uses: 24
    },
    {
      id: '2',
      name: 'Story-Insight-Takeaway',
      description: 'Tell a story → Extract insight → Give takeaway',
      template: 'Last week, I...\n\nThe insight:\n\nYour takeaway:',
      saved: false,
      uses: 18
    },
    {
      id: '3',
      name: 'Contrarian Take',
      description: 'Challenge conventional wisdom',
      template: 'Everyone says...\n\nBut here\'s the truth...\n\nSo instead...',
      saved: true,
      uses: 12
    },
    {
      id: '4',
      name: 'List + Deep Dive',
      description: 'Quick list then deep explanation',
      template: 'The 3 things:\n1.\n2.\n3.\n\nHere\'s why #1 matters most...',
      saved: false,
      uses: 8
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSave = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const format = formats.find(f => f.id === id);
      if (!format) return;

      const { data: { session } } = await (window as any).supabase.auth.getSession();
      if (!session) {
        setError('You must be logged in to save formats');
        setLoading(false);
        return;
      }

      // Save to database
      const endpoint = format.saved ? 'remove' : 'add';
      const response = await fetch(`${API_BASE_URL}/api/user/formats/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          formatId: id,
          name: format.name,
          template: format.template
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save format');
      }

      // Update local state
      setFormats(prev =>
        prev.map(f => f.id === id ? { ...f, saved: !f.saved } : f)
      );
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Error saving format');
      setLoading(false);
    }
  };

  return (
    <div className="screen-container">
      <div className="screen-header">
        <h2>Format Library</h2>
        <p>Proven LinkedIn post templates</p>
      </div>

      {error && (
        <div style={{ padding: '12px', background: 'rgba(255, 100, 100, 0.1)', color: 'var(--bad)', borderRadius: '8px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <div className="format-grid">
        {formats.map(format => (
          <div key={format.id} className="format-card">
            <div className="format-header">
              <h3>{format.name}</h3>
              <button
                className={`save-btn ${format.saved ? 'saved' : ''}`}
                onClick={() => toggleSave(format.id)}
                disabled={loading}
              >
                {format.saved ? '★' : '☆'}
              </button>
            </div>

            <p className="format-desc">{format.description}</p>

            <div className="format-template">
              <pre>{format.template}</pre>
            </div>

            <div className="format-meta">
              <span className="uses">Used {format.uses} times</span>
              <button className="btn-small">Use Template</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FormatLibraryScreen;
