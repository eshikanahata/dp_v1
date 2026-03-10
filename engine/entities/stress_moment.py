"""
StressMoment entity — represents a single flagged stress/conflict moment.

Immutable data contract: Never remove or rename fields. Only append new fields.
"""

from dataclasses import dataclass


@dataclass
class StressMoment:
    """A single detected stress moment with full traceability.

    Each field maps directly to a column in flagged_moments.csv.
    All scores are 0–100. Confidence is 0–1.
    """

    flag_id: str
    trip_id: str
    driver_id: str
    timestamp: str          # ISO format, peak moment
    elapsed_seconds: float  # seconds into trip
    event_type: str         # MOTION_ONLY | AUDIO_ONLY | COMBINED
    severity: str           # LOW | MEDIUM | HIGH
    motion_score: float     # 0–100
    audio_score: float      # 0–100
    combined_score: float   # 0–100 (weighted fusion)
    confidence: float       # 0–1
    explanation: str        # human-readable, cites raw values
    context: str            # e.g. "near_trip_boundary" | "normal"
    schema_version: str = "v1"
    system_version: str = "v1.0"
    generated_at: str = ""  # ISO timestamp at generation time
