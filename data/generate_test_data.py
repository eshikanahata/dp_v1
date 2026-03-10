"""
generate_test_data.py — Stress-test data generator for the Driver Pulse pipeline.

Produces all 6 CSV files in data/ with intentional structural, sensor, and
earnings problems designed to exercise every cleaning, filtering, and
edge-case path in the ingestion, detection, fusion, and analytics layers.

Usage:
    python data/generate_test_data.py          # writes to data/
    python data/generate_test_data.py --outdir data_test/   # custom output dir
"""

import argparse
import os
import random
import numpy as np
import pandas as pd
from datetime import datetime, timedelta, timezone

random.seed(42)
np.random.seed(42)

# ---------------------------------------------------------------------------
# Helper — produce a timestamp in a random format
# ---------------------------------------------------------------------------
FORMATS = [
    lambda dt: dt.isoformat(),                                    # ISO 8601
    lambda dt: dt.strftime("%d/%m/%Y %H:%M"),                    # DD/MM/YYYY HH:MM
    lambda dt: str(int(dt.timestamp())),                         # Unix epoch
    lambda dt: dt.strftime("%Y-%m-%d %H:%M:%S+05:30"),           # with tz offset
    lambda dt: dt.strftime("%Y-%m-%dT%H:%M:%SZ"),                # ISO w/ Z
    lambda dt: dt.strftime("%Y-%m-%d %H:%M:%S"),                 # plain
]


def messy_ts(dt, force_format=None):
    """Return a timestamp string in a randomly chosen format."""
    fmt = force_format or random.choice(FORMATS)
    return fmt(dt)


def jitter_ts(dt, ms=1):
    """Return dt offset by ms milliseconds (for near-duplicates)."""
    return dt + timedelta(milliseconds=ms)


# ---------------------------------------------------------------------------
# Column-name messifier
# ---------------------------------------------------------------------------
def messify_col(name):
    """Randomly change casing/spacing of a column name."""
    r = random.random()
    if r < 0.2:
        return " " + name                     # leading space
    elif r < 0.4:
        return name.upper()                   # ALL CAPS
    elif r < 0.6:
        return name.replace("_", " ").title()  # Title Case
    elif r < 0.8:
        return name.capitalize()              # Capitalize first
    return name                               # normal


