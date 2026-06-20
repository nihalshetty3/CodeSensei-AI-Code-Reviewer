import IssueCard from "../IssueCard";
import { hasFormattedIssues } from "../../utils/apiHelpers";

export default function LiveReviewPanel({ review, loading }) {
     console.log("LIVE REVIEW PANEL DATA:");
  console.log(review);
  return (
    <aside className="flex h-full min-h-0 flex-col rounded-xl border border-slate-800 bg-[#0F1016] shadow-[inset_0_0_30px_rgba(0,0,0,0.35)]">
      <header className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              loading
                ? "animate-pulse bg-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.9)]"
                : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]"
            }`}
          />
          <h2 className="text-sm font-semibold tracking-wide text-slate-200">Live Review</h2>
        </div>
        {loading && (
          <span className="text-xs font-medium text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.35)]">
            Streaming analysis...
          </span>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-5">
        {!review && !loading && (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center text-center">
            <p className="text-4xl opacity-30">✨</p>
            <p className="mt-3 text-sm text-slate-500">
              Run AI Analysis to see feedback here
            </p>
          </div>
        )}

        {loading && !review && (
          <p className="animate-pulse text-sm text-slate-400">Reviewing code...</p>
        )}

        {review?.files &&
          review.files.map((file, index) => (
            <div key={index} className="mb-6 border-b border-slate-800 pb-6 last:border-0">
              <h3 className="mb-3 font-mono text-base font-semibold text-indigo-300">
                {file.filename || file.file_path || `File ${index + 1}`}
              </h3>
              <IssueCard title="🐞 Bugs" issues={file.review?.bugs || file.bugs} color="red" />
              <IssueCard title="🔒 Security" issues={file.review?.security || file.security} color="yellow" />
              <IssueCard title="⚡ Performance" issues={file.review?.performance || file.performance} color="green" />
              <IssueCard title="🧹 Code Quality" issues={file.review?.code_quality || file.code_quality} color="blue" />
            </div>
          ))}

        {review &&
          !review.files &&
          typeof review === "object" &&
          hasFormattedIssues(review) && (
            <div className="mb-6">
              <h3 className="mb-3 font-mono text-base font-semibold text-indigo-300">
                Pasted Code Analysis
              </h3>
              <IssueCard title="🐞 Bugs" issues={review.bugs || review.bug || review.errors} color="red" />
              <IssueCard title="🔒 Security" issues={review.security || review.vulnerabilities} color="yellow" />
              <IssueCard title="⚡ Performance" issues={review.performance || review.optimization} color="green" />
              <IssueCard title="🧹 Code Quality" issues={review.code_quality || review.suggestions} color="blue" />
            </div>
          )}

        {review &&
          (typeof review === "string" ||
            (!review.files && !hasFormattedIssues(review))) && (
            <div>
              <h3 className="mb-3 font-mono text-base font-semibold text-indigo-300">
                Analysis Report
              </h3>
              <pre className="whitespace-pre-wrap rounded-lg border border-slate-800 bg-[#0B0C10] p-4 font-mono text-sm leading-relaxed text-slate-300">
                {typeof review === "string" ? review : JSON.stringify(review, null, 2)}
              </pre>
            </div>
          )}
      </div>
    </aside>
  );
}
