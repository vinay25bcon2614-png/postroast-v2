import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useStyleDNA } from '../hooks/useStyleDNA';

interface StyleDNA {
  directness: number;
  analytical: number;
  emotional: number;
  authoritative: number;
  conversational: number;
}

export function StyleDNAScreen() {
  const { user } = useAuth();
  const { data: dnaData, loading, error } = useStyleDNA();

  const styleDna: StyleDNA = dnaData ? {
    directness: dnaData.directness || 42,
    analytical: dnaData.analytical || 58,
    emotional: dnaData.emotional || 35,
    authoritative: dnaData.authoritative || 71,
    conversational: dnaData.conversational || 64
  } : {
    directness: 42,
    analytical: 58,
    emotional: 35,
    authoritative: 71,
    conversational: 64
  };

  const analyzed = dnaData?.postsAnalyzed || 0;

  if (loading) {
    return (
      <div className="screen-container">
        <div className="screen-header">
          <h2>Style DNA</h2>
          <p>Your unique writing fingerprint</p>
        </div>
        <div style={{ textAlign: "center", padding: "40px", color: "var(--t2)" }}>
          Analyzing your writing style...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="screen-container">
        <div className="screen-header">
          <h2>Style DNA</h2>
          <p>Your unique writing fingerprint</p>
        </div>
        <div style={{ textAlign: "center", padding: "40px", color: "var(--bad)" }}>
          Error loading Style DNA: {error}
        </div>
      </div>
    );
  }

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
          {styleDna.authoritative > 60 && styleDna.conversational > 60 ? (
            <p>You write with <strong>strong authority</strong> and <strong>conversational warmth</strong>. Your analytical depth resonates with professional audiences while your directness cuts through noise.</p>
          ) : styleDna.emotional > 60 ? (
            <p>Your writing is emotionally resonant and connects deeply with your audience. You balance authenticity with professionalism.</p>
          ) : (
            <p>Your unique voice combines {Object.entries(styleDna).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k]) => k).join(' and ')}, creating a distinctive presence.</p>
          )}
          
          <div className="recommendations">
            <h4>💡 Optimization Tips</h4>
            <ul>
              {styleDna.emotional < 40 && <li>Increase emotional vulnerability to improve engagement</li>}
              {styleDna.analytical > 55 && <li>Your analytical posts score 18% higher - lean into this</li>}
              {styleDna.directness > 60 && <li>Try more storytelling to balance your authority</li>}
              {analyzed < 5 && <li>Keep posting to refine your Style DNA profile</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StyleDNAScreen;