# ═══════════════════════════════════════════════════════════════════════════
# 1. TRIPS
# ═══════════════════════════════════════════════════════════════════════════
def generate_trips():
    base_date = datetime(2024, 3, 15, tzinfo=timezone.utc)
    trips = []

    definitions = [
        # (trip_id, driver_id, start_offset_hrs, duration_min, purpose)
        ("TTEST001", "DTEST01", 6.0,  45, "clean_trip_no_events"),
        ("TTEST002", "DTEST01", 8.0,  60, "combined_heavy_trip"),
        ("TTEST003", "DTEST02", 7.0,  35, "motion_only_trip"),
        ("TTEST004", "DTEST02", 9.0,   1, "very_short_trip_90s"),     # < 90s
        ("TTEST005", "DTEST03", 6.5,  50, "boundary_events_trip"),
        ("TTEST006", "DTEST03", 10.0, 40, "audio_only_trip"),
        ("TTEST007", "DTEST04", 7.5,  55, "mixed_events"),
        ("TTEST008", "DTEST04", 11.0, 30, "normal_drive"),
        ("TTEST009", "DTEST01", 14.0, 25, "afternoon_drive"),
        ("TTEST010","DTEST02", 15.0, 20, "evening_drive"),
    ]

    for trip_id, driver_id, start_h, dur_min, purpose in definitions:
        start = base_date + timedelta(hours=start_h)
        end = start + timedelta(minutes=dur_min)

        row = {
            "trip_id": trip_id,
            "driver_id": driver_id,
            "date": messy_ts(base_date),
            "start_time": messy_ts(start),
            "end_time": messy_ts(end),
            "duration_seconds": dur_min * 60,
            "distance_km": round(random.uniform(5, 40), 1),
            "fare_amount": round(random.uniform(100, 800), 2),
            "surge_multiplier": round(random.choice([1.0, 1.0, 1.2, 1.5, 2.0]), 1),
            "pickup_location": f"{round(random.uniform(12, 28), 4)},{round(random.uniform(72, 88), 4)}",
            "dropoff_location": f"{round(random.uniform(12, 28), 4)},{round(random.uniform(72, 88), 4)}",
            "trip_status": "completed",
        }
        trips.append(row)

    # --- Intentional problems ---
    # Exact duplicate of TTEST001
    trips.append(trips[0].copy())

    # Row with missing driver_id
    trips.append({
        "trip_id": "TTEST011",
        "driver_id": "",                    # empty string instead of null
        "date": messy_ts(base_date),
        "start_time": messy_ts(base_date + timedelta(hours=16)),
        "end_time": messy_ts(base_date + timedelta(hours=17)),
        "duration_seconds": 3600,
        "distance_km": 15.0,
        "fare_amount": 350.00,
        "surge_multiplier": 1.0,
        "pickup_location": "19.0,72.8",
        "dropoff_location": "19.1,72.9",
        "trip_status": "completed",
    })

    # Row with missing trip_id
    trips.append({
        "trip_id": "",
        "driver_id": "DTEST01",
        "date": messy_ts(base_date),
        "start_time": messy_ts(base_date + timedelta(hours=18)),
        "end_time": messy_ts(base_date + timedelta(hours=19)),
        "duration_seconds": 3600,
        "distance_km": 10.0,
        "fare_amount": 250.00,
        "surge_multiplier": 1.0,
        "pickup_location": "19.0,72.8",
        "dropoff_location": "19.1,72.9",
        "trip_status": "completed",
    })

    df = pd.DataFrame(trips)
    # Messify some column names
    df.columns = [messify_col(c) for c in df.columns]
    return df


# ═══════════════════════════════════════════════════════════════════════════
# 2. DRIVERS
# ═══════════════════════════════════════════════════════════════════════════
def generate_drivers():
    drivers = [
        {"driver_id": "DTEST01", "driver_name": "Priya Sharma",   "city": "Mumbai",    "vehicle_type": "sedan",  "license_plate": "MH01AB1234", "join_date": "2023-01-15"},
        {"driver_id": "DTEST02", "driver_name": "Rahul Verma",    "city": "Delhi",     "vehicle_type": "hatchback", "license_plate": "DL02CD5678", "join_date": "2022-06-20"},
        {"driver_id": "DTEST03", "driver_name": "Ananya Iyer",    "city": "Bangalore", "vehicle_type": "suv",    "license_plate": "KA03EF9012", "join_date": "2023-08-01"},
        {"driver_id": "DTEST04", "driver_name": "Mohammed Khan",  "city": "Hyderabad", "vehicle_type": "sedan",  "license_plate": "TS04GH3456", "join_date": "2024-01-10"},
    ]
    df = pd.DataFrame(drivers)
    df.columns = [messify_col(c) for c in df.columns]
    return df


