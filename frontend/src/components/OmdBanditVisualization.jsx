import React, { useState, useEffect } from 'react';
import { Cpu, Target, FastForward, Navigation } from 'lucide-react';

export default function OmdBanditVisualization() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => (s + 1) % 8);
    }, 4000); // 4 seconds per step
    return () => clearInterval(timer);
  }, []);

  const steps = [
    { title: "Initialize Parameters", desc: "Initialize OMD weights mapping to network resource logic.", active: 'init' },
    { title: "Observe State", desc: "Retrieve current capacity metrics from the slicing framework.", active: 'obs' },
    { title: "Generate Perturbation", desc: "Bandit algorithm generates a random exploration vector.", active: 'perturb' },
    { title: "Form Action", desc: "Add perturbation to the current weights to explore nearby policies.", active: 'action' },
    { title: "Execute Action", desc: "Apply the perturbed mapping as a physical slicing allocation.", active: 'exec' },
    { title: "Evaluate Cost Feedback", desc: "Environment assesses how poorly the network performed (Cost).", active: 'cost' },
    { title: "Estimate Gradient", desc: "Use the single point Cost feedback and perturbation to estimate gradient.", active: 'grad' },
    { title: "Mirror Descent Update", desc: "Project the estimated gradient back into feasible weight bounds.", active: 'update' }
  ];

  const currentStep = steps[step];

  return (
    <div style={{ marginTop: '20px', padding: '24px', background: 'rgba(251, 191, 36, 0.05)', borderRadius: '12px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
      <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', marginBottom: '20px', marginTop: 0 }}>
        <Target size={20} />
        OMD Bandit Exploration Cycle
      </h4>
      
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', height: '280px', justifyContent: 'center', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', alignItems: 'center', zIndex: 10 }}>
            <div style={{ display: 'flex', gap: '16px', width: '100%', justifyContent: 'center' }}>
              <div style={{ padding: '16px', border: '2px solid #fbbf24', borderRadius: '50%', background: currentStep.active === 'init' || currentStep.active === 'update' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(255,255,255,0.05)', transition: 'all 0.5s' }}>
                 <Cpu color="#fbbf24" />
              </div>
              
              {/* Peturbation Node */}
              <div style={{ padding: '16px', border: '2px dashed #a855f7', borderRadius: '50%', background: currentStep.active === 'perturb' || currentStep.active === 'action' ? 'rgba(168, 85, 247, 0.3)' : 'transparent', transition: 'all 0.5s', opacity: step >= 2 && step <= 4 ? 1 : 0.2 }}>
                 <FastForward color="#a855f7" />
              </div>
            </div>

            <div style={{ width: '2px', height: '20px', background: '#555' }}></div>

            <div style={{ padding: '12px 24px', border: '1px solid #333', borderRadius: '8px', background: currentStep.active === 'exec' || currentStep.active === 'cost' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)', transition: 'all 0.5s' }}>
                <span style={{ fontSize: '0.8rem', color: currentStep.active === 'cost' ? '#ef4444' : '#888' }}>Environment Evaluator</span>
            </div>

            <div style={{ padding: '8px 16px', borderLeft: '4px solid #10b981', background: currentStep.active === 'grad' ? 'rgba(16, 185, 129, 0.2)' : 'transparent', transition: 'all 0.5s', opacity: step >= 6 ? 1 : 0.2 }}>
                <span style={{ fontSize: '0.75rem', color: '#10b981' }}>Gradient Map Projection <Navigation size={12} style={{display:'inline'}}/></span>
            </div>
          </div>
          
        </div>

        <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center' }}>
          {steps.map((s, idx) => (
            <div key={idx} style={{ 
              padding: '8px 12px', borderRadius: '8px',
              background: step === idx ? 'rgba(255,255,255,0.1)' : 'transparent',
              borderLeft: step === idx ? '4px solid #fbbf24' : '4px solid transparent',
              transition: 'all 0.3s',
              opacity: step === idx ? 1 : 0.4
            }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: step === idx ? '#fbbf24' : 'var(--text-primary)' }}>
                {idx + 1}. {s.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
