# 🛰️ AETHER_OS — Backend Guide (No Frontend Required)

This guide is for running the **Python research engine only** — no browser, no Node.js, no frontend needed.

---

## 📋 What the Backend Does

The backend is a Python application that:

1. **Simulates a 5G network** — models base stations (gNBs), edge compute nodes (MECs), and network slices (eMBB, URLLC, mMTC)
2. **Runs 5 competing algorithms** — each algorithm decides how to allocate bandwidth and compute resources every millisecond
3. **Benchmarks and scores them** — records utility, delay, QoS success rate, and URLLC violation probability across many seeds and load levels
4. **Generates output files** — CSV result tables + 14+ comparison plots as PNG images
5. **Optionally serves a REST API** — so the frontend dashboard can trigger runs and fetch results

---

## ✅ Prerequisites

- **Python 3.10 or newer** — check with `python --version`
- **pip** — check with `pip --version`
- That's it. No Node.js, no database, no Docker.

---

## 🔧 Step 1 — Set Up the Python Environment

Open a terminal and navigate into the backend folder:

```powershell
cd C:\Users\Ojas\Desktop\5G-project\backend
```

### Create a virtual environment

This keeps your project packages isolated from the rest of your system:

```powershell
python -m venv .venv
```

### Activate the virtual environment

**Windows — PowerShell:**
```powershell
.\.venv\Scripts\Activate.ps1
```

> ⚠️ **Permission error?** Run this once, then retry:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

**Windows — Command Prompt (CMD):**
```cmd
.venv\Scripts\activate.bat
```

**macOS / Linux:**
```bash
source .venv/bin/activate
```

✅ You'll know it worked when your terminal prompt shows `(.venv)` at the beginning.

---

## 📦 Step 2 — Install Dependencies

With the virtual environment active:

```powershell
pip install -r requirements.txt
```

This installs these packages:

| Package | What it's used for |
|---------|-------------------|
| `numpy` | Core math — channel simulation, PRB scheduling, array operations |
| `pandas` | Result tables — reading/writing CSV files, groupby aggregations |
| `matplotlib` | Plotting — all 14+ PNG charts |
| `torch` | Neural networks — PPO policy training for MAAN and MAPPO algorithms |
| `scipy` | Statistics — Wilcoxon tests, 95% confidence intervals |
| `fastapi` | REST API — only needed if you want the web server |
| `uvicorn` | ASGI server — only needed to serve the API |