# ═══════════════════════════════════════════════════════════════════════════
# 3. ACCELEROMETER DATA
# ═══════════════════════════════════════════════════════════════════════════
def generate_accel():
    base_date = datetime(2024, 3, 15, tzinfo=timezone.utc)
    rows = []
    sensor_id = 0

    trip_configs = {
        # trip_id: (driver, start_h, dur_min, pattern)
        "TTEST001": ("DTEST01", 6.0,  45, "clean"),               # completely clean
        "TTEST002": ("DTEST01", 8.0,  60, "combined_heavy"),       # extreme motion throughout
        "TTEST003": ("DTEST02", 7.0,  35, "harsh_motion"),         # harsh events, no matching audio
        "TTEST004": ("DTEST02", 9.0,   1, "short_trip"),           # 60s — very short
        "TTEST005": ("DTEST03", 6.5,  50, "boundary_events"),      # events at start and end
        "TTEST006": ("DTEST03", 10.0, 40, "clean"),                # clean (audio-only trip)
        "TTEST007": ("DTEST04", 7.5,  55, "mixed"),                # some events
        "TTEST008": ("DTEST04", 11.0, 30, "clean"),                # normal
        "TTEST009": ("DTEST01", 14.0, 25, "clean"),                # normal
        "TTEST010": ("DTEST02", 15.0, 20, "clean"),                # normal
    }

    for trip_id, (driver_id, start_h, dur_min, pattern) in trip_configs.items():
        start = base_date + timedelta(hours=start_h)
        dur_sec = dur_min * 60
        t = 0
        step = 2  # 2-second intervals

        while t <= dur_sec:
            ts = start + timedelta(seconds=t)

            # Base gentle motion (gravity-dominated)
            ax = np.random.normal(0.5, 0.8)
            ay = np.random.normal(0.3, 0.6)
            az = np.random.normal(9.7, 0.3)

            # --- Patterns ---
            if pattern == "combined_heavy":
                # Every 30 seconds, inject a harsh event
                if t % 30 < 4 and t > 10:
                    ax = np.random.uniform(12, 18)
                    ay = np.random.uniform(8, 14)
                    az = np.random.uniform(3, 7)

            elif pattern == "harsh_motion":
                # 3-4 harsh events in the middle of the trip
                if t in [420, 422, 720, 722, 1050, 1052]:
                    ax = np.random.uniform(13, 17)
                    ay = np.random.uniform(9, 13)
                    az = np.random.uniform(4, 8)

            elif pattern == "short_trip":
                # One harsh event in the 60s trip
                if t in [30, 32]:
                    ax = np.random.uniform(14, 18)
                    ay = np.random.uniform(10, 14)

            elif pattern == "boundary_events":
                # Harsh events in the first 15s and last 15s
                if t in [4, 6, 8] or t in [dur_sec - 6, dur_sec - 4]:
                    ax = np.random.uniform(13, 17)
                    ay = np.random.uniform(9, 13)
                    az = np.random.uniform(4, 7)

            elif pattern == "mixed":
                if t in [600, 602, 1200, 1202]:
                    ax = np.random.uniform(13, 16)
                    ay = np.random.uniform(9, 12)

            speed = max(0, np.random.normal(35, 15))
            lat = round(19.0 + np.random.uniform(-0.1, 0.1), 4)
            lon = round(72.8 + np.random.uniform(-0.1, 0.1), 4)

            row = {
                "sensor_id": f"ACC{sensor_id:04d}",
                "trip_id": trip_id,
                "timestamp": messy_ts(ts),
                "elapsed_seconds": t,
                "accel_x": round(ax, 2),
                "accel_y": round(ay, 2),
                "accel_z": round(az, 2),
                "speed_kmh": round(speed, 1),
                "gps_lat": lat,
                "gps_lon": lon,
            }
            rows.append(row)
            sensor_id += 1

            # --- Introduce a 40-second gap in TTEST002 at the 15-min mark ---
            if pattern == "combined_heavy" and t == 900:
                t += 40  # skip 40 seconds
            else:
                t += step

    # --- Intentional problems ---

    # (a) Extreme outlier spike — 10× normal range
    outlier_ts = base_date + timedelta(hours=8, minutes=25)
    rows.append({
        "sensor_id": f"ACC{sensor_id:04d}",
        "trip_id": "TTEST002",
        "timestamp": messy_ts(outlier_ts),
        "elapsed_seconds": 1500,
        "accel_x": 95.0,          # 10× normal
        "accel_y": -88.0,
        "accel_z": 102.0,
        "speed_kmh": 55.0,
        "gps_lat": 19.05,
        "gps_lon": 72.85,
    })
    sensor_id += 1

    # (b) Exact duplicate rows
    dup_row = rows[10].copy()
    rows.append(dup_row)

    # (c) Near-duplicate (1ms difference)
    near_dup = rows[10].copy()
    near_dup["sensor_id"] = f"ACC{sensor_id:04d}"
    # Modify the timestamp slightly — will look almost the same
    near_dup["elapsed_seconds"] = rows[10]["elapsed_seconds"]
    rows.append(near_dup)
    sensor_id += 1

    # (d) Sensor row OUTSIDE any trip window — should be UNMAPPED
    orphan_ts = base_date + timedelta(hours=3)  # 3 AM — no trip running
    rows.append({
        "sensor_id": f"ACC{sensor_id:04d}",
        "trip_id": "",  # empty trip_id
        "timestamp": messy_ts(orphan_ts),
        "elapsed_seconds": 0,
        "accel_x": 1.2,
        "accel_y": 0.5,
        "accel_z": 9.7,
        "speed_kmh": 0,
        "gps_lat": 19.0,
        "gps_lon": 72.8,
    })
    sensor_id += 1

    # (e) Row with missing trip_id and driver_id
    rows.append({
        "sensor_id": f"ACC{sensor_id:04d}",
        "trip_id": "",
        "timestamp": "",  # empty timestamp too
        "elapsed_seconds": "",
        "accel_x": "",
        "accel_y": "",
        "accel_z": "",
        "speed_kmh": "",
        "gps_lat": "",
        "gps_lon": "",
    })
    sensor_id += 1

    df = pd.DataFrame(rows)
    # Messify column names
    df.columns = [messify_col(c) for c in df.columns]
    return df


