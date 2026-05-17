import React, { useState, useCallback } from 'react';

interface VoiceSettings {
  directness: number;
  analytical: number;
  empathy: number;
  humor: number;
}

interface StepVoiceProps {
  onNext: (settings: VoiceSettings) => void;
  onBack?: () => void;
}

export function StepVoice({ onNext, onBack }: StepVoiceProps) {
  const [settings, setSettings] = useState<VoiceSettings>({
    directness: 70,
    analytical: 50,
    empathy: 40,
    humor: 30,
  });

  const handleChange = useCallback((key: keyof VoiceSettings, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Fine-tune your roasting voice</h2>
        <p>How aggressive should PostRoast be with your feedback?</p>
      </div>

      <div className="sliders-container">
        <div className="slider-group">
          <div className="slider-label">
            <span className="slider-label-left">Directness</span>
            <span className="slider-label-right">{settings.directness}%</span>
          </div>
          <input 
            type="range" 
            min="0" max="100" 
            value={settings.directness}
            onChange={(e) => handleChange('directness', parseInt(e.target.value))}
            className="slider"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#a0a0a0', marginTop: '4px' }}>
            <span>Gentle</span>
            <span>Brutal</span>
          </div>
        </div>

        <div className="slider-group">
          <div className="slider-label">
            <span className="slider-label-left">Analytical</span>
            <span className="slider-label-right">{settings.analytical}%</span>
          </div>
          <input 
            type="range" 
            min="0" max="100" 
            value={settings.analytical}
            onChange={(e) => handleChange('analytical', parseInt(e.target.value))}
            className="slider"
          />
        </div>

        <div className="slider-group">
          <div className="slider-label">
            <span className="slider-label-left">Empathy</span>
            <span className="slider-label-right">{settings.empathy}%</span>
          </div>
          <input 
            type="range" 
            min="0" max="100" 
            value={settings.empathy}
            onChange={(e) => handleChange('empathy', parseInt(e.target.value))}
            className="slider"
          />
        </div>

        <div className="slider-group">
          <div className="slider-label">
            <span className="slider-label-left">Humor</span>
            <span className="slider-label-right">{settings.humor}%</span>
          </div>
          <input 
            type="range" 
            min="0" max="100" 
            value={settings.humor}
            onChange={(e) => handleChange('humor', parseInt(e.target.value))}
            className="slider"
          />
        </div>
      </div>

      <div className="step-actions">
        {onBack && (
          <button className="btn-secondary" onClick={onBack}>
            Back
          </button>
        )}
        <button className="btn-primary" onClick={() => onNext(settings)}>
          Continue
        </button>
      </div>
    </div>
  );
}

export default StepVoice;
