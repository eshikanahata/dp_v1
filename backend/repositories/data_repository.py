"""
DataRepository — reads raw input CSVs (drivers, trips, earnings, goals, accelerometer, audio).
Implements the Repository pattern to decouple data access from business logic.
"""
import os
import pandas as pd


class DataRepository:
    """Handles reading all raw input CSV files."""

    def __init__(self, data_dir: str = None):
        # Resolve to repo root's data/ folder regardless of CWD
        if data_dir is None:
            root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            data_dir = os.path.join(root, "data")
        self.data_dir = data_dir

    def _read(self, filename: str) -> pd.DataFrame:
        path = os.path.join(self.data_dir, filename)
        if not os.path.exists(path):
            return pd.DataFrame()
        return pd.read_csv(path)

    def get_drivers(self) -> pd.DataFrame:
        return self._read("drivers.csv")

    def get_trips(self) -> pd.DataFrame:
        return self._read("trips.csv")

    def get_earnings(self) -> pd.DataFrame:
        return self._read("earnings_velocity_log.csv")

    def get_goals(self) -> pd.DataFrame:
        return self._read("driver_goals.csv")

    def get_accelerometer(self) -> pd.DataFrame:
        return self._read("accelerometer_data.csv")

    def get_audio(self) -> pd.DataFrame:
        return self._read("audio_intensity_data.csv")