# ═══════════════════════════════════════════════════════════════════════════
# 4. AUDIO INTENSITY DATA
# ═══════════════════════════════════════════════════════════════════════════
def generate_audio():
    base_date = datetime(2024, 3, 15, tzinfo=timezone.utc)
    rows = []
    sensor_id = 0

    trip_configs = {
        # trip_id: (driver, start_h, dur_min, pattern)
        "TTEST001": ("DTEST01", 6.0,  45, "quiet"),                # clean trip
        "TTEST002": ("DTEST01", 8.0,  60, "combined_heavy"),       # high audio throughout
        "TTEST003": ("DTEST02", 7.0,  35, "quiet"),                # no audio events
        "TTEST004": ("DTEST02", 9.0,   1, "short_loud"),           # short + loud
        "TTEST005": ("DTEST03", 6.5,  50, "boundary_loud"),        # loud at start/end
        "TTEST006": ("DTEST03", 10.0, 40, "loud"),                 # sustained loud
        "TTEST007": ("DTEST04", 7.5,  55, "mixed"),                # some loud moments
        "TTEST008": ("DTEST04", 11.0, 30, "quiet"),                # normal
        "TTEST009": ("DTEST01", 14.0, 25, "quiet"),                # normal
        "TTEST010": ("DTEST02", 15.0, 20, "quiet"),                # normal
    }

    for trip_id, (driver_id, start_h, dur_min, pattern) in trip_configs.items():
        start = base_date + timedelta(hours=start_h)
        dur_sec = dur_min * 60
        t = 0

        while t <= dur_sec:
            ts = start + timedelta(seconds=t)

            # Base quiet audio
            db = round(np.random.normal(45, 8), 1)

            if pattern == "combined_heavy":
                # Sustained loud every 30s (overlaps with motion events)
                if t % 30 < 8 and t > 10:
                    db = round(np.random.uniform(76, 92), 1)

            elif pattern == "short_loud":
                if 20 <= t <= 40:
                    db = round(np.random.uniform(78, 88), 1)

            elif pattern == "boundary_loud":
                if t < 12 or t > dur_sec - 12:
                    db = round(np.random.uniform(77, 90), 1)

            elif pattern == "loud":
                # Sustained loud throughout significant portions
                if 300 <= t <= 360 or 800 <= t <= 880:
                    db = round(np.random.uniform(72, 85), 1)
                # Spike events
                if t in [500, 1200, 1500]:
                    db = round(np.random.uniform(80, 95), 1)

            elif pattern == "mixed":
                if t in [600, 602, 1200, 1202]:
                    db = round(np.random.uniform(76, 88), 1)

            row = {
                "sensor_id": f"AUD{sensor_id:04d}",
                "trip_id": trip_id,
                "timestamp": messy_ts(ts),
                "elapsed_seconds": t,
                "audio_level_db": db,
                "frequency_hz": round(np.random.uniform(200, 4000), 0),
                "source_type": random.choice(["cabin", "external", "unknown"]),
            }
            rows.append(row)
            sensor_id += 1
            t += 1  # 1-second intervals for audio

    # --- Intentional problems ---

    # (a) Negative dB values — physically impossible
    neg_ts = base_date + timedelta(hours=7, minutes=10)
    for i in range(3):
        rows.append({
            "sensor_id": f"AUD{sensor_id:04d}",
            "trip_id": "TTEST003",
            "timestamp": messy_ts(neg_ts + timedelta(seconds=i)),
            "elapsed_seconds": 600 + i,
            "audio_level_db": round(np.random.uniform(-15, -5), 1),
            "frequency_hz": 1000,
            "source_type": "cabin",
        })
        sensor_id += 1

    # (b) Exact duplicate
    rows.append(rows[50].copy())

    # (c) Orphan row outside any trip
    rows.append({
        "sensor_id": f"AUD{sensor_id:04d}",
        "trip_id": "",
        "timestamp": messy_ts(base_date + timedelta(hours=2)),
        "elapsed_seconds": 0,
        "audio_level_db": 50.0,
        "frequency_hz": 500,
        "source_type": "external",
    })
    sensor_id += 1

    # (d) Row with empty string values
    rows.append({
        "sensor_id": f"AUD{sensor_id:04d}",
        "trip_id": "",
        "timestamp": "",
        "elapsed_seconds": "",
        "audio_level_db": "",
        "frequency_hz": "",
        "source_type": "",
    })
    sensor_id += 1

    df = pd.DataFrame(rows)
    df.columns = [messify_col(c) for c in df.columns]
    return df


