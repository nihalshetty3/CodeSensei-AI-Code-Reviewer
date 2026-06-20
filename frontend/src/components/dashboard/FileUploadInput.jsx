import { useState } from "react";

export default function FileUploadInput({
  selectedFiles,
  selectedZip,
  uploadType,
  onFilesAdd,
  onFolderAdd,
  onZipSelect,
  onRemoveFile,
  onClearZip,
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    if (!dropped.length) return;

    const zipFile = dropped.find((f) => f.name.endsWith(".zip"));
    if (zipFile && dropped.length === 1) {
      onZipSelect(zipFile);
      return;
    }
    onFilesAdd(dropped);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">Upload Files</h2>
        <p className="mt-1 text-sm text-slate-400">
          Drag & drop files, folders, or a single .zip archive.
        </p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex min-h-[220px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition ${
          isDragging
            ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.35)]"
            : "border-slate-700 bg-[#0F1016]/60"
        }`}
      >
        <p className="mb-2 text-3xl">📁</p>
        <p className="text-sm text-slate-300">Drop files here or use the buttons below</p>
        <p className="mt-1 text-xs text-slate-500">.js, .py, .java, .cpp, .txt, .zip</p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <label className="cursor-pointer rounded-lg border border-slate-600 bg-slate-800/80 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-indigo-500 hover:text-white">
            Files
            <input
              type="file"
              hidden
              multiple
              accept=".js,.py,.java,.cpp,.txt"
              onChange={(e) => onFilesAdd(Array.from(e.target.files))}
            />
          </label>
          <label className="cursor-pointer rounded-lg border border-slate-600 bg-slate-800/80 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-indigo-500 hover:text-white">
            Folder
            <input
              type="file"
              hidden
              multiple
              webkitdirectory=""
              directory=""
              onChange={(e) => onFolderAdd(Array.from(e.target.files))}
            />
          </label>
          <label className="cursor-pointer rounded-lg border border-slate-600 bg-slate-800/80 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-indigo-500 hover:text-white">
            ZIP
            <input
              type="file"
              hidden
              accept=".zip"
              onChange={(e) => e.target.files[0] && onZipSelect(e.target.files[0])}
            />
          </label>
        </div>
      </div>

      {(selectedFiles.length > 0 || selectedZip) && (
        <div className="mt-4 space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-lg border border-slate-700/60 bg-[#0F1016] px-3 py-2"
            >
              <span className="truncate font-mono text-sm text-slate-300">{file.name}</span>
              <button
                type="button"
                onClick={() => onRemoveFile(index)}
                className="ml-3 text-slate-500 transition hover:text-red-400"
              >
                ×
              </button>
            </div>
          ))}
          {selectedZip && (
            <div className="flex items-center justify-between rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-2">
              <span className="truncate font-mono text-sm text-indigo-200">
                📦 {selectedZip.name}
              </span>
              <button
                type="button"
                onClick={onClearZip}
                className="ml-3 text-slate-500 transition hover:text-red-400"
              >
                ×
              </button>
            </div>
          )}
          {uploadType && (
            <p className="text-xs text-slate-500 capitalize">Mode: {uploadType}</p>
          )}
        </div>
      )}
    </div>
  );
}
