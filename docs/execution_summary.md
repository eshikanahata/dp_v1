# Driver Pulse — Execution Summary

## Build Log

### Phase 1: Data & Entities
- Created `StressMoment` and `TripSummary` dataclasses with immutable v1 schema
- Dataset: 210 drivers, 220 trips, 243 accel readings, 248 audio readings

### Phase 2: Ingestion Pipeline
- `DataLoader`: column normalization (15+ aliases), timestamp parsing, dedup, 99.5th percentile winsorization
- `TripMapper`: time-range mapping with pre-existing trip_id fallback

### Phase 3: Detection Engines
- `MotionDetector`: jerk-based harsh brake/accel + magnitude-based sharp maneuvers + near-miss cluster detection
- `AudioDetector`: spike (≥75dB) + sustained noise (≥70dB for ≥3s) with merge windows

### Phase 4: Fusion & Analytics
- `FusionEngine`: temporal overlap fusion, fairness filters, causality detection, template-based explanations
- `EarningsEngine`: velocity computation, trend analysis, goal status forecasting

### Phase 5: Pipeline & Dashboard
- `main.py`: 8-stage orchestrator with structured decision logging
- `dashboard/app.py`: 4-tab Streamlit UI (Shift Overview, Trips List, Trip Detail, Export)

## Verification
- `python main.py` runs end-to-end on provided data
- Output CSVs generated with all required columns and schema metadata
- Streamlit dashboard reads from generated outputs

---
*Driver Pulse V1 — Uber She++ Hackathon | Built by Eshika & Hrishita*
