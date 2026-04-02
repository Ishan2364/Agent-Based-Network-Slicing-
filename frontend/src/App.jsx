import { useState } from 'react';
import { Activity, ImageIcon, Settings, Cpu, BookOpen } from 'lucide-react';
import JobControl from './components/JobControl';
import StatusMonitor from './components/StatusMonitor';
import PlotGallery from './components/PlotGallery';
import AlgorithmsInfo from './components/AlgorithmsInfo';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ padding: '0 16px 32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Cpu color="var(--accent-primary)" size={32} style={{ filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.6))' }} />
          <h2 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }} className="gradient-text">Aether_OS</h2>
        </div>
        
        <button 
          className={`nav-item ${activeTab === 'dashboard' ? 'active active-blue' : ''}`}
          onClick={() => setActiveTab('dashboard')}
          style={{ background: 'transparent', textAlign: 'left' }}
        >
          <Activity size={20} color={activeTab === 'dashboard' ? 'var(--accent-primary)' : 'var(--text-secondary)'} />
          <span>Dashboard</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'gallery' ? 'active active-purple' : ''}`}
          onClick={() => setActiveTab('gallery')}
          style={{ background: 'transparent', textAlign: 'left' }}
        >
          <ImageIcon size={20} color={activeTab === 'gallery' ? 'var(--accent-tertiary)' : 'var(--text-secondary)'} />
          <span>Plots Gallery</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'algorithms' ? 'active active-magenta' : ''}`}
          onClick={() => setActiveTab('algorithms')}
          style={{ background: 'transparent', textAlign: 'left' }}
        >
          <BookOpen size={20} color={activeTab === 'algorithms' ? 'var(--accent-secondary)' : 'var(--text-secondary)'} />
          <span>Algorithms</span>
        </button>
        <button 
          className="nav-item"
          style={{ background: 'transparent', textAlign: 'left', marginTop: 'auto', opacity: 0.5 }}
          disabled
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="animate-fade-in stagger-1">
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
            {activeTab === 'dashboard' ? 'Simulation Control' 
             : activeTab === 'algorithms' ? 'Algorithms Overview'
             : 'Analysis Results'}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {activeTab === 'dashboard' 
              ? 'Configure and launch massive multi-algorithm evaluations.'
              : activeTab === 'algorithms'
              ? 'Learn about the 5G slicing algorithms being benchmarked.'
              : 'View generated insights across different scaling loads.'}
          </p>
        </header>

        {activeTab === 'dashboard' && (
          <div className="bento-grid animate-fade-in stagger-2">
            <div className="col-span-8">
              <JobControl />
            </div>
            <div className="col-span-4">
              <StatusMonitor />
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="animate-fade-in stagger-2">
            <PlotGallery />
          </div>
        )}

        {activeTab === 'algorithms' && (
          <AlgorithmsInfo />
        )}
      </main>
    </div>
  );
}
