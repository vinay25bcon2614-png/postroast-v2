import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface StyleDNA {
  directness: number;
  analytical: number;
  emotional: number;
  authoritative: number;
  conversational: number;
}

export function StyleDNAScreen() {
  const { user } = useAuth();
  const [styleDna, setStyleDna] = useState<StyleDNA>({
    directness: 42,
    analytical: 58,
    emotional: 35,
    authoritative: 71,
    conversational: 64
  });
  const [analyzed, setAnalyzed] = useState(0);

  return (
    <div className="screen-container">
      <div className="screen-header">
        <h2>Style DNA</h2>
        <p>Your unique writing fingerprint</p>
      </div>

      <div className="style-dna-container">
        <div className="dna-progress">
          <p>Analyzed <strong>{analyzed} posts</strong> to create your profile</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min(analyzed / 10 * 100, 100)}%` }} />
          </div>
        </div>

        <div className="dna-traits">
          {Object.entries(styleDna).map(([key, value]) => (
            <div key={key} className="trait-row">
              <div className="trait-label">
                <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              </div>
              <div className="trait-bar">
                <div className="trait-fill" style={{ width: `${value}%` }} />
              </div>
              <div className="trait-value">{value}%</div>
            </div>
          ))}
        </div>

        <div className="dna-interpretation">
          <h3>Your Voice</h3>
          <p>You write with <strong>strong authority</strong> and <strong>conversational warmth</strong>. Your analytical depth resonates with professional audiences while your directness cuts through noise.</p>
          
          <div className="recommendations">
            <h4>💡 Optimization Tips</h4>
            <ul>
              <li>Increase emotional vulnerability to improve engagement</li>
              <li>Your analytical posts score 18% higher - lean into this</li>
              <li>Try more storytelling to balance your authority</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StyleDNAScreen;
