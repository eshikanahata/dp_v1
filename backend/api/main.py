"""
FastAPI main entry point for DriverPulse V2 backend.

Architecture:
  main.py → routes (trips/drivers/analytics) → services → repositories → engine
"""
import os
import sys
# Ensure repo root is on sys.path so `from backend.xxx` works
# regardless of whether uvicorn is run from repo root or from backend/
_BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))         # backend/api/
_REPO_ROOT = os.path.dirname(os.path.dirname(_BACKEND_DIR))       # repo root
if _REPO_ROOT not in sys.path:
    sys.path.insert(0, _REPO_ROOT)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.routes import trips, drivers, analytics, upload

app = FastAPI(
    title="DriverPulse API",
    description="Context-aware telemetry analytics for driver wellbeing and performance",
    version="2.0.0",
)

# CORS — allow Next.js frontend on port 3000 (local dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers under /api/v1
API_PREFIX = "/api/v1"
app.include_router(trips.router, prefix=API_PREFIX)
app.include_router(drivers.router, prefix=API_PREFIX)
app.include_router(analytics.router, prefix=API_PREFIX)
app.include_router(upload.router, prefix=API_PREFIX)


@app.get("/", include_in_schema=False)
@app.head("/", include_in_schema=False)
def root():
    return {
        "app": "DriverPulse API",
        "version": "2.0.0",
        "docs": "/docs",
        "health": "/health",
        "api": "/api/v1",
    }

@app.get("/api/v1")
@app.head("/api/v1")
def api_root():
    return {
        "message": "DriverPulse API v1 is running",
        "endpoints": ["/drivers", "/trips", "/analytics", "/upload"]
    }

@app.get("/health")
@app.head("/health")
def health():
    return {"status": "ok", "version": "2.0.0"}
