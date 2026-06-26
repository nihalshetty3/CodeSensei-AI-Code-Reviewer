import { useEffect, useState } from "react";
import {
  Bug,
  Calendar,
  ClipboardList,
  Eye,
  GitPullRequest,
  RefreshCw,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";

import {
  getReviewHistory,
  getReviewStats,
  clearReviewHistory,
} from "../utils/historyApi";

function formatReviewDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function MetricCard({ icon: Icon, label, value, accentClass, glowClass }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-slate-600/80 ${glowClass}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            {label}
          </p>
          <p className={`mt-2 text-3xl font-bold tabular-nums ${accentClass}`}>
            {value}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700/50 bg-slate-800/60 ${accentClass}`}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}

function CountCell({ value, warnClass, quietClass }) {
  const isActive = value > 0;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums ${
        isActive ? warnClass : quietClass
      }`}
    >
      {isActive && (
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      )}
      {value}
    </span>
  );
}

function ReviewDetailModal({ review, onClose }) {
  if (!review) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-detail-title"
      >
        <header className="mb-6 flex items-start justify-between gap-4 border-b border-slate-700/60 pb-4">
          <div>
            <h2
              id="review-detail-title"
              className="font-mono text-xl font-bold text-teal-400"
            >
              {review.repository}
            </h2>
            <p className="mt-1 inline-flex items-center gap-2 text-sm text-slate-400">
              <Calendar className="h-4 w-4" strokeWidth={1.75} />
              {formatReviewDate(review.reviewDate)}
              <span className="text-slate-600">·</span>
              <GitPullRequest className="h-3.5 w-3.5" />
              PR #{review.prNumber}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close review details"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-700 hover:text-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="mb-6 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm font-semibold text-amber-400">
            <Bug className="h-4 w-4" strokeWidth={1.75} />
            {review.bugsFound ?? 0} Bugs
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-sm font-semibold text-rose-400">
            <ShieldAlert className="h-4 w-4" strokeWidth={1.75} />
            {review.securityIssues ?? 0} Security Issues
          </span>
        </div>

        <div className="mb-6">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Full AI Analysis
          </h3>
          <p className="mb-3 text-sm text-slate-400">{review.reviewSummary}</p>
          <div className="mt-4 max-h-96 overflow-y-auto rounded-lg border border-slate-700/50 bg-slate-900/80 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-slate-300">
            {review.fullAnalysis || review.reviewSummary || "No detailed feedback available."}
          </div>
        </div>

        <footer className="flex justify-end border-t border-slate-700/60 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-600 bg-slate-700/50 px-5 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-700"
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}

