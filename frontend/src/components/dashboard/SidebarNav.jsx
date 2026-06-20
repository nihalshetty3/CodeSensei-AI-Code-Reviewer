import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { History, Lock } from "lucide-react";

const TABS = [
  { id: "paste", label: "Paste Code", icon: "⌨️" },
  { id: "upload", label: "Upload File", icon: "📤" },
  {
    id: "history",
    label: "Review History",
    icon: History,
    type: "link",
    to: "/dashboard/history",
    requiresAuth: true,
  },
  { id: "github", label: "GitHub Repos", icon: "🐙", requiresAuth: true },
];

const navItemClass = (isActive) =>
  `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
    isActive
      ? "border border-indigo-500/40 bg-indigo-500/15 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.25)]"
      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
  }`;

export default function SidebarNav({
  isGuestMode,
  activeTab,
  onTabChange,
  onConnectGitHub,
  onLogout,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHistoryRoute = location.pathname.endsWith("/history");

  const isTabLocked = (tab) => tab.requiresAuth && isGuestMode;

  const handleTabClick = (tabId, locked) => {
    if (locked) return;
    if (isHistoryRoute) {
      navigate("/dashboard");
    }
    onTabChange(tabId);
  };

  return (
    <nav className="flex h-full w-64 shrink-0 flex-col border-r border-slate-800 bg-[#0B0C10] p-4">
      <div className="mb-6 px-2">
        <h1 className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent">
          CodeSensei
        </h1>
        <p className="mt-1 text-xs text-slate-500">AI Code Review Workspace</p>
      </div>

      {isGuestMode ? (
        <div className="mb-4 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2">
          <span className="text-xs font-semibold tracking-wide text-amber-300">
            Guest Mode
          </span>
          <p className="mt-0.5 text-[11px] text-amber-200/70">
            Paste or upload without signing in
          </p>
        </div>
      ) : (
        <div className="mb-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
          <span className="text-xs font-semibold text-emerald-400">✓ GitHub Connected</span>
          <p className="mt-0.5 text-[11px] text-emerald-200/60">Full integration unlocked</p>
        </div>
      )}

      <ul className="flex flex-1 flex-col gap-1">
        {TABS.map((tab) => {
          const locked = isTabLocked(tab);
          const isActive = activeTab === tab.id;

          if (tab.type === "link" && !locked) {
            const LinkIcon = tab.icon;
            return (
              <li key={tab.id}>
                <NavLink
                  to={tab.to}
                  className={({ isActive: routeActive }) => navItemClass(routeActive)}
                >
                  <LinkIcon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  <span className="flex-1">{tab.label}</span>
                </NavLink>
              </li>
            );
          }

          if (tab.type === "link" && locked) {
            return (
              <li key={tab.id}>
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  onClick={(e) => e.preventDefault()}
                  className="flex w-full cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition"
                >
                  <Lock className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  <span className="flex-1">{tab.label}</span>
                  <span className="text-xs opacity-60">🔒</span>
                </button>
              </li>
            );
          }

          return (
            <li key={tab.id}>
              <button
                type="button"
                disabled={locked}
                onClick={() => handleTabClick(tab.id, locked)}
                className={
                  locked
                    ? "flex w-full cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition"
                    : navItemClass(isActive)
                }
              >
                <span>{tab.icon}</span>
                <span className="flex-1">{tab.label}</span>
                {locked && <span className="text-xs opacity-60">🔒</span>}
              </button>
            </li>
          );
        })}
      </ul>

      {isGuestMode && (
        <button
          type="button"
          onClick={onConnectGitHub}
          className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_15px_rgba(99,102,241,0.35)] transition hover:bg-indigo-500"
        >
          Connect GitHub
        </button>
      )}

      {!isGuestMode && (
        <div className="mt-4 rounded-lg border border-slate-800 bg-[#0F1016] px-3 py-3">
          <p className="text-xs font-medium text-slate-400">Signed in via GitHub</p>
          <p className="mt-1 truncate font-mono text-[11px] text-slate-500">
            {localStorage.getItem("token")?.slice(0, 12)}...
          </p>
        </div>
      )}

      {!isGuestMode && (
        <button
          type="button"
          onClick={onLogout}
          className="mt-4 w-full rounded-lg border border-slate-700/70 px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"
        >
          Log Out
        </button>
      )}
    </nav>
  );
}
