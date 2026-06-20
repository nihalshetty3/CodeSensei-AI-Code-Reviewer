function IssueCard({ title, issues, color }) {
  if (!issues || issues.length === 0) return null;

  const colorMap = {
    red: "border-red-500/30 bg-red-500/5",
    yellow: "border-amber-500/30 bg-amber-500/5",
    green: "border-emerald-500/30 bg-emerald-500/5",
    blue: "border-blue-500/30 bg-blue-500/5",
  };

  return (
    <div className="mb-4">
      <h4 className="mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
        {title}
      </h4>
      {issues.map((item, index) => (
        <div
          key={index}
          className={`mb-2 rounded-lg border p-3 ${colorMap[color] || colorMap.blue}`}
        >
          <h5 className="font-mono text-sm font-semibold text-slate-100">{item.issue}</h5>
          <p className="mt-1 text-sm text-slate-400">{item.explanation}</p>
          <p className="mt-2 font-mono text-xs text-slate-300">
            <strong className="text-slate-200">Fix:</strong> {item.fix}
          </p>
        </div>
      ))}
    </div>
  );
}

export default IssueCard;
