from pathlib import Path

import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="5G Network Slicing Benchmark API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
PHASE2_DIR = BASE_DIR / "outputs_phase2"
PHASE1_DIR = BASE_DIR / "outputs"
PHASE2_DIR.mkdir(parents=True, exist_ok=True)
PHASE1_DIR.mkdir(parents=True, exist_ok=True)


def _pretty_plot_title(path: Path) -> str:
    name = path.stem.replace("_", " ").strip()
    return " ".join(w.capitalize() for w in name.split())


def _list_png_files(folder: Path, url_prefix: str) -> list[dict]:
    if not folder.exists():
        return []
    files = sorted(folder.glob("*.png"))
    return [
        {
            "name": f.name,
            "title": _pretty_plot_title(f),
            "url": f"{url_prefix}/{f.name}",
        }
        for f in files
    ]


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/results")
def get_benchmark_results():
    summary = PHASE2_DIR / "summary_with_ci95.csv"
    raw = PHASE2_DIR / "benchmark_results_phase2.csv"
    legacy = PHASE1_DIR / "benchmark_results.csv"

    if summary.exists():
        return pd.read_csv(summary).to_dict(orient="records")
    if raw.exists():
        return pd.read_csv(raw).to_dict(orient="records")
    if legacy.exists():
        return pd.read_csv(legacy).to_dict(orient="records")
    return {"error": "Benchmark results not found"}


@app.get("/api/plots")
def get_plot_manifest():
    core_phase2 = _list_png_files(PHASE2_DIR / "plots", "/artifacts_phase2/plots")
    publication = _list_png_files(PHASE2_DIR / "plots_publication", "/artifacts_phase2/plots_publication")
    legacy = _list_png_files(PHASE1_DIR / "plots", "/artifacts_phase1/plots")

    return {
        "core": core_phase2,
        "publication": publication,
        "legacy": legacy,
        "counts": {
            "core": len(core_phase2),
            "publication": len(publication),
            "legacy": len(legacy),
        },
    }


app.mount("/artifacts_phase2", StaticFiles(directory=PHASE2_DIR), name="artifacts_phase2")
app.mount("/artifacts_phase1", StaticFiles(directory=PHASE1_DIR), name="artifacts_phase1")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
