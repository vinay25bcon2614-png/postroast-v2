import React, { useState } from 'react';

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

  const toggleSave = (id: string) => {
    setFormats(prev =>
      prev.map(f => f.id === id ? { ...f, saved: !f.saved } : f)
    );
  };

  return (
    <div className="screen-container">
      <div className="screen-header">
        <h2>Format Library</h2>
        <p>Proven LinkedIn post templates</p>
      </div>

      <div className="format-grid">
        {formats.map(format => (
          <div key={format.id} className="format-card">
            <div className="format-header">
              <h3>{format.name}</h3>
              <button
                className={`save-btn ${format.saved ? 'saved' : ''}`}
                onClick={() => toggleSave(format.id)}
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
