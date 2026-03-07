# Driver Pulse — Design Document

## Overview

Driver Pulse is a rule-based driver-assistance analytics system that converts raw sensor signals (accelerometer + cabin audio) into actionable safety insights and earnings velocity forecasts for Uber drivers.

## Architecture

The system follows a **linear pipeline** architecture:


Raw CSVs → DataLoader → TripMapper → Detectors → FusionEngine → Outputs
                                                        ↓
                                          EarningsEngine → TripSummaries
```

## Key Design Decisions

### 1. Rule-based, not ML
All decisions use explicit, tunable thresholds. This maximizes explainability and allows every output to be traced back to a raw sensor value.

### 2. Sensor Fusion
Motion + audio events are fused temporally. Events within 10 seconds of each other are treated as related incidents. Combined events receive 0.6× motion + 0.4× audio weighting.

### 3. Fairness Filtering
To avoid penalizing drivers unfairly:
- Events near trip start/end get reduced confidence (0.7×)
- Short trips (<2 min) get confidence reduction (0.8×)
- Motion events with low audio (<20) suggest traffic, not conflict

### 4. Causality Detection
For combined events, the system determines whether motion or audio came first:
- **TRAFFIC_FIRST**: Motion before audio (external event caused stress)
- **CABIN_FIRST**: Audio before motion (in-cabin event led to driving change)
- **SIMULTANEOUS**: Within 1 second

### 5. Decision Traceability
Every detection decision is logged to `decision_log.csv` — from raw threshold check through fusion scoring — enabling complete audit trails.

## Data Contracts
- StressMoment: 16 fields, immutable schema v1
- TripSummary: 17 fields, immutable schema v1
- Rule: Never remove, never rename, only append

## Thresholds Reference

| Parameter | Value | Unit |
|---|---|---|
| Harsh brake jerk | -15.0 | m/s³ |
| Harsh accel jerk | 15.0 | m/s³ |
| Sharp maneuver mag | 18.0 | m/s² |
| Audio spike | 75.0 | dB |
| Sustained audio | 70.0 | dB for ≥3s |
| Temporal overlap | 10.0 | seconds |
| Severity HIGH | ≥70 | score |
| Severity MEDIUM | ≥40 | score |
