export default function GitHubRepoInput({
  disabled,
  repos,
  selectedRepo,
  prUrl,
  dropdownOpen,
  fetchingRepos,
  loading,
  onSelectRepo,
  onToggleDropdown,
  onCloseDropdown,
  onPrUrlChange,
  onReviewRepo,
  onReviewPr,
  onDisconnect,
  getRepoTriggerLabel,
}) {
  if (disabled) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-xl border border-slate-800 bg-[#0F1016]/40 p-10 text-center">
        <span className="mb-4 text-4xl opacity-40">🔒</span>
        <h2 className="text-lg font-semibold text-slate-300">GitHub Integration Locked</h2>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Connect your GitHub account to review repositories and pull requests.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">GitHub Repository Workspace</h2>
          <p className="mt-1 text-sm text-slate-400">
            Select a repo or paste a PR URL for deep integration review.
          </p>
        </div>
        <button
          type="button"
          onClick={onDisconnect}
          className="shrink-0 text-sm font-medium text-red-400 transition hover:text-red-300"
        >
          Disconnect
        </button>
      </div>

      <div className="relative mb-6">
        <div
          role="button"
          tabIndex={0}
          onClick={onToggleDropdown}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onToggleDropdown();
            }
          }}
          className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 transition ${
            fetchingRepos
              ? "cursor-not-allowed border-slate-700 bg-[#0F1016] text-slate-500"
              : "border-slate-600 bg-[#0F1016] text-slate-200 hover:border-indigo-500/50"
          }`}
        >
          <span className="truncate font-medium">{getRepoTriggerLabel()}</span>
          <span className="ml-2 text-xs text-slate-500">{dropdownOpen ? "▲" : "▼"}</span>
        </div>

        <div
          className="absolute top-[110%] left-0 z-50 max-h-56 w-full overflow-y-auto rounded-lg border border-slate-700 bg-[#0d1117] shadow-[0_12px_28px_rgba(0,0,0,0.6)]"
          style={{
            opacity: dropdownOpen ? 1 : 0,
            transform: dropdownOpen ? "translateY(0) scale(1)" : "translateY(-10px) scale(0.95)",
            pointerEvents: dropdownOpen ? "auto" : "none",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {repos.length === 0 ? (
            <div className="p-3 text-sm text-slate-500">
              {fetchingRepos ? "Loading repositories..." : "No repositories found."}
            </div>
          ) : (
            repos.map((repo) => {
              const isSelected = selectedRepo === repo.full_name;
              return (
                <button
                  key={repo.full_name}
                  type="button"
                  onClick={() => {
                    onSelectRepo(repo.url);
                    onCloseDropdown();
                  }}
                  className={`flex w-full flex-col border-b border-slate-800 px-4 py-3 text-left transition hover:bg-slate-800/60 ${
                    isSelected ? "bg-slate-800/80" : ""
                  }`}
                >
                  <span
                    className={`font-semibold ${isSelected ? "text-indigo-400" : "text-slate-100"}`}
                  >
                    {repo.name}
                  </span>
                  <span className="mt-0.5 text-xs text-slate-500">{repo.full_name}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onReviewRepo}
        disabled={!selectedRepo || loading}
        className={`mb-8 w-fit rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
          selectedRepo && !loading
            ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.45)] hover:bg-indigo-500"
            : "cursor-not-allowed bg-slate-700 text-slate-400"
        }`}
      >
        {loading ? "Analyzing..." : "Review Selected Repository"}
      </button>

      <div className="rounded-xl border border-slate-700/80 bg-[#0F1016]/60 p-5">
        <h3 className="mb-3 text-sm font-semibold text-white">Review Pull Request</h3>
        <input
          type="text"
          placeholder="Paste GitHub PR URL..."
          value={prUrl}
          onChange={(e) => onPrUrlChange(e.target.value)}
          className="mb-3 w-full rounded-lg border border-slate-700 bg-[#0B0C10] px-4 py-2.5 font-mono text-sm text-slate-200 outline-none transition focus:border-indigo-500 focus:shadow-[0_0_12px_rgba(99,102,241,0.2)]"
        />
        <button
          type="button"
          onClick={onReviewPr}
          disabled={!prUrl.trim() || loading}
          className="rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300 transition hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Analyze PR
        </button>
      </div>
    </div>
  );
}
