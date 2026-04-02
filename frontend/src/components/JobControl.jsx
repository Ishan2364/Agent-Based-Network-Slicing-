import { useState } from 'react';
import axios from 'axios';
import { Play } from 'lucide-react';

export default function JobControl() {
  const [config, setConfig] = useState({
    horizon: 300,
    seeds: 4,
    num_slices: 3,
    load_center: 1.2,
    n_mc_urlcc: 32
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: parseFloat(e.target.value) });
  };

  const startJob = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post('http://localhost:8000/api/research/start', config);
      setMessage(`Job started! ID: ${res.data.job.job_id}`);
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Failed to start job.');
    }
    setLoading(false);
  };

  return (
    <div className="glass-panel" style={{ padding: '32px' }}>
      <h3 style={{ marginBottom: '24px', fontSize: '1.25rem' }}>Simulation Parameters</h3>
      
      <div className="bento-grid" style={{ marginBottom: '32px' }}>
        <div className="col-span-6 input-group">
          <label className="input-label">Horizon (Timesteps)</label>
          <input type="number" name="horizon" value={config.horizon} onChange={handleChange} className="input-field" min="50" max="1500" />
        </div>
        <div className="col-span-6 input-group">
          <label className="input-label">Random Seeds</label>
          <input type="number" name="seeds" value={config.seeds} onChange={handleChange} className="input-field" min="1" max="10" />
        </div>
        <div className="col-span-4 input-group">
          <label className="input-label">Number of Slices</label>
          <input type="number" name="num_slices" value={config.num_slices} onChange={handleChange} className="input-field" min="3" max="12" />
        </div>
        <div className="col-span-4 input-group">
          <label className="input-label">Base Load Scale</label>
          <input type="number" step="0.1" name="load_center" value={config.load_center} onChange={handleChange} className="input-field" min="0.6" max="2.0" />
        </div>
        <div className="col-span-4 input-group">
          <label className="input-label">URLLC Monte Carlo</label>
          <input type="number" name="n_mc_urlcc" value={config.n_mc_urlcc} onChange={handleChange} className="input-field" min="4" max="256" />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={startJob} disabled={loading} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Play size={18} fill="white" />
          Start Evaluation
        </button>
        {message && (
          <span style={{ color: message.includes('Failed') ? 'var(--danger)' : 'var(--success)', fontWeight: 500 }}>
            {message}
          </span>
        )}
      </div>
    </div>
  );
}