# ═══════════════════════════════════════════════════════════════════════════
# 5. EARNINGS VELOCITY LOG
# ═══════════════════════════════════════════════════════════════════════════
def generate_earnings():
    base_date = datetime(2024, 3, 15, tzinfo=timezone.utc)
    rows = []

    driver_profiles = {
        # driver_id: (target, base_pace, hours_so_far, pattern)
        "DTEST01": (2500, 320, 6.0, "on_track"),
        "DTEST02": (2000, 180, 5.0, "off_track"),     # low pace, big gap
        "DTEST03": (1800, 260, 4.5, "on_track"),
        "DTEST04": (2200, 290, 3.0, "single_entry"),   # only 1 entry
    }

    for driver_id, (target, base_pace, hours, pattern) in driver_profiles.items():
        start = base_date + timedelta(hours=6)

        if pattern == "single_entry":
            # Edge case: only 1 earnings entry
            rows.append({
                "log_id": f"EL-{driver_id}-001",
                "driver_id": driver_id,
                "timestamp": messy_ts(start + timedelta(hours=hours)),
                "date": messy_ts(base_date),
                "current_hours": hours,
                "cumulative_earnings": round(base_pace * hours, 2),
                "current_velocity": base_pace,
                "status": "on_track",
                "earnings_velocity": base_pace,
                "goal_completion_forecast": round(base_pace * 8, 2),
            })
            continue

        n_entries = 8
        earned = 0
        entries_before_shuffle = []

        for i in range(n_entries):
            hr = (hours / n_entries) * (i + 1)
            ts = start + timedelta(hours=hr)

            if pattern == "off_track":
                pace = base_pace * np.random.uniform(0.6, 0.9)
            else:
                pace = base_pace * np.random.uniform(0.9, 1.15)

            earned += pace * (hours / n_entries)

            entry = {
                "log_id": f"EL-{driver_id}-{i+1:03d}",
                "driver_id": driver_id,
                "timestamp": messy_ts(ts),
                "date": messy_ts(base_date),
                "current_hours": round(hr, 2),
                "cumulative_earnings": round(earned, 2),
                "current_velocity": round(pace, 2),
                "status": "on_track" if pattern == "on_track" else "off_track",
                "earnings_velocity": round(pace, 2),
                "goal_completion_forecast": round(earned + pace * (8 - hr), 2),
            }
            entries_before_shuffle.append(entry)

        # --- Intentional: shuffle to make out-of-order ---
        random.shuffle(entries_before_shuffle)
        rows.extend(entries_before_shuffle)

        # --- Intentional: duplicate one earnings entry ---
        if pattern == "off_track":
            rows.append(entries_before_shuffle[0].copy())

    df = pd.DataFrame(rows)
    df.columns = [messify_col(c) for c in df.columns]
    return df


