"""
OutputRepository — reads analytics output CSVs (flagged_moments, trip_summaries, decision_log).
These are produced by the analytics engine (main.py) and consumed by the service layer.
"""
import os
import pandas as pd


class OutputRepository:
    """Handles reading pre-computed analytics output CSV files."""

    def __init__(self, output_dir: str = None):
        if output_dir is None:
            root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            output_dir = os.path.join(root, "outputs")
        self.output_dir = output_dir

    def _read(self, filename: str) -> pd.DataFrame:
        path = os.path.join(self.output_dir, filename)
        if not os.path.exists(path):
            return pd.DataFrame()
        return pd.read_csv(path)

    def get_flagged_moments(self) -> pd.DataFrame:
        return self._read("flagged_moments.csv")

    def get_trip_summaries(self) -> pd.DataFrame:
        return self._read("trip_summaries.csv")

    def get_decision_log(self) -> pd.DataFrame:
        return self._read("decision_log.csv")
