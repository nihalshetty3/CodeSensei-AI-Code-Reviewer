function Sidebar({
  showInput,
  setShowInput,
  showGithubInput,
  code,
  setCode,
  selectedFiles,
  selectedZip,
  uploadType,
  setUploadType,
  setSelectedFiles,
  setSelectedZip,
  prUrl,
  setPrUrl,
  dropdownOpen,
  setDropdownOpen,
  repos,
  selectedRepo,
  setSelectedRepo,
  fetchingRepos,
  isAuthenticated,
  loading,
  handleConnectGitHub,
  handleDisconnectAccount,
  handlePrReview,
  handleGithubReview,
  handleReview,
  removeFile,
  toggleDropdown,
  getRepoTriggerLabel,
}) {
  return (
    <div className="left">
      <p className="tag">AI Powered Code Review</p>
      <h1>
        Your AI Senior Developer.
        <span> Available 24/7.</span>
      </h1>

      <div className="buttons">
        <button className="primary-btn" onClick={() => setShowInput(true)}>
          Start Reviewing
        </button>

        {isAuthenticated ? (
          <span
            className="secondary-btn github-status-badge"
            style={{
              cursor: "default",
              borderColor: "#232936",
              background: "#151922",
              color: "#4ade80",
            }}
            aria-label="GitHub connected"
          >
            ✓ GitHub Connected
          </span>
        ) : (
          <button
            className="secondary-btn"
            style={{ cursor: "pointer" }}
            onClick={handleConnectGitHub}
          >
            Connect GitHub
          </button>
        )}
      </div>

      {showGithubInput && (
        <div
          className="github-review-card"
          style={{ marginTop: "20px", textAlign: "left", position: "relative" }}
        >
          <div>
            <h3 style={{ margin: "0 0 12px 0", color: "#fff", fontSize: "16px" }}>
              GitHub Repository Workspace
            </h3>

            <div style={{ position: "relative", width: "100%" }}>
              <div
                role="button"
                tabIndex={0}
                onClick={toggleDropdown}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleDropdown();
                  }
                }}
                style={{
                  background: "#111",
                  border: "1px solid #30363d",
                  padding: "12px 16px",
                  borderRadius: "6px",
                  color: selectedRepo ? "#fff" : "#8b949e",
                  cursor: fetchingRepos ? "not-allowed" : "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontWeight: "500",
                }}
              >
                <span style={{ flexGrow: 1 }}>{getRepoTriggerLabel()}</span>
                <span style={{ fontSize: "12px", color: "#8b949e" }}>
                  {dropdownOpen ? "▲" : "▼"}
                </span>
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "110%",
                  left: 0,
                  width: "100%",
                  background: "#0d1117",
                  border: "1px solid #30363d",
                  borderRadius: "6px",
                  zIndex: 100,
                  maxHeight: "220px",
                  overflowY: "auto",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.6)",
                  opacity: dropdownOpen ? 1 : 0,
                  transform: dropdownOpen
                    ? "translateY(0) scale(1)"
                    : "translateY(-10px) scale(0.95)",
                  pointerEvents: dropdownOpen ? "auto" : "none",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {repos.length === 0 ? (
                  <div style={{ padding: "12px", color: "#8b949e", fontSize: "14px" }}>
                    {fetchingRepos ? "Loading repositories..." : "No repositories found."}
                  </div>
                ) : (
                  repos.map((repo) => {
                    const isSelected = selectedRepo === repo.full_name;
                    return (
                      <div
                        key={repo.full_name}
                        onClick={() => {
                          setSelectedRepo(repo.full_name);
                          setDropdownOpen(false);
                        }}
                        style={{
                          padding: "12px 16px",
                          color: isSelected ? "#fff" : "#c9d1d9",
                          background: isSelected ? "#1f242c" : "transparent",
                          cursor: "pointer",
                          borderBottom: "1px solid #21262d",
                          display: "flex",
                          flexDirection: "column",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#161b22";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = isSelected
                            ? "#1f242c"
                            : "transparent";
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "600",
                            color: isSelected ? "#6366f1" : "#f0f6fc",
                          }}
                        >
                          {repo.name}
                        </span>
                        <span
                          style={{
                            color: "#8b949e",
                            fontSize: "12px",
                            marginTop: "2px",
                          }}
                        >
                          {repo.full_name}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
              <button
                className="github-review-btn"
                onClick={handleGithubReview}
                disabled={!selectedRepo || loading}
                style={{
                  background: !selectedRepo ? "#444" : "#6366f1",
                  color: "#fff",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: !selectedRepo ? "not-allowed" : "pointer",
                  boxShadow: selectedRepo
                    ? "0px 0px 12px rgba(99, 102, 241, 0.4)"
                    : "none",
                  transition: "all 0.2s",
                }}
              >
                {loading ? "Analyzing..." : "Review Selected Repository"}
              </button>

              <button
                style={{
                  background: "transparent",
                  color: "#ff4a4a",
                  border: "none",
                  marginLeft: "25px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
                onClick={handleDisconnectAccount}
              >
                Disconnect Account
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pr-review-card">
        <h3>Review Pull Request</h3>
        <input
          type="text"
          placeholder="Paste GitHub PR URL..."
          value={prUrl}
          onChange={(e) => setPrUrl(e.target.value)}
        />
        <button onClick={handlePrReview}>Analyze PR</button>
      </div>

      {showInput && (
        <div className="review-box">
          <textarea
            placeholder="Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <div className="upload-options">
            <label className="upload-btn">
              Files
              <input
                type="file"
                hidden
                multiple
                accept=".js,.py,.java,.cpp,.txt"
                onChange={(e) => {
                  setUploadType("files");
                  setSelectedZip(null);
                  setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)]);
                }}
              />
            </label>

            <label className="upload-btn">
              Folder
              <input
                type="file"
                hidden
                multiple
                webkitdirectory=""
                directory=""
                onChange={(e) => {
                  setUploadType("folder");
                  setSelectedZip(null);
                  setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)]);
                }}
              />
            </label>

            <label className="upload-btn">
              ZIP
              <input
                type="file"
                hidden
                accept=".zip"
                onChange={(e) => {
                  setUploadType("zip");
                  setSelectedFiles([]);
                  setSelectedZip(e.target.files[0]);
                }}
              />
            </label>

            <button className="submit-btn" onClick={handleReview}>
              {loading ? "Reviewing..." : "Review Code"}
            </button>
          </div>

          <div className="files-container">
            {selectedFiles.map((file, index) => (
              <div className="file-preview" key={index}>
                <span className="file-name">{file.name}</span>
                <button className="remove-file" onClick={() => removeFile(index)}>×</button>
              </div>
            ))}

            {selectedZip && (
              <div className="file-preview">
                <span className="file-name">📦 {selectedZip.name}</span>
                <button
                  className="remove-file"
                  onClick={() => {
                    setSelectedZip(null);
                    setUploadType("");
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
