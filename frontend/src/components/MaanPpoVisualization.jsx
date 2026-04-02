import React, { useState, useEffect } from 'react';
import { Zap, Cpu, Database, Activity } from 'lucide-react';

export default function MaanPpoVisualization() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => (s + 1) % 8);
    }, 4000); // 4 seconds per step
    return () => clearInterval(timer);
  }, []);

  const steps = [
    { title: "Initialize Agent", desc: "Central MAAN_PPO agent readies its parameters for the current epoch.", active: 'agent_init' },
    { title: "Gather Observations", desc: "Collect telemetry payload across all 3 slices simultaneously.", active: 'telemetry' },
    { title: "Attention Mechanism", desc: "Multi-head attention focuses tightly on critical bottleneck slices.", active: 'attention' },
    { title: "Actor Network", desc: "Feed embedded states through the deep policy network layers.", active: 'actor' },
    { title: "Generate Actions", desc: "Output dual price signals mapping to continuous resource probabilities.", active: 'actions' },
    { title: "Resource Allocation", desc: "Apply physical allocations in the environment based on PPO outputs.", active: 'env' },
    { title: "Calculate Reward", desc: "Evaluate total system QoS utility versus SLA stringency penalties.", active: 'reward' },
    { title: "Policy Update", desc: "Perform Proximal Policy Optimization clipping and network weight backprop.", active: 'ppo_update' }
  ];

  const currentStep = steps[step];

  return (
    <div style={{ marginTop: '20px', padding: '24px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
      <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', marginBottom: '20px', marginTop: 0 }}>
        <Zap size={20} className={step === 7 ? "animate-pulse" : ""} />
        MAAN_PPO Execution Pipeline
      </h4>
      
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', height: '280px', justifyContent: 'center', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', alignItems: 'center', zIndex: 10 }}>
            {/* Top: Environment */}
            <div style={{
               padding: '12px 24px', background: currentStep.active === 'env' || currentStep.active === 'telemetry' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.05)',
               borderRadius: '8px', border: '1px solid #333', transition: 'all 0.5s'
            }}>
              <Database size={24} color={currentStep.active === 'env' ? '#3b82f6' : '#888'} />
              <span style={{marginLeft:'8px', fontSize:'0.8rem'}}>5G Environment</span>
            </div>

            {/* Middle: Agent Internals */}
            <div style={{
               display: 'flex', gap: '12px', padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px dashed #555', borderRadius: '12px', alignItems: 'center'
            }}>
               <div style={{ padding:'8px', background: currentStep.active === 'attention' ? 'rgba(168, 85, 247, 0.3)' : 'transparent', borderRadius:'8px', transition: 'all 0.5s' }}>
                 <Activity size={24} color={currentStep.active === 'attention' ? '#a855f7' : '#555'} />
                 <div style={{fontSize:'0.6rem', marginTop:'4px'}}>Attention</div>
               </div>
               <div style={{ height: '2px', width: '20px', background: '#555' }}></div>
               <div style={{ padding:'8px', background: currentStep.active === 'actor' || currentStep.active === 'ppo_update' ? 'rgba(59, 130, 246, 0.4)' : 'transparent', borderRadius:'8px', transition: 'all 0.5s', transform: currentStep.active === 'ppo_update' ? 'scale(1.1)' : 'scale(1)' }}>
                 <Cpu size={32} color={currentStep.active === 'actor' || currentStep.active === 'ppo_update' ? '#3b82f6' : '#555'} />
                 <div style={{fontSize:'0.6rem', marginTop:'4px'}}>PPO Actor</div>
               </div>
            </div>

            {/* Bottom: Reward/Outputs */}
            <div style={{
               display: 'flex', gap: '20px'
            }}>
               <div style={{ padding:'8px 16px', background: currentStep.active === 'actions' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)', borderRadius:'8px', border: '1px solid #333', transition: 'all 0.5s'}}>
                 <span style={{fontSize:'0.75rem', color: currentStep.active === 'actions' ? '#10b981' : '#888'}}>Actions</span>
               </div>
               <div style={{ padding:'8px 16px', background: currentStep.active === 'reward' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255,255,255,0.05)', borderRadius:'8px', border: '1px solid #333', transition: 'all 0.5s'}}>
                 <span style={{fontSize:'0.75rem', color: currentStep.active === 'reward' ? '#fbbf24' : '#888'}}>Reward</span>
               </div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center' }}>
          {steps.map((s, idx) => (
            <div key={idx} style={{ 
              padding: '8px 12px', borderRadius: '8px',
              background: step === idx ? 'rgba(255,255,255,0.1)' : 'transparent',
              borderLeft: step === idx ? '4px solid #3b82f6' : '4px solid transparent',
              transition: 'all 0.3s',
              opacity: step === idx ? 1 : 0.4
            }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: step === idx ? '#3b82f6' : 'var(--text-primary)' }}>
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
