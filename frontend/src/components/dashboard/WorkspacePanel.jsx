import ManualPasteInput from "./ManualPasteInput";
import FileUploadInput from "./FileUploadInput";
import GitHubRepoInput from "./GitHubRepoInput";

export default function WorkspacePanel({
  activeTab,
  isGuestMode,
  code,
  onCodeChange,
  selectedFiles,
  selectedZip,
  uploadType,
  onFilesAdd,
  onFolderAdd,
  onZipSelect,
  onRemoveFile,
  onClearZip,
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
  onRunAnalysis,
  canRunAnalysis,
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-slate-800 bg-[#0B0C10]/80 p-6">
      <div className="min-h-0 flex-1 overflow-y-auto">
        {activeTab === "paste" && (
          <ManualPasteInput code={code} onCodeChange={onCodeChange} />
        )}

        {activeTab === "upload" && (
          <FileUploadInput
            selectedFiles={selectedFiles}
            selectedZip={selectedZip}
            uploadType={uploadType}
            onFilesAdd={onFilesAdd}
            onFolderAdd={onFolderAdd}
            onZipSelect={onZipSelect}
            onRemoveFile={onRemoveFile}
            onClearZip={onClearZip}
          />
        )}

        {activeTab === "github" && (
          <GitHubRepoInput
            disabled={isGuestMode}
            repos={repos}
            selectedRepo={selectedRepo}
            prUrl={prUrl}
            dropdownOpen={dropdownOpen}
            fetchingRepos={fetchingRepos}
            loading={loading}
            onSelectRepo={onSelectRepo}
            onToggleDropdown={onToggleDropdown}
            onCloseDropdown={onCloseDropdown}
            onPrUrlChange={onPrUrlChange}
            onReviewRepo={onReviewRepo}
            onReviewPr={onReviewPr}
            onDisconnect={onDisconnect}
            getRepoTriggerLabel={getRepoTriggerLabel}
          />
        )}
      </div>

      {activeTab !== "github" && (
        <div className="mt-6 border-t border-slate-800 pt-5">
          <button
            type="button"
            onClick={onRunAnalysis}
            disabled={!canRunAnalysis || loading}
            className={`rounded-lg px-6 py-3 text-sm font-semibold transition ${
              canRunAnalysis && !loading
                ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.45)] hover:bg-indigo-500"
                : "cursor-not-allowed bg-slate-700 text-slate-400"
            }`}
          >
            {loading ? "Running Analysis..." : "Run AI Analysis"}
          </button>
        </div>
      )}
    </div>
  );
}
