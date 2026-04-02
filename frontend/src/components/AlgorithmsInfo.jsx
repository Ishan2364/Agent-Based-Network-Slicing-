import { Info, Network, Box, Layers, Zap, Cpu, Server } from 'lucide-react';
import CadmmVisualization from './CadmmVisualization';
import MaanPpoVisualization from './MaanPpoVisualization';
import IndMappoPpoVisualization from './IndMappoPpoVisualization';
import StaticGreedyVisualization from './StaticGreedyVisualization';
import OmdBanditVisualization from './OmdBanditVisualization';

export default function AlgorithmsInfo() {
  const algorithms = [
    {
      name: "MAAN_PPO",
      icon: <Zap size={24} color="#00f0ff" />,
      role: "Centralised AI Orchestrator",
      description: "Our flagship Multi-Agent Attention Network driven by Proximal Policy Optimization (PPO). Unlike standard reinforcement learning, MAAN_PPO utilizes Multi-Head Attention to process the raw network state—allowing the agent to dynamically weigh and isolate bottleneck slices. It outputs soft dual 'price' signals that govern the probability distributions of resource configurations. The critic network calculates advantage estimations, while the PPO actor clips policy gradients to ensure stable, monotonic convergence towards maximum global Quality of Service (QoS).",
      color: "rgba(0, 240, 255, 0.08)",
      borderColor: "#00f0ff"
    },
    {
      name: "Ind. MAPPO_PPO",
      icon: <Server size={24} color="#ff0055" />,
      role: "Decentralised Uncoordinated Baseline",
      description: "Independent MAPPO spawns completely isolated Actor-Critic neural networks for each respective 5G slice (eMBB, URLLC, mMTC). These independent agents observe strictly local telemetry metrics without visibility into the central capacity. Operating selfishly via independent PPO updates, they blindly emit resource requests. In scenarios where aggregate demand breaches physical bandwidth, the environment's hard physics forces a crude resolution (dropping traffic). This algorithms acts as the absolute baseline to mathematically prove the necessity of coordination mechanisms.",
      color: "rgba(255, 0, 85, 0.08)",
      borderColor: "#ff0055"
    },
    {
      name: "C_ADMM",
      icon: <Layers size={24} color="#00fa9a" />,
      role: "Distributed Optimization Consensus",
      description: "Consensus Alternating Direction Method of Multipliers (ADMM) is a mathematical powerhouse for distributed convex optimization. Instead of a neural network guessing policies, C_ADMM solves exact capacity allocations analytically. It relaxes the rigid global bandwidth constraints using an Augmented Lagrangian formulation. Individual slices independently minimize this Lagrangian locally (computing optimal x_i), and a central coordinator aggregates these requests to update dual variables (λ). This acts as a mathematical penalty, forcing the decentralized slices into an optimal, feasible consensus iteratively.",
      color: "rgba(0, 250, 154, 0.08)",
      borderColor: "#00fa9a"
    },
    {
      name: "Static Greedy",
      icon: <Box size={24} color="#b14bf4" />,
      role: "Deterministic Fallback Baseline",
      description: "The Static Greedy approach bypasses machine learning entirely in favor of highly deterministic, SLA-driven heuristics. Incoming demand vectors are rigidly sorted according to predefined network slice priority (e.g., URLLC traffic is always processed first due to latency criticality, followed by eMBB, then mMTC). Available capacity is carved out proportionately until the resource block pool is empty, rigidly locking the allocation for the duration of the telemetry epoch. It offers zero adaptation to unexpected temporal usage spikes.",
      color: "rgba(177, 75, 244, 0.08)",
      borderColor: "#b14bf4"
    },
    {
      name: "OMD Bandit",
      icon: <Cpu size={24} color="#ffb800" />,
      role: "Online Mirror Descent Exploration",
      description: "Instead of tracking complex internal backpropagation matrices, OMD Bandit relies exclusively on macroscopic real-world feedback loops. At each epoch, the algorithm applies a random exploration vector (perturbation noise) to the current policy weights. It deploys this perturbed allocation into the physical environment and awaits a monolithic 'Cost' signal back. Using this singular Bandit evaluation, it estimates the geometric gradient of the multidimensional policy space. Finally, an Online Mirror Descent projection forces the estimated gradient back onto a feasible probability simplex to update the weights.",
      color: "rgba(255, 184, 0, 0.08)",
      borderColor: "#ffb800"
    }
  ];

  return (
    <div className="algorithms-info animate-fade-in stagger-2">
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }} className="gradient-text">
          <Info size={28} color="var(--accent-primary)" />
          AETHER_OS Algorithm Architecture
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '1.05rem', marginBottom: '32px' }}>
          The AETHER_OS 5G Network Slicing Platform orchestrates massive scaling evaluations across Radio, Compute, and Transport boundaries. Below is a deep architectural dive into the exact theoretical mechanics governing the five benchmarking algorithms under test.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {algorithms.map((alg, i) => (
            <div 
              key={i} 
              className="glass-panel" 
              style={{ 
                padding: '32px', 
                borderLeft: `3px solid ${alg.borderColor}`,
                display: 'flex',
                gap: '24px',
                alignItems: 'flex-start'
              }}
            >
              <div style={{ padding: '12px', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', boxShadow: `0 0 15px ${alg.borderColor}40` }}>
                {alg.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
                  {alg.name}
                </h3>
                <span style={{ 
                  display: 'inline-block', 
                  fontSize: '0.85rem', 
                  fontWeight: 600, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.08em', 
                  color: alg.borderColor, 
                  marginBottom: '16px',
                  background: 'rgba(0,0,0,0.3)',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  {alg.role}
                </span>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0, marginBottom: '24px', fontSize: '1rem' }}>
                  {alg.description}
                </p>
                {alg.name === 'C_ADMM' && <CadmmVisualization />}
                {alg.name === 'MAAN_PPO' && <MaanPpoVisualization />}
                {alg.name === 'Ind. MAPPO_PPO' && <IndMappoPpoVisualization />}
                {alg.name === 'Static Greedy' && <StaticGreedyVisualization />}
                {alg.name === 'OMD Bandit' && <OmdBanditVisualization />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
