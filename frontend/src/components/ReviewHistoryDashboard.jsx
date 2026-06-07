import { useMemo, useState } from "react";
import {
  Bug,
  Calendar,
  ClipboardList,
  GitPullRequest,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";

const MOCK_REVIEW_HISTORY = [
  {
    reviewDate: "2026-06-07T16:12:00",
    repository: "codesensei/api-gateway",
    prNumber: 142,
    bugsFound: 3,
    securityIssues: 1,
    reviewSummary:
      "Critical null-pointer dereference in auth middleware; missing rate-limit on /login; SQL injection risk in legacy query builder.",
  },
  {
    reviewDate: "2026-06-06T09:45:00",
    repository: "codesensei/frontend",
    prNumber: 89,
    bugsFound: 0,
    securityIssues: 0,
    reviewSummary:
      "Clean refactor of dashboard layout. Minor style nits only — no blocking issues.",
  },
  {
    reviewDate: "2026-06-05T14:30:00",
    repository: "codesensei/ai-service",
    prNumber: 201,
    bugsFound: 5,
    securityIssues: 2,
    reviewSummary:
      "Unvalidated user input passed to prompt template; hardcoded API key in test fixture; race condition in async batch processor.",
  },
  {
    reviewDate: "2026-06-04T11:08:00",
    repository: "codesensei/gateway",
    prNumber: 67,
    bugsFound: 1,
    securityIssues: 0,
    reviewSummary:
      "Off-by-one in pagination helper. Otherwise solid error handling improvements.",
  },
  {
    reviewDate: "2026-06-03T18:22:00",
    repository: "codesensei/docs",
    prNumber: 12,
    bugsFound: 0,
    securityIssues: 0,
    reviewSummary:
      "Documentation-only PR. Updated API reference and onboarding guide.",
  },
  {
    reviewDate: "2026-06-02T08:55:00",
    repository: "codesensei/auth-service",
    prNumber: 156,
    bugsFound: 2,
    securityIssues: 3,
    reviewSummary:
      "JWT expiry not enforced on refresh tokens; CORS misconfiguration; plaintext password comparison in deprecated endpoint.",
  },
  {
    reviewDate: "2026-06-01T13:17:00",
    repository: "codesensei/worker",
    prNumber: 44,
    bugsFound: 0,
    securityIssues: 1,
    reviewSummary:
      "Queue retry logic looks good. One medium-severity secret logged in debug output.",
  },
  {
    reviewDate: "2026-05-31T20:40:00",
    repository: "codesensei/notifications",
    prNumber: 78,
    bugsFound: 4,
    securityIssues: 0,
    reviewSummary:
      "Email template renderer fails on empty subject lines; duplicate event handlers on webhook retry path.",
  },
];

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

export default function ReviewHistoryDashboard() {
  const [reviews, setReviews] = useState(MOCK_REVIEW_HISTORY);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const metrics = useMemo(
    () => ({
      totalReviews: reviews.length,
      totalBugs: reviews.reduce((sum, r) => sum + r.bugsFound, 0),
      totalSecurity: reviews.reduce((sum, r) => sum + r.securityIssues, 0),
    }),
    [reviews]
  );

  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);

    setTimeout(() => {
      setReviews([...MOCK_REVIEW_HISTORY]);
      setIsRefreshing(false);
    }, 900);
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {reviews.map((review, index) => (
                  <tr
                    key={`${review.repository}-${review.prNumber}-${index}`}
                    className="group transition-colors hover:bg-slate-800/30"
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
                        value={review.bugsFound}
                        warnClass="text-amber-400"
                        quietClass="text-slate-500"
                      />
                    </td>

                    <td className="px-6 py-4">
                      <CountCell
                        value={review.securityIssues}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