# ═══════════════════════════════════════════════════════════════════════════
# 6. DRIVER GOALS
# ═══════════════════════════════════════════════════════════════════════════
def generate_goals():
    base_date = datetime(2024, 3, 15, tzinfo=timezone.utc)
    goals = [
        {"goal_id": "G-DTEST01", "driver_id": "DTEST01", "date": messy_ts(base_date),
         "shift_start": messy_ts(base_date + timedelta(hours=6)),
         "shift_end": messy_ts(base_date + timedelta(hours=14)),
         "target_earnings": 2500, "target_hours": 8, "current_hours": 6.0},
        {"goal_id": "G-DTEST02", "driver_id": "DTEST02", "date": messy_ts(base_date),
         "shift_start": messy_ts(base_date + timedelta(hours=6)),
         "shift_end": messy_ts(base_date + timedelta(hours=14)),
         "target_earnings": 2000, "target_hours": 8, "current_hours": 5.0},
        {"goal_id": "G-DTEST03", "driver_id": "DTEST03", "date": messy_ts(base_date),
         "shift_start": messy_ts(base_date + timedelta(hours=6)),
         "shift_end": messy_ts(base_date + timedelta(hours=14)),
         "target_earnings": 1800, "target_hours": 8, "current_hours": 4.5},
        {"goal_id": "G-DTEST04", "driver_id": "DTEST04", "date": messy_ts(base_date),
         "shift_start": messy_ts(base_date + timedelta(hours=7)),
         "shift_end": messy_ts(base_date + timedelta(hours=15)),
         "target_earnings": 2200, "target_hours": 8, "current_hours": 3.0},
    ]
    df = pd.DataFrame(goals)
    df.columns = [messify_col(c) for c in df.columns]
    return df


# ═══════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════
def main():
    parser = argparse.ArgumentParser(description="Generate messy test data")
    parser.add_argument("--outdir", default="data", help="Output directory (default: data)")
    args = parser.parse_args()

    outdir = args.outdir
    os.makedirs(outdir, exist_ok=True)

    generators = {
        "trips.csv": generate_trips,
        "drivers.csv": generate_drivers,
        "accelerometer_data.csv": generate_accel,
        "audio_intensity_data.csv": generate_audio,
        "earnings_velocity_log.csv": generate_earnings,
        "driver_goals.csv": generate_goals,
    }

    for filename, gen_fn in generators.items():
        df = gen_fn()
        path = os.path.join(outdir, filename)
        df.to_csv(path, index=False)
        print(f"  ✓ {filename:35s} → {len(df):6d} rows  ({path})")

    print(f"\nAll 6 files written to {outdir}/")
    print("Column names have been randomly messified.")
    print("Run 'python main.py' to test the pipeline against this data.")


if __name__ == "__main__":
    main()
