"""
Upload router — allows users to upload input CSV files
so the engine can process them and produce fresh analytics outputs.

Flow:
  POST /api/v1/upload  (multipart)
  → Save files to data/ directory
  → Run main pipeline (DataLoader → Detectors → FusionEngine → Writers)
  → Return summary of processing result

The Streamlit dashboard/app.py remains for developer use only.
"""
import os
import sys
import shutil
import tempfile
from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List

_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if _ROOT not in sys.path:
    sys.path.insert(0, _ROOT)

router = APIRouter(prefix="/upload", tags=["upload"])

ALLOWED_FILES = {
    "accelerometer_data.csv",
    "audio_intensity_data.csv",
    "trips.csv",
    "drivers.csv",
    "driver_goals.csv",
    "earnings_velocity_log.csv",
}


@router.post("")
async def upload_csvs(files: List[UploadFile] = File(...)):
    """
    Accept 1-6 CSV files, save to data/, run the analytics pipeline,
    return a result summary.
    """
    data_dir = os.path.join(_ROOT, "data")
    outputs_dir = os.path.join(_ROOT, "outputs")
    os.makedirs(data_dir, exist_ok=True)
    os.makedirs(outputs_dir, exist_ok=True)

    saved = []
    rejected = []

    for upload in files:
        fname = os.path.basename(upload.filename or "")
        if fname not in ALLOWED_FILES:
            rejected.append(fname)
            continue
        dest = os.path.join(data_dir, fname)
        content = await upload.read()
        with open(dest, "wb") as f:
            f.write(content)
        saved.append(fname)

    if not saved:
        raise HTTPException(
            status_code=400,
            detail=f"No valid files uploaded. Accepted: {sorted(ALLOWED_FILES)}. Rejected: {rejected}",
        )

    # Run the pipeline
    result = _run_pipeline(_ROOT)

    return {
        "saved": saved,
        "rejected": rejected,
        "pipeline": result,
    }


@router.post("/sample")
async def process_sample_data():
    """
    Run the analytics pipeline using existing sample data in data/.
    Generates it if it doesn't exist.
    """
    data_dir = os.path.join(_ROOT, "data")
    if not os.path.exists(data_dir) or len(os.listdir(data_dir)) < 3:
        # run python data/generate_test_data.py
        import subprocess
        gen_script = os.path.join(data_dir, "generate_test_data.py")
        if os.path.exists(gen_script):
            subprocess.run([sys.executable, gen_script], cwd=data_dir)

    result = _run_pipeline(_ROOT)
    return {
        "saved": list(ALLOWED_FILES),
        "rejected": [],
        "pipeline": result,
    }


def _run_pipeline(root: str) -> dict:
    """Run the core analytics pipeline and return summary stats."""
    try:
        # Import here to avoid circular imports at module load time
        sys.path.insert(0, root)
        import main as pipeline_main  # the existing main.py at repo root
        import importlib
        importlib.reload(pipeline_main)  # force fresh run

        # main.py writes outputs/ — return counts from output CSVs
        import pandas as pd
        fm = os.path.join(root, "outputs", "flagged_moments.csv")
        ts = os.path.join(root, "outputs", "trip_summaries.csv")

        flagged_count = len(pd.read_csv(fm)) if os.path.exists(fm) else 0
        trip_count = len(pd.read_csv(ts)) if os.path.exists(ts) else 0

        return {
            "status": "success",
            "flagged_moments": flagged_count,
            "trip_summaries": trip_count,
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "flagged_moments": 0,
            "trip_summaries": 0,
        }
