export default function ManualPasteInput({ code, onCodeChange }) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">Paste Code</h2>
        <p className="mt-1 text-sm text-slate-400">
          Drop a raw snippet below — no account required in Guest Mode.
        </p>
      </div>
      <textarea
        className="min-h-[320px] flex-1 resize-y rounded-xl border border-slate-700/80 bg-[#0F1016] p-4 font-mono text-sm leading-relaxed text-slate-100 shadow-inner outline-none transition focus:border-indigo-500 focus:shadow-[0_0_15px_rgba(99,102,241,0.25)]"
        placeholder="// Paste your code here..."
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        spellCheck={false}
      />
    </div>
  );
}
