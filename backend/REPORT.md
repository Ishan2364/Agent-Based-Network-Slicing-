# Agentic 5G Network Slicing - Implementation Report

## Current Alignment Status

This backend now implements a benchmark framework aligned with the two PDFs around:

1. Distributed multi-resource slicing (radio/compute/transport + MEC association)
2. Five algorithm tracks (`MAAN_PPO`, `Independent_MAPPO_PPO`, `C_ADMM`, `Static_Greedy`, `OMD_BF`)
3. Shared environment constraints and post-enforcement metric evaluation
4. URLLC chance-constraint evaluation via SAA
5. 12-14 cross-algorithm plots under load scaling

## Key Technical Updates

- Added `scipy` to dependencies for statistical significance tests.
- Added exogenous trace support in `FiveGEnvironment` so all algorithms can be evaluated on common random streams.
- Separated rollout RNG and SAA RNG in environment to avoid evaluation leakage into scenario dynamics.
- Updated PRB residual rounding to prefer higher marginal utility slices.
- Extended state with `prev_rates` and `prev_delays` for richer local observations.
- Refactored benchmark drivers to run each algorithm on identical traces per seed/load.
- Upgraded `Static_Greedy` to include delay-aware MEC association, stability clipping, and greedy QoS repair loops.
- Upgraded `OMD_BF` to include perturbation-based bandit gradient estimation, clipped scalar reward, and projected price updates.
- Upgraded PPO variants with price-aware / price-free reward separation, local penalties, and damped dual-price updates.
- Upgraded `C_ADMM` with residual-based stopping and adaptive-`rho` balancing.

## Project Structure

- `src/environment/fiveg_env.py`: environment dynamics, enforcement, metrics, SAA.
- `src/algorithms/*.py`: all five algorithm implementations.
- `src/experiments/run_benchmark.py`: phase-1 benchmark + 14 plots.
- `src/experiments/run_benchmark_phase2.py`: phase-2 benchmark + CI/significance + 14 plots.

## How To Run

```bash
pip install -r requirements.txt
python -m src.experiments.run_benchmark
python -m src.experiments.run_benchmark_phase2
```

Outputs include:

- `outputs/benchmark_results.csv`
- `outputs/plots/*.png`
- `outputs_phase2/benchmark_results_phase2.csv`
- `outputs_phase2/summary_with_ci95.csv`
- `outputs_phase2/statistical_significance.csv`
- `outputs_phase2/plots/*.png`
