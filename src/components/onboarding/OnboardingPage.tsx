import React, { useState } from 'react';
import { StepCreators } from './StepCreators';
import { StepVoice } from './StepVoice';
import { StepFirstRoast } from './StepFirstRoast';
import { StepGoals } from './StepGoals';

interface FormData {
  goals: string[];
  creators: string[];
  voice: any;
  firstRoast: any;
}

export function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    goals: [],
    creators: [],
    voice: {},
    firstRoast: {}
  });

  const nextStep = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleFinish = (finalData: any) => {
    const completeData = { ...formData, ...finalData };
    console.log('Onboarding Complete:', completeData);
    // Save to Supabase
    window.location.href = '/dashboard';
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#0c0c0e' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid #2a2a2e' }}>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '12px' }}>
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: s <= step ? '#FF5C00' : '#2a2a2e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 700
                }}
              >
                {s}
              </div>
            ))}
          </div>
          <p style={{ color: '#a0a0a0', fontSize: '14px', margin: 0 }}>
            Step {step} of 4
          </p>
        </div>

        <div>
          {step === 1 && <StepGoals onNext={(goals) => nextStep({ goals })} />}
          {step === 2 && <StepCreators onNext={(creators) => nextStep({ creators })} onBack={prevStep} />}
          {step === 3 && <StepVoice onNext={(voice) => nextStep({ voice })} onBack={prevStep} />}
          {step === 4 && <StepFirstRoast onNext={handleFinish} onBack={prevStep} />}
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;
