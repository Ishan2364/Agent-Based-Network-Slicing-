import React, { useState, useEffect } from 'react';
import { Network, Server } from 'lucide-react';

export default function IndMappoPpoVisualization() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => (s + 1) % 8);
    }, 4000); // 4 seconds per step
    return () => clearInterval(timer);
  }, []);

  const steps = [
    { title: "Initialize Actors", desc: "Spawn completely independent PPO actors for each network slice.", active: 'init' },
    { title: "Local Observation", desc: "Actors observe only their slice's local traffic and constraints.", active: 'obs' },
    { title: "Independent Forward", desc: "Run independent Neural Networks without a shared critic.", active: 'nn' },
    { title: "Generate Action", desc: "Each agent emits resource grab actions blindly.", active: 'actions' },
    { title: "Uncoordinated Exec", desc: "Simultaneous execution causes potential physics/capacity collisions.", active: 'exec' },
    { title: "Environment Resolution", desc: "Environment forces a naive resolution if capacity is breached.", active: 'env' },
    { title: "Local Rewards", desc: "Agents receive isolated reward signals based on their own success.", active: 'reward' },
    { title: "Decentralized Update", desc: "Each actor performs PPO updates individually without global tuning.", active: 'update' }
  ];

  const currentStep = steps[step];

  return (
    <div style={{ marginTop: '20px', padding: '24px', background: 'rgba(168, 85, 247, 0.05)', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
      <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a855f7', marginBottom: '20px', marginTop: 0 }}>
        <Network size={20} />
        Independent MAPPO Actor Process
      </h4>
      
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', height: '280px', justifyContent: 'center', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
          
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around', zIndex: 10, marginBottom: '40px' }}>
            {['Agent A', 'Agent B', 'Agent C'].map((agent, i) => (
              <div key={agent} style={{
                padding: '12px', background: currentStep.active !== 'env' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255,255,255,0.05)',
                borderRadius: '8px', border: '1px solid #555',
                transform: currentStep.active === 'nn' || currentStep.active === 'update' ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.5s', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '70px'
              }}>
                <Server size={20} color={currentStep.active !== 'env' ? '#a855f7' : '#888'} />
                <span style={{ fontSize: '0.65rem', marginTop: '4px' }}>{agent}</span>
              </div>
            ))}
          </div>

          <div style={{
             width: '80%', padding: '16px', background: currentStep.active === 'env' || currentStep.active === 'exec' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)',
             borderRadius: '8px', border: currentStep.active === 'exec' ? '1px dashed #ef4444' : '1px solid #333', transition: 'all 0.5s', textAlign: 'center'
          }}>
            <span style={{fontSize:'0.8rem', color: currentStep.active === 'env' ? '#ef4444' : '#888'}}>Shared Environment Boundary</span>
          </div>

        </div>

        <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center' }}>
          {steps.map((s, idx) => (
            <div key={idx} style={{ 
              padding: '8px 12px', borderRadius: '8px',
              background: step === idx ? 'rgba(255,255,255,0.1)' : 'transparent',
              borderLeft: step === idx ? '4px solid #a855f7' : '4px solid transparent',
              transition: 'all 0.3s',
              opacity: step === idx ? 1 : 0.4
            }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: step === idx ? '#a855f7' : 'var(--text-primary)' }}>
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
