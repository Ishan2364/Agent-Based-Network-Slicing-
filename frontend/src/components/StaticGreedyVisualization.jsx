import React, { useState, useEffect } from 'react';
import { Box, ArrowDownToLine, Lock } from 'lucide-react';

export default function StaticGreedyVisualization() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => (s + 1) % 8);
    }, 4000); // 4 seconds per step
    return () => clearInterval(timer);
  }, []);

  const steps = [
    { title: "Receive Traffic Demands", desc: "Incoming traffic demands arrive from all 3 slices.", active: 'demands' },
    { title: "Apply Priority Logic", desc: "Hard-coded rules enforce strict priority sequencing.", active: 'sort' },
    { title: "Process Highest Priority", desc: "URLLC slice is evaluated first regardless of other needs.", active: 'urllc' },
    { title: "Allocate to URLLC", desc: "Proportional rules lock resources blindly to the high-priority slice.", active: 'alloc_u' },
    { title: "Process Medium Priority", desc: "eMBB slice is evaluated next based on remaining capacity.", active: 'embb' },
    { title: "Allocate to eMBB", desc: "Proportional rules allocate to the medium-priority slice.", active: 'alloc_e' },
    { title: "Fill Remaining (mMTC)", desc: "Lowest priority slice (mMTC) gets whatever capacity is left over.", active: 'mmtc' },
    { title: "Lock Epoch Target", desc: "Allocations are locked. No adaptation occurs until next static phase.", active: 'lock' }
  ];

  const currentStep = steps[step];

  return (
    <div style={{ marginTop: '20px', padding: '24px', background: 'rgba(148, 163, 184, 0.05)', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
      <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', marginBottom: '20px', marginTop: 0 }}>
        <Box size={20} />
        Static Greedy Allocation Flow
      </h4>
      
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', height: '280px', justifyContent: 'center', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', alignItems: 'center', zIndex: 10 }}>
             
             {/* Slices Priority Stack */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '60%' }}>
                <div style={{ padding: '8px', background: currentStep.active === 'urllc' || currentStep.active === 'alloc_u' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.05)', borderRadius: '4px', borderLeft: '4px solid #ef4444', transition: 'all 0.4s', opacity: step >= 2 ? 1 : 0.5 }}>
                   1. URLLC (High Priority)
                </div>
                <div style={{ padding: '8px', background: currentStep.active === 'embb' || currentStep.active === 'alloc_e' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.05)', borderRadius: '4px', borderLeft: '4px solid #3b82f6', transition: 'all 0.4s', opacity: step >= 4 ? 1 : 0.5 }}>
                   2. eMBB (Medium Priority)
                </div>
                <div style={{ padding: '8px', background: currentStep.active === 'mmtc' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(255,255,255,0.05)', borderRadius: '4px', borderLeft: '4px solid #a855f7', transition: 'all 0.4s', opacity: step >= 6 ? 1 : 0.5 }}>
                   3. mMTC (Low Priority)
                </div>
             </div>

             <ArrowDownToLine size={24} color="#555" />

             {/* Network Capacity Box */}
             <div style={{ width: '80%', padding: '16px', background: currentStep.active === 'lock' ? '#334155' : 'rgba(255,255,255,0.02)', border: '1px solid #475569', borderRadius: '8px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <Lock size={16} style={{ position: 'absolute', right: '8px', top: '8px', opacity: currentStep.active === 'lock' ? 1 : 0.2 }} color="#94a3b8" />
                Network Capacity Allocation
                
                {/* Visual Fill Bars */}
                <div style={{ display: 'flex', height: '10px', width: '100%', marginTop: '12px', background: '#222', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: step >= 3 ? '40%' : '0%', background: '#ef4444', transition: 'width 0.5s' }}></div>
                    <div style={{ width: step >= 5 ? '45%' : '0%', background: '#3b82f6', transition: 'width 0.5s' }}></div>
                    <div style={{ width: step >= 6 ? '15%' : '0%', background: '#a855f7', transition: 'width 0.5s' }}></div>
                </div>
             </div>
          </div>

        </div>

        <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center' }}>
          {steps.map((s, idx) => (
            <div key={idx} style={{ 
              padding: '8px 12px', borderRadius: '8px',
              background: step === idx ? 'rgba(255,255,255,0.1)' : 'transparent',
              borderLeft: step === idx ? '4px solid #94a3b8' : '4px solid transparent',
              transition: 'all 0.3s',
              opacity: step === idx ? 1 : 0.4
            }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: step === idx ? '#94a3b8' : 'var(--text-primary)' }}>
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
