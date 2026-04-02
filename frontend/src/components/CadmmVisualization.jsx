import React, { useState, useEffect } from 'react';
import { Layers, Network, RefreshCw } from 'lucide-react';

export default function CadmmVisualization() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => (s + 1) % 8);
    }, 4000); // 4 seconds per step
    return () => clearInterval(timer);
  }, []);

  const steps = [
    { title: "Initialization", desc: "Slices receive current dual price penalty signals. (λ)", active: 'init' },
    { title: "eMBB Local Opt", desc: "eMBB slice locally computes its maximum utility allocation request.", active: 'eMBB' },
    { title: "URLLC Local Opt", desc: "URLLC slice computes its ultra-reliable resource request.", active: 'URLLC' },
    { title: "mMTC Local Opt", desc: "mMTC slice computes its massive connectivity request.", active: 'mMTC' },
    { title: "Resource Aggregation", desc: "Coordinator collects the requested resource volumes from all 3 slices.", active: 'coordinator_in' },
    { title: "Capacity Check", desc: "Coordinator evaluates aggregate demand against hard physical network limits.", active: 'coordinator_check' },
    { title: "Consensus Calculation", desc: "Coordinator calculates a shared feasible allocation balancing all requests. (z)", active: 'coordinator_calc' },
    { title: "Dual Price Update", desc: "Coordinator updates global prices based on demand mismatch and broadcasts.", active: 'prices_out' }
  ];

  const currentStep = steps[step];

  return (
    <div style={{ marginTop: '20px', padding: '24px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
      <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', marginBottom: '20px', marginTop: 0 }}>
        <RefreshCw size={20} className="animate-spin" style={{ animationDuration: '6s' }} />
        C-ADMM 8-Phase Resolution Iteration
      </h4>
      
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', height: '280px', justifyContent: 'space-between', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
          
          <div style={{ 
            padding: '16px', background: currentStep.active.startsWith('coordinator') || currentStep.active === 'prices_out' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.05)', 
            borderRadius: '16px', border: currentStep.active.startsWith('coordinator') ? '2px solid #10b981' : '2px solid #333',
            transition: 'all 0.5s', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '120px', zIndex: 10
          }}>
            <Network size={32} color={currentStep.active.startsWith('coordinator') ? '#10b981' : '#888'} className={currentStep.active === 'coordinator_calc' ? 'animate-pulse' : ''} />
            <span style={{ fontSize: '0.8rem', marginTop: '8px', fontWeight: 'bold' }}>Coordinator</span>
          </div>

          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around', zIndex: 10 }}>
            {['eMBB', 'URLLC', 'mMTC'].map(slice => (
              <div key={slice} style={{
                padding: '12px', background: currentStep.active === slice || currentStep.active === 'init' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                borderRadius: '12px', border: currentStep.active === slice ? '2px solid #3b82f6' : '2px solid #333',
                transform: currentStep.active === slice ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.5s', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px'
              }}>
                <Layers size={24} color={currentStep.active === slice ? '#3b82f6' : '#888'} />
                <span style={{ fontSize: '0.75rem', marginTop: '4px' }}>{slice}</span>
              </div>
            ))}
          </div>

          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
            <svg width="100%" height="100%">
              {/* Lines */}
              <line x1="20%" y1="75%" x2="50%" y2="25%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
              <line x1="50%" y1="75%" x2="50%" y2="25%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
              <line x1="80%" y1="75%" x2="50%" y2="25%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />

              {/* Data Flow Particles */}
              {currentStep.active === 'coordinator_in' && (
                <>
                  <circle cx="20%" cy="75%" r="5" fill="#3b82f6"><animate attributeName="cy" values="75%;25%" dur="2s" repeatCount="indefinite" /><animate attributeName="cx" values="20%;50%" dur="2s" repeatCount="indefinite" /></circle>
                  <circle cx="50%" cy="75%" r="5" fill="#3b82f6"><animate attributeName="cy" values="75%;25%" dur="2s" repeatCount="indefinite" /></circle>
                  <circle cx="80%" cy="75%" r="5" fill="#3b82f6"><animate attributeName="cy" values="75%;25%" dur="2s" repeatCount="indefinite" /><animate attributeName="cx" values="80%;50%" dur="2s" repeatCount="indefinite" /></circle>
                </>
              )}
              {currentStep.active === 'prices_out' && (
                <>
                  <circle cx="50%" cy="25%" r="5" fill="#10b981"><animate attributeName="cy" values="25%;75%" dur="2s" repeatCount="indefinite" /><animate attributeName="cx" values="50%;20%" dur="2s" repeatCount="indefinite" /></circle>
                  <circle cx="50%" cy="25%" r="5" fill="#10b981"><animate attributeName="cy" values="25%;75%" dur="2s" repeatCount="indefinite" /></circle>
                  <circle cx="50%" cy="25%" r="5" fill="#10b981"><animate attributeName="cy" values="25%;75%" dur="2s" repeatCount="indefinite" /><animate attributeName="cx" values="50%;80%" dur="2s" repeatCount="indefinite" /></circle>
                </>
              )}
            </svg>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center' }}>
          {steps.map((s, idx) => (
            <div key={idx} style={{ 
              padding: '8px 12px', borderRadius: '8px',
              background: step === idx ? 'rgba(255,255,255,0.1)' : 'transparent',
              borderLeft: step === idx ? '4px solid #10b981' : '4px solid transparent',
              transition: 'all 0.3s',
              opacity: step === idx ? 1 : 0.4
            }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: step === idx ? '#10b981' : 'var(--text-primary)' }}>
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
