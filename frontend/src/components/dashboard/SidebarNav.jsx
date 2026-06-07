const TABS = [
  { id: "paste", label: "Paste Code", icon: "⌨️" },
  { id: "upload", label: "Upload File", icon: "📤" },
  { id: "github", label: "GitHub Repos", icon: "🐙", requiresAuth: true },
];

export default function SidebarNav({
  isGuestMode,
  isAuthenticated,
  activeTab,
  onTabChange,
  onConnectGitHub,
}) {
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
          const locked = tab.requiresAuth && isGuestMode;
          const isActive = activeTab === tab.id;

          return (
            <li key={tab.id}>
              <button
                type="button"
                disabled={locked}
                onClick={() => !locked && onTabChange(tab.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                  locked
                    ? "cursor-not-allowed text-slate-600"
                    : isActive
                      ? "border border-indigo-500/40 bg-indigo-500/15 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.25)]"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
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

      {!isGuestMode && isAuthenticated && (
        <div className="mt-4 rounded-lg border border-slate-800 bg-[#0F1016] px-3 py-3">
          <p className="text-xs font-medium text-slate-400">Signed in via GitHub</p>
          <p className="mt-1 truncate font-mono text-[11px] text-slate-500">
            {localStorage.getItem("token")?.slice(0, 12)}...
          </p>
        </div>
      )}
    </nav>
  );
}