> ⚠️ **PyTorch (torch) note:** the default `pip install torch` gets the CPU version, which is fine for running experiments. If you have an NVIDIA GPU and want faster PPO training, visit [pytorch.org](https://pytorch.org/get-started/locally/) to get the CUDA build instead.

**Verify the install worked:**
```powershell
python -c "import numpy, pandas, matplotlib, torch, scipy, fastapi; print('All good!')"
```

---

## 🧪 Step 3 — Run an Experiment

> ⚠️ All commands below must be run from inside the `backend/` folder with the virtual environment active.

### Option A — Quick Phase 1 Benchmark

Runs all 5 algorithms across a basic set of load conditions. Faster, good for a first test.

```powershell
python -m src.experiments.run_benchmark
```

**What happens:**
- Simulates 5 algorithms × multiple seeds × load scales
- Prints progress to the terminal
- Saves all results to `backend/outputs/`

**Expected runtime:** ~2–5 minutes on a modern CPU

**Output files:**
```
backend/outputs/
├── benchmark_results.csv     ← raw per-timestep data for every run
└── plots/
    ├── utility_mean_vs_load.png
    ├── qos_success_vs_load.png
    ├── delay_mean_vs_load.png
    └── ...  (14 charts total)
```

---

### Option B — Full Phase 2 Benchmark (Recommended)

This is the complete research-grade run. It uses more seeds, sweeps more load levels, computes 95% confidence intervals, and runs statistical significance tests between algorithms.

```powershell
python -m src.experiments.run_benchmark_phase2
```

**What happens:**
1. Generates common stochastic traces (traffic λ and channel gains) so all algorithms are evaluated on the identical random scenarios
2. Runs all 5 algorithms: `MAAN_PPO`, `Independent_MAPPO_PPO`, `C_ADMM`, `Static_Greedy`, `OMD_BF`
3. Sweeps 5 load scales: `0.8, 1.0, 1.2, 1.4, 1.6`
4. Repeats with 6 independent seeds
5. Aggregates results with 95% CI bands
6. Runs pairwise Welch t-tests (MAAN_PPO vs all others)
7. Saves all CSVs and 14 core plots + 6 publication plots

**Expected runtime:** ~5–20 minutes (depends on your CPU and PPO training speed)

**Output files:**
```
backend/outputs_phase2/
├── benchmark_results_phase2.csv        ← full raw data (~millions of rows)
├── summary_with_ci95.csv               ← per-algorithm means + CI per load level
├── statistical_significance.csv        ← p-values for all pairwise comparisons
├── config_used.json                    ← exact settings used for this run
├── plots/                              ← core diagnostic charts
│   ├── utility_mean_vs_load.png
│   ├── qos_success_vs_load.png
│   ├── delay_mean_vs_load.png
│   ├── rate_mean_vs_load.png
│   ├── fairness_jain_vs_load.png
│   ├── radio_util_vs_load.png
│   ├── compute_util_vs_load.png
│   ├── transport_util_vs_load.png
│   ├── urlcc_delay_vs_load.png
│   ├── embb_rate_vs_load.png
│   ├── d_radio_vs_load.png
│   ├── d_trans_vs_load.png
│   ├── d_comp_vs_load.png
│   └── urlcc_violation_prob_saa_vs_load.png
└── plots_publication/                  ← publication-quality figures
    ├── convergence_utility_mean_high_load.png
    ├── convergence_qos_success_high_load.png
    ├── convergence_urlcc_delay_high_load.png
    ├── urlcc_delay_cdf_high_load.png
    ├── urlcc_delay_ccdf_high_load.png
    ├── utility_mean_boxplot_by_load.png
    ├── utility_mean_violin_by_load.png
    ├── pareto_utility_vs_qos.png
    ├── pareto_utility_vs_delay.png
    ├── significance_heatmap_utility.png
    ├── significance_heatmap_qos_success.png
    ├── significance_heatmap_delay.png
    ├── cadmm_primal_residual_vs_t.png
    ├── cadmm_dual_residual_vs_t.png
    ├── cadmm_rounds_vs_utility.png
    ├── cadmm_avg_rounds_vs_load.png
    └── runtime_overall_bar.png
```

---

### Option C — Ablation Studies

Runs targeted ablation experiments comparing specific algorithm variants:

```powershell
python -m src.experiments.run_ablations
```

---

### Option D — API Server (Optional)

If you want the REST API running (to connect the frontend later, or to trigger experiments remotely):

```powershell
python main.py
```

Or with uvicorn directly:

```powershell
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API starts at `http://localhost:8000`. Visit `http://localhost:8000/docs` for interactive API docs.

---

## 🔬 Understanding the Experiment Parameters

The Phase 2 benchmark is controlled by `ExpConfig` at the top of `run_benchmark_phase2.py`:

```python
@dataclass
class ExpConfig:
    horizon: int = 500          # Number of time slots (TTIs) per episode
    seeds: int = 6              # How many independent random seeds to run
    n_mc_urlcc: int = 64        # SAA samples for URLLC chance-constraint check
    load_scales: tuple = (0.8, 1.0, 1.2, 1.4, 1.6)  # Traffic load multipliers
    num_slices: int = 3         # Number of network slices (eMBB + URLLC + mMTC)
    out_dir: str = "outputs_phase2"
```

**To run a faster test** (e.g. while debugging), edit these values temporarily — fewer seeds and a shorter horizon dramatically reduce runtime:

```python
# Quick test config (edit run_benchmark_phase2.py temporarily)
cfg = ExpConfig(
    horizon=100,    # was 500
    seeds=2,        # was 6
    n_mc_urlcc=16,  # was 64
    load_scales=(0.8, 1.2, 1.6),  # was 5 values
)
```

Or pass a custom config when calling from another script:

```python
from src.experiments.run_benchmark_phase2 import ExpConfig, run_experiment, save_tables, plot_all

cfg = ExpConfig(horizon=100, seeds=2)
result = run_experiment(cfg)
result.to_csv("my_results.csv", index=False)
```

---

## 📊 The 5 Algorithms

All algorithms compete in the same `FiveGEnvironment`, which models a real 5G radio access network:

| Algorithm | Internal Name | What it does |
|-----------|--------------|-------------|
| **MAAN_PPO** | `MAANPPOAllocator` | PPO neural agent that learns from dual-price signals. Penalises URLLC delay violations with a local QoS penalty term. |
| **Independent MAPPO_PPO** | `IndependentMAPPOPPOAllocator` | Per-slice PPO agents with no coordination or price signals. Decentralised baseline. |
| **C_ADMM** | `CADMMAllocator` | Consensus ADMM. Iterates across slices to reach a jointly feasible resource allocation. Tracks primal/dual residuals to stop early. |
| **Static Greedy** | `StaticGreedyAllocator` | Fixed proportional weights with greedy QoS repair. Never adapts — the baseline floor every other algorithm must beat. |
| **OMD Bandit (OMD_BF)** | `OMDBanditAllocator` | Online Mirror Descent with random perturbation-based gradient estimation. Zero-order / black-box method. |

---

## 🌍 The Network Environment

The `FiveGEnvironment` (`src/environment/fiveg_env.py`) models these physical components:

| Component | Default | Description |
|-----------|---------|-------------|
| Network slices (S) | 3 | eMBB (video/broadband), URLLC (low-latency), mMTC (IoT) |
| Base stations / gNBs (K) | 3 | Each has 160 PRB (Physical Resource Block) budget |
| MEC nodes (M) | 3 | Each has 350 compute units |
| Backhaul capacity | 420 units | Shared transport across all slices |
| Channel model | Rayleigh fading | Channel gains drawn from exponential distribution each TTI |
| Traffic model | Uniform random λ | Packet arrival rates in [0.8M, 4.2M] packets/sec per slice |
| TTI duration | 1 ms | Each time step = one 5G scheduling slot |

**Per-slice QoS requirements** (default / load_scale = 1.0):

| Slice | Min Rate (r_min) | Max Delay (d_max) | Service type |
|-------|-----------------|-------------------|-------------|
| eMBB | 45 Mbps | 28 ms | Broadband video |
| URLLC | 15 Mbps | 8 ms | Ultra-low latency |
| mMTC | 6 Mbps | 50 ms | IoT / sensor |

---

## 📈 Reading the Output CSVs

### `summary_with_ci95.csv`

The most useful file for comparing algorithms. Columns you care about:

| Column | Meaning |
|--------|---------|
| `algorithm` | Algorithm name |
| `load_scale` | Traffic load multiplier |
| `utility_mean_mean` | Average utility score (higher = better) |
| `utility_mean_ci95` | 95% confidence interval half-width |
| `qos_success_mean` | Fraction of time slots where ALL slices met QoS targets |
| `delay_mean_mean` | Average end-to-end delay in seconds |
| `urlcc_violation_prob_saa_mean` | Estimated probability URLLC delay exceeded d_max |
| `fairness_jain_mean` | Jain's Fairness Index across slices (1.0 = perfectly fair) |

### `statistical_significance.csv`

Shows whether the utility/QoS/delay gap between MAAN_PPO and each other algorithm is statistically significant:

| Column | Meaning |
|--------|---------|
| `utility_mean_pval_vs_MAAN_PPO` | p-value from Welch t-test; < 0.05 = significant |

---

## 🛠️ Troubleshooting

### Virtual environment activation fails (PowerShell)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### `No module named 'torch'` error
```powershell
pip install torch --index-url https://download.pytorch.org/whl/cpu
```

### `No module named 'src'` error
Make sure you're running commands **from inside the `backend/` folder**, not from the project root:
```powershell
cd C:\Users\Ojas\Desktop\5G-project\backend
python -m src.experiments.run_benchmark_phase2
```

### Experiment is very slow
Reduce the config to a quick test run:
```powershell
# Temporarily edit run_benchmark_phase2.py and change:
# horizon=500 → horizon=100
# seeds=6 → seeds=2
```

### `outputs_phase2` folder is empty / plots missing
The folder is created automatically when you run the benchmark. If it exists but is empty, the experiment likely crashed mid-run. Check the terminal output for the error message.

### Memory error during PPO training
Reduce `n_mc_urlcc` (SAA samples) and `horizon` in `ExpConfig`. If running on a low-RAM machine, try `seeds=1` first.

---

## ⚡ Quick Reference

```powershell
# 1. Navigate to backend
cd C:\Users\Ojas\Desktop\5G-project\backend

# 2. Activate virtual environment (Windows PowerShell)
.\.venv\Scripts\Activate.ps1

# 3a. Run quick Phase 1 benchmark
python -m src.experiments.run_benchmark

# 3b. Run full Phase 2 benchmark (recommended)
python -m src.experiments.run_benchmark_phase2

# 3c. Start the REST API server (optional)
python main.py
```

Results → `backend/outputs/` (Phase 1) or `backend/outputs_phase2/` (Phase 2)
