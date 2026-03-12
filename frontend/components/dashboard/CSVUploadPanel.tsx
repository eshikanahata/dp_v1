"use client";
import { useState, useCallback } from "react";
import { Upload, CheckCircle, AlertCircle, Loader2, FileText, X } from "lucide-react";

const REQUIRED_FILES = [
  { name: "accelerometer_data.csv", desc: "Motion sensor readings" },
  { name: "audio_intensity_data.csv", desc: "Cabin audio levels" },
  { name: "trips.csv", desc: "Trip metadata" },
  { name: "drivers.csv", desc: "Driver profiles" },
  { name: "driver_goals.csv", desc: "Earnings targets" },
  { name: "earnings_velocity_log.csv", desc: "Earnings history" },
];

interface UploadResult {
  saved: string[];
  rejected: string[];
  pipeline: {
    status: string;
    message?: string;
    flagged_moments: number;
    trip_summaries: number;
  };
}

interface CSVUploadPanelProps {
  onSuccess?: () => void;
}

export function CSVUploadPanel({ onSuccess }: CSVUploadPanelProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const arr = Array.from(incoming).filter((f) => f.name.endsWith(".csv"));
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      return [...prev, ...arr.filter((f) => !names.has(f.name))];
    });
    setResult(null);
    setError(null);
  };

  const removeFile = (name: string) =>
    setFiles((prev) => prev.filter((f) => f.name !== name));

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }, []);

  const handleSubmit = async () => {
    if (!files.length) return;
    setUploading(true);
    setError(null);
    setResult(null);
    try {
      const form = new FormData();
      files.forEach((f) => form.append("files", f));
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://driverpulse-backend.onrender.com/api/v1"}/upload`,
        { method: "POST", body: form }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Upload failed");
      }
      const data: UploadResult = await res.json();
      setResult(data);
      if (data.pipeline.status === "success") onSuccess?.();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setUploading(false);
    }
  };

  const handleLoadSample = async () => {
    setUploading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://driverpulse-backend.onrender.com/api/v1"}/upload/sample`,
        { method: "POST" }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Sample upload failed");
      }
      const data: UploadResult = await res.json();
      setResult(data);
      if (data.pipeline.status === "success") onSuccess?.();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setUploading(false);
    }
  };

  const coveredNames = new Set(files.map((f) => f.name));

  return (
    <div className="border border-gray-200 shadow-sm rounded-md bg-white p-6">
      <div className="text-xs font-bold text-gray-800 mb-5 uppercase tracking-wider">
        Upload Input CSV Files
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-md p-8 text-center mb-5 transition-colors ${
          dragging ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-400"
        }`}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <div className="text-sm font-medium text-gray-700 mb-1">
          Drop CSV files here or{" "}
          <label className="underline cursor-pointer hover:text-black">
            browse
            <input
              type="file"
              accept=".csv"
              multiple
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />
          </label>
        </div>
        <div className="text-xs font-medium text-gray-500">Accepts: accelerometer, audio, trips, drivers, goals, earnings CSVs</div>
      </div>

      {/* Selected files */}
      {files.length > 0 && (
        <div className="space-y-1 mb-5">
          {files.map((f) => (
            <div key={f.name} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <span>{f.name}</span>
                <span className="text-xs text-gray-400">({(f.size / 1024).toFixed(1)} KB)</span>
              </div>
              <button onClick={() => removeFile(f.name)} className="text-gray-400 hover:text-black">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Checklist */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        {REQUIRED_FILES.map(({ name, desc }) => {
          const covered = coveredNames.has(name);
          return (
            <div key={name} className={`flex items-center gap-2 p-2 rounded text-xs ${covered ? "text-[#7ba88a]" : "text-gray-400"}`}>
              {covered ? <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-300 flex-shrink-0" />}
              <span>{name.replace(".csv", "")}</span>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={!files.length || uploading}
          className="flex-1 py-2.5 bg-black text-white text-sm rounded hover:bg-black/80 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Running…</> : <><Upload className="w-4 h-4" /> Upload</>}
        </button>
        <button
          onClick={handleLoadSample}
          disabled={uploading}
          className="flex-1 py-2.5 bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0] text-sm rounded hover:bg-[#dcfce3] transition-colors disabled:opacity-40 flex items-center justify-center gap-2 font-medium"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
          Load Sample Data
        </button>
      </div>

      {/* Result */}
      {error && (
        <div className="mt-4 flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{error}
        </div>
      )}
      {result && (
        <div className={`mt-4 rounded p-4 border text-sm ${result.pipeline.status === "success" ? "bg-[#7ba88a]/5 border-[#7ba88a]/30" : "bg-red-50 border-red-200"}`}>
          {result.pipeline.status === "success" ? (
            <>
              <div className="flex items-center gap-2 text-[#7ba88a] mb-2">
                <CheckCircle className="w-4 h-4" /><span>Pipeline complete</span>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>✓ Saved: {result.saved.join(", ")}</div>
                <div>✓ Flagged moments: {result.pipeline.flagged_moments}</div>
                <div>✓ Trip summaries: {result.pipeline.trip_summaries}</div>
                {result.rejected.length > 0 && <div className="text-[#d4a574]">⚠ Rejected: {result.rejected.join(", ")}</div>}
              </div>
            </>
          ) : (
            <div className="text-red-600">Pipeline error: {result.pipeline.message}</div>
          )}
        </div>
      )}
    </div>
  );
}
