import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function StatusMonitor() {
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/research/status');
        setJob(res.data.job);
      } catch (err) {
        console.error("Failed to fetch status:", err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!job) {
    return (
      <div className="glass-panel" style={{ padding: '32px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No active simulation job.</p>
      </div>
    );
  }

  const isRunning = job.status === 'running';
  const isCompleted = job.status === 'completed';
  const isFailed = job.status === 'failed';

  return (
    <div className="glass-panel" style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Live Task Status</h3>
        {isRunning && <Loader2 className="loader-icon" color="var(--accent-primary)" size={20} />}
        {isCompleted && <CheckCircle color="var(--success)" size={20} />}
        {isFailed && <AlertCircle color="var(--danger)" size={20} />}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Current Operation
        </span>
        <p style={{ fontSize: '1rem', fontWeight: 500, marginTop: '4px', lineHeight: 1.4 }}>
          {job.message || 'Initializing...'}
        </p>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
          <span style={{ fontWeight: 600 }}>{Math.round((job.progress || 0) * 100)}%</span>
        </div>
        <div className="progress-container">
          <div 
            className="progress-bar" 
            style={{ 
              width: `${(job.progress || 0) * 100}%`,
              background: isFailed ? 'var(--danger)' : isCompleted ? 'var(--success)' : ''
            }} 
          />
        </div>
      </div>
    </div>
  );
}