export default function ReviewHistoryDashboard() {

  const [reviews, setReviews] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

   const loadHistory = async () => {
  try {

    const data = await getReviewHistory();

    const formatted = data.map((item) => ({
      id: item.id,
      repository: item.repository_name,
      prNumber: item.pr_number,
      reviewDate: item.review_date,
      bugsFound: item.bugs_found,
      securityIssues: item.security_issues,
      performanceIssues: item.performance_issues,
      codeQualityIssues: item.code_quality_issues,
      reviewSummary: item.review_summary,
      fullAnalysis: JSON.stringify(item.full_review, null, 2),
    }));

    setReviews(formatted);

  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  loadHistory();
}, []);


  useEffect(() => {
    if (!selectedReview) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") setSelectedReview(null);
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [selectedReview]);

 const [metrics, setMetrics] = useState({
  totalReviews: 0,
  totalBugs: 0,
  totalSecurity: 0,
});



  const loadStats = async () => {
  try {

    const stats = await getReviewStats();

    setMetrics({
      totalReviews: Number(stats.total_reviews),
      totalBugs: Number(stats.total_bugs),
      totalSecurity: Number(stats.total_security),
    });

  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  loadStats();
}, []);

const handleRefresh = async () => {

  if (isRefreshing) return;

  setIsRefreshing(true);

  try {
    await loadHistory();
    await loadStats();
  } catch (err) {
    console.error(err);
  }

  setIsRefreshing(false);
};

  const handleClearHistory = async() => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete all code review history logs? This cannot be undone."
    );

    if (!confirmed) return;
      await clearReviewHistory();
      setReviews([]);
    setMetrics({
  totalReviews: 0,
  totalBugs: 0,
  totalSecurity: 0,
});

setSelectedReview(null);
      
  };

  return (
    <div className="min-h-full bg-slate-900 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Review History
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Telemetry across past AI code review runs
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700/70 bg-slate-800/50 px-4 py-2.5 text-sm font-medium text-slate-200 backdrop-blur-sm transition-all hover:border-cyan-500/40 hover:bg-slate-800/80 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin text-cyan-400" : ""}`}
                strokeWidth={2}
              />
              {isRefreshing ? "Refreshing…" : "Refresh"}
            </button>
            <button
              type="button"
              onClick={handleClearHistory}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700/70 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-rose-800/60 hover:bg-rose-950/40 hover:text-rose-400"
            >
              <Trash2 className="h-4 w-4" strokeWidth={2} />
              Clear History
            </button>
          </div>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            icon={ClipboardList}
            label="Total Reviews Run"
            value={metrics.totalReviews}
            accentClass="text-slate-100"
            glowClass="shadow-[0_0_30px_rgba(148,163,184,0.06)]"
          />
          <MetricCard
            icon={Bug}
            label="Total Bugs Found"
            value={metrics.totalBugs}
            accentClass="text-amber-400"
            glowClass="shadow-[0_0_30px_rgba(251,191,36,0.08)] hover:shadow-[0_0_40px_rgba(251,191,36,0.12)]"
          />
          <MetricCard
            icon={ShieldAlert}
            label="Total Security Issues"
            value={metrics.totalSecurity}
            accentClass="text-rose-400"
            glowClass="shadow-[0_0_30px_rgba(251,113,133,0.08)] hover:shadow-[0_0_40px_rgba(251,113,133,0.12)]"
          />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/30 shadow-[0_0_40px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <div className="border-b border-slate-700/50 px-6 py-4">
            <h2 className="text-sm font-semibold tracking-wide text-slate-300">
              Review Log
            </h2>
          </div>

          {reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <ClipboardList className="mb-4 h-10 w-10 text-slate-600" strokeWidth={1.5} />
              <p className="max-w-md text-sm text-slate-400">
                No code reviews found. Go to &apos;Paste Code&apos; or &apos;Upload
                File&apos; to run your first real-time analysis!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="border-b border-slate-800/80 text-xs font-medium uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-3.5">Review Date</th>
                    <th className="px-6 py-3.5">Repository</th>
                    <th className="px-6 py-3.5">PR</th>
                    <th className="px-6 py-3.5">Bugs Found</th>
                    <th className="px-6 py-3.5">Security Issues</th>
                    <th className="px-6 py-3.5">Review Summary</th>
                    <th className="px-6 py-3.5">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {reviews.map((review) => (
                    <tr
                      key={`${review.repository}-${review.prNumber}-${review.reviewDate}`}
                      onClick={() => setSelectedReview(review)}
                      className="group cursor-pointer transition-colors hover:bg-slate-800/60"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex items-center gap-2 text-sm text-slate-300">
                          <Calendar
                            className="h-4 w-4 shrink-0 text-slate-500"
                            strokeWidth={1.75}
                          />
                          {formatReviewDate(review.reviewDate)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-teal-400 transition-all group-hover:text-teal-300 group-hover:drop-shadow-[0_0_8px_rgba(45,212,191,0.45)]">
                          {review.repository}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-700/60 bg-slate-800/50 px-2.5 py-0.5 font-mono text-xs font-medium text-slate-300">
                          <GitPullRequest className="h-3 w-3 text-slate-500" />
                          #{review.prNumber}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <CountCell
                          value={review.bugsFound ?? 0}
                          warnClass="text-amber-400"
                          quietClass="text-slate-500"
                        />
                      </td>

                      <td className="px-6 py-4">
                        <CountCell
                          value={review.securityIssues ?? 0}
                          warnClass="text-rose-400"
                          quietClass="text-slate-500"
                        />
                      </td>

                      <td className="max-w-xs px-6 py-4">
                        <p
                          className="truncate text-sm text-slate-400"
                          title={review.reviewSummary}
                        >
                          {review.reviewSummary}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReview(review);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-800/50 px-2.5 py-1.5 text-xs font-medium text-slate-400 transition hover:border-cyan-500/40 hover:text-cyan-300"
                          aria-label="View detailed feedback"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <ReviewDetailModal
        review={selectedReview}
        onClose={() => setSelectedReview(null)}
      />
    </div>
  );
}

