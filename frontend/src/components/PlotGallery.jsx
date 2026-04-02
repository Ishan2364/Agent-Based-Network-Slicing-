import { useState, useEffect } from 'react';
import axios from 'axios';
import { ExternalLink, Layers, BookOpen } from 'lucide-react';
import { getPlotDescription } from '../utils/plotDescriptions';

export default function PlotGallery() {
  const [manifest, setManifest] = useState(null);
  const [activeCategory, setActiveCategory] = useState('publication');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlots = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/plots');
        setManifest(res.data);
      } catch (err) {
        console.error("Failed to fetch plots:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlots();
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', color: 'var(--text-secondary)' }}>Loading analysis results...</div>;
  }

  if (!manifest || manifest.counts.publication === 0 && manifest.counts.core === 0) {
    return (
      <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>No Results Yet</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Run a deep benchmark simulation to generate plots.</p>
      </div>
    );
  }

  const currentPlots = manifest[activeCategory] || [];

  return (
    <div>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <button 
          className={`glass-panel ${activeCategory === 'publication' ? '' : 'inactive'}`}
          style={{ 
            padding: '12px 24px', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: activeCategory === 'publication' ? 'rgba(59, 130, 246, 0.1)' : '',
            borderColor: activeCategory === 'publication' ? 'var(--accent-primary)' : ''
          }}
          onClick={() => setActiveCategory('publication')}
        >
          <BookOpen size={18} color={activeCategory === 'publication' ? 'var(--accent-primary)' : 'var(--text-secondary)'} />
          <span style={{ fontWeight: 600, color: activeCategory === 'publication' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
            Publication Pack ({manifest.counts.publication})
          </span>
        </button>

        <button 
          className={`glass-panel ${activeCategory === 'core' ? '' : 'inactive'}`}
          style={{ 
            padding: '12px 24px', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: activeCategory === 'core' ? 'rgba(139, 92, 246, 0.1)' : '',
            borderColor: activeCategory === 'core' ? 'var(--accent-secondary)' : ''
          }}
          onClick={() => setActiveCategory('core')}
        >
          <Layers size={18} color={activeCategory === 'core' ? 'var(--accent-secondary)' : 'var(--text-secondary)'} />
          <span style={{ fontWeight: 600, color: activeCategory === 'core' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
            Core Metrics ({manifest.counts.core})
          </span>
        </button>
      </div>

      <div className="plot-grid">
        {currentPlots.map((plot, i) => (
          <div key={i} className="plot-card animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
            <a href={`http://localhost:8000${plot.url}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              <div style={{ position: 'relative' }}>
                <img src={`http://localhost:8000${plot.url}`} alt={plot.title} className="plot-img" />
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', padding: '6px', borderRadius: '8px', backdropFilter: 'blur(4px)' }}>
                  <ExternalLink size={16} color="white" />
                </div>
              </div>
              <div className="plot-caption" style={{ paddingBottom: '4px' }}>
                {plot.title}
              </div>
              <p style={{ margin: '0 16px 16px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4', paddingBottom: '8px' }}>
                {getPlotDescription(plot.name || plot.title)}
              </p>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
