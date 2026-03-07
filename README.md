# 🚗 Driver Pulse — Driver Assistance Analytics

> **Real-time safety & earnings intelligence for Uber drivers.**  
> Rule-based. Deterministic. Explainable. No ML.

**Built by Eshika & Hrishita — Uber She++ Hackathon**

---

## 🔗 Links

- **Live Demo**: [Deploy URL — add after Streamlit Cloud deployment]
- **Demo Video**: [Video URL — add after recording]

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Place data files

Copy your CSV data files into the `data/` folder:

| File | Description |
|---|---|
| `accelerometer_data.csv` | Motion sensor readings (accel_x/y/z, speed) |
| `audio_intensity_data.csv` | Cabin audio intensity levels (dB) |
| `trips.csv` | Completed trip records with fares |
| `drivers.csv` | Driver profiles |
| `earnings_velocity_log.csv` | Real-time earnings checkpoints |
| `driver_goals.csv` | Daily earnings goals per driver |

### 3. Run the pipeline

```bash
cd driverpulse
python main.py
```

This generates three output files in `outputs/`:
- `flagged_moments.csv` — detected stress/conflict moments
- `trip_summaries.csv` — per-trip quality and earnings summaries
- `decision_log.csv` — every detection decision for traceability

### 4. Launch the dashboard

```bash
streamlit run dashboard/app.py
```

---

## 🏗️ Architecture

```
driverpulse/
├── engine/
│   ├── entities/          # Data contracts: StressMoment, TripSummary
│   ├── ingestion/         # DataLoader (CSV → clean DataFrames), TripMapper
│   ├── detection/         # MotionDetector (jerk/magnitude), AudioDetector (dB spikes)
│   ├── fusion/            # FusionEngine (temporal overlap, fairness, causality)
│   ├── analytics/         # EarningsEngine (velocity, goal forecasting)
│   └── output/            # CSVWriter (schema-validated outputs)
├── dashboard/             # Streamlit 4-tab UI
├── data/                  # Input CSVs
├── outputs/               # Generated CSVs
└── main.py                # Pipeline orchestrator
```

### Module Responsibilities

| Module | What it does |
|---|---|
| **DataLoader** | Loads CSVs, normalizes column names, deduplicates, winsorizes outliers |
| **TripMapper** | Maps sensor rows to trips by time-range matching |
| **MotionDetector** | Detects harsh braking, acceleration, sharp maneuvers via jerk thresholds |
| **AudioDetector** | Detects audio spikes (≥75dB) and sustained noise (≥70dB for ≥3s) |
| **FusionEngine** | Fuses motion+audio with fairness filters, causality, and explanations |
| **EarningsEngine** | Computes ₹/hr pace, trend, goal status, and finish-time forecasts |
| **CSVWriter** | Writes schema-validated output CSVs with version metadata |

---

## ⚖️ Design Decisions & Trade-offs

1. **Rule-based over ML**: All thresholds are explicit constants — fully explainable and auditable
2. **Fairness filters**: Events near trip boundaries get reduced confidence to avoid penalizing drivers for traffic conditions outside their control
3. **Causality detection**: COMBINED events track whether motion or audio came first (TRAFFIC_FIRST vs CABIN_FIRST) for richer context
4. **Decision logging**: Every single detection writes to `decision_log.csv` — judges can trace from output back to raw signal
5. **Winsorization**: Accelerometer outliers are clipped at 99.5th percentile to prevent single spikes from dominating

---

## 📋 Data Contract Rules

> **These rules are enforced across all schema versions:**

- ❌ **Never Remove** a field from StressMoment or TripSummary
- ❌ **Never Rename** an existing field
- ✅ **Only Append** new fields with default values
- ✅ All outputs include `schema_version`, `system_version`, `generated_at`

---

*Driver Pulse V1 — Uber She++ Hackathon*
