from __future__ import annotations

from typing import Dict

import numpy as np

from src.algorithms.base import AlgorithmOutput, BaseAllocator


class CADMMAllocator(BaseAllocator):
    def __init__(
        self,
        s: int,
        k: int,
        m: int,
        b_k: np.ndarray,
        c_m: np.ndarray,
        t_agg: float,
        rounds: int = 12,
        rho: float = 0.8,
        tol_pri: float = 1e-2,
        tol_dual: float = 1e-2,
        adaptive_rho: bool = True,
    ):
        super().__init__("C_ADMM")
        self.s = s
        self.k = k
        self.m = m
        self.b_k = b_k
        self.c_m = c_m
        self.t_agg = t_agg
        self.rounds = rounds
        self.rho = rho
        self.tol_pri = tol_pri
        self.tol_dual = tol_dual
        self.adaptive_rho = adaptive_rho

    def act(self, state: Dict[str, np.ndarray]) -> AlgorithmOutput:
        lam = state["lambda"]
        demand = lam / np.maximum(np.mean(lam), 1.0)
        channel = state["channel"]

        b = np.outer(demand, self.b_k / np.maximum(np.sum(self.b_k), 1e-9))
        c = np.outer(demand, self.c_m / np.maximum(np.sum(self.c_m), 1e-9))
        tau = demand * self.t_agg / np.maximum(np.sum(demand), 1e-9)

        x = np.zeros((self.s, self.m), dtype=int)
        for s_idx in range(self.s):
            x[s_idx, int(np.argmax(channel[s_idx]) % self.m)] = 1
        c = c * x

        z_b = b.copy()
        z_c = c.copy()
        z_t = tau.copy()
        l_b = np.zeros_like(b)
        l_c = np.zeros_like(c)
        l_t = np.zeros_like(tau)

        rho = float(self.rho)
        r_pri = 0.0
        r_dual = 0.0
        rounds_used = 0

        for r in range(self.rounds):
            rounds_used = r + 1
            # Step 1: Local primal updates.
            b = np.maximum(0.0, z_b - l_b / max(rho, 1e-9) + 0.05 * demand[:, None])

            c_target = np.maximum(0.0, z_c - l_c / max(rho, 1e-9) + 0.05 * demand[:, None])
            x.fill(0)
            for s_idx in range(self.s):
                m_idx = int(np.argmax(c_target[s_idx]))
                x[s_idx, m_idx] = 1
            c = c_target * x

            tau = np.maximum(0.0, z_t - l_t / max(rho, 1e-9) + 0.05 * demand)

            # Step 2: Consensus updates.
            z_b_prev = z_b.copy()
            z_c_prev = z_c.copy()
            z_t_prev = z_t.copy()
            z_b = self._project_capacity(b + l_b / max(rho, 1e-9), self.b_k)
            z_c = self._project_capacity(c + l_c / max(rho, 1e-9), self.c_m)
            z_t = self._project_scalar(tau + l_t / max(rho, 1e-9), self.t_agg)

            # Step 3: Dual updates (unscaled form).
            l_b = l_b + rho * (b - z_b)
            l_c = l_c + rho * (c - z_c)
            l_t = l_t + rho * (tau - z_t)

            # Step 4: Residual checks.
            r_pri = float(np.sqrt(np.sum((b - z_b) ** 2) + np.sum((c - z_c) ** 2) + np.sum((tau - z_t) ** 2)))
            r_dual = float(
                rho * np.sqrt(np.sum((z_b - z_b_prev) ** 2) + np.sum((z_c - z_c_prev) ** 2) + np.sum((z_t - z_t_prev) ** 2))
            )
            if r_pri < self.tol_pri and r_dual < self.tol_dual:
                break

            # Step 5: Adaptive penalty (residual balancing).
            if self.adaptive_rho and r_pri > 0 and r_dual > 0:
                if r_pri > 10.0 * r_dual:
                    rho *= 2.0
                    l_b /= 2.0
                    l_c /= 2.0
                    l_t /= 2.0
                elif r_dual > 10.0 * r_pri:
                    rho /= 2.0
                    l_b *= 2.0
                    l_c *= 2.0
                    l_t *= 2.0

        self.rho = float(np.clip(rho, 1e-3, 100.0))
        return AlgorithmOutput(
            actions={"b": z_b, "c": z_c, "tau": z_t, "x": x},
            aux={"r_pri": r_pri, "r_dual": r_dual, "rounds": float(rounds_used), "rho": float(self.rho)},
        )

    @staticmethod
    def _project_capacity(mat: np.ndarray, caps: np.ndarray) -> np.ndarray:
        out = np.maximum(0.0, mat.copy())
        for j in range(out.shape[1]):
            col_sum = np.sum(out[:, j])
            if col_sum > caps[j]:
                out[:, j] *= caps[j] / max(col_sum, 1e-9)
        return out

    @staticmethod
    def _project_scalar(vec: np.ndarray, cap: float) -> np.ndarray:
        out = np.maximum(0.0, vec.copy())
        total = np.sum(out)
        if total > cap:
            out *= cap / max(total, 1e-9)
        return out
