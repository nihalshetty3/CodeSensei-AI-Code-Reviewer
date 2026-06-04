import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

const DEV_DUMMY_REPOS = [
  { name: "CodeSensei-Frontend", full_name: "Gauthami/CodeSensei-Frontend" },
  { name: "AI-Review-Engine", full_name: "Gauthami/AI-Review-Engine" },
  { name: "OceanGuard-Dashboard", full_name: "Gauthami/OceanGuard-Dashboard" },
];

const isLocalhost = () => {
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
};

/** API wraps single-snippet results as { success, review: { bugs, ... } } */
const normalizeReviewResponse = (data) => {
  if (!data || typeof data !== "object") return data;
  if (Array.isArray(data.files)) return data;
  if (data.review && typeof data.review === "object") return data.review;
  return data;
};

const hasFormattedIssues = (data) =>
  data &&
  (data.bugs ||
    data.bug ||
    data.errors ||
    data.security ||
    data.vulnerabilities ||
    data.performance ||
    data.optimization ||
    data.code_quality ||
    data.suggestions);

function App() {

  // =========================
  // STATES
  // =========================

  const [showInput, setShowInput] = useState(false);
  const [showGithubInput, setShowGithubInput] = useState(false);

  const [code, setCode] = useState("");
  const [review, setReview] = useState(null);

  const [loading, setLoading] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedZip, setSelectedZip] = useState(null);

  const [uploadType, setUploadType] = useState("");

  const [repoUrl, setRepoUrl] = useState("");
  const [prUrl, setPrUrl] = useState("");

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const BASE_URL = "http://127.0.0.1:8000/api";

  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [fetchingRepos, setFetchingRepos] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  // =========================
  // AUTH & WORKSPACE LIFECYCLE
  // =========================
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    const storedToken = localStorage.getItem("token");

    const openAuthenticatedWorkspace = () => {
      setShowGithubInput(true);
      setRepos(DEV_DUMMY_REPOS);
    };

    if (urlToken) {
      localStorage.setItem("token", urlToken);
      setIsAuthenticated(true);
      openAuthenticatedWorkspace();
      window.history.replaceState({}, document.title, "/");
    } else if (storedToken) {
      setShowGithubInput(true);
      setRepos(DEV_DUMMY_REPOS);
    }
  }, []);

  // =========================
  // LIVE REPOSITORY FETCH (skipped when dev dummy repos are seeded)
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");
    const isMockSession = token === "mock_dev_token";

    if (
      showGithubInput &&
      isAuthenticated &&
      repos.length === 0 &&
      !isMockSession
    ) {
      const fetchRepositories = async () => {
        if (!token) return;

        try {
          setFetchingRepos(true);
          const response = await axios.get(`${BASE_URL}/github/repos`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setRepos(response.data);
        } catch (error) {
          console.error("Failed to fetch repositories:", error);
          if (error.response?.status === 401) {
            localStorage.removeItem("token");
            setIsAuthenticated(false);
            setShowGithubInput(false);
          }
        } finally {
          setFetchingRepos(false);
        }
      };

      fetchRepositories();
    }
  }, [showGithubInput, isAuthenticated, repos.length]);


  // =========================
  // CONNECT GITHUB (localhost mock vs production OAuth)
  // =========================

  const handleConnectGitHub = () => {
    if (isLocalhost()) {
      localStorage.setItem("token", "mock_dev_token");
      setIsAuthenticated(true);
      setShowGithubInput(true);
      setRepos(DEV_DUMMY_REPOS);
      return;
    }

    window.location.href = "http://localhost:8000/api/auth/github";
  };


  // =========================
  // REVIEW HANDLERS
  // =========================

  const handlePrReview = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/pr-review`,
        { pr_url: prUrl }
      );
      setReview(normalizeReviewResponse(response.data));
    } catch (error) {
      console.error(error);
      if (!error.response || error.message === "Network Error") {
        alert(
          "Backend server connection refused. Please ensure your backend is running on http://127.0.0.1:8000"
        );
      } else {
        alert(error.response?.data?.detail || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };


  const handleGithubReview = async () => {
    if (!selectedRepo) {
      alert("Please select a repository first.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${BASE_URL}/repository-review`,
        { repo_url: selectedRepo },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setReview(normalizeReviewResponse(response.data));
    } catch (error) {
      console.error(error);
      if (!error.response || error.message === "Network Error") {
        alert(
          "Backend server connection refused. Please ensure your backend is running on http://127.0.0.1:8000"
        );
      } else {
        alert(error.response?.data?.detail || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };


  const handleReview = async () => {
    try {
      setLoading(true);
      let response;

      // ================= ZIP REVIEW =================
      if (uploadType === "zip" && selectedZip) {
        const formData = new FormData();
        formData.append("file", selectedZip);

        response = await axios.post(
          `${BASE_URL}/upload-zip-review`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
      // ================= FILE/FOLDER REVIEW =================
      else if (
        (uploadType === "files" || uploadType === "folder") &&
        selectedFiles.length > 0
      ) {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append("files", file);
        });

        response = await axios.post(
          `${BASE_URL}/upload-review`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
      // ================= MANUAL CODE REVIEW =================
      else {
        response = await axios.post(
          `${BASE_URL}/review`,
          {
            code,
            language: "java",
          }
        );
      }

      setReview(normalizeReviewResponse(response.data));
    } catch (error) {
      console.error(error);
      if (!error.response || error.message === "Network Error") {
        alert(
          "Backend server connection refused. Please ensure your backend is running on http://127.0.0.1:8000"
        );
      } else {
        alert(error.response?.data?.detail || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };


  // =========================
  // REMOVE FILE
  // =========================

  const removeFile = (index) => {
    setSelectedFiles(
      selectedFiles.filter((_, i) => i !== index)
    );
  };


  // =========================
  // GITHUB DROPDOWN HELPERS
  // =========================

  const toggleDropdown = () => {
    if (fetchingRepos) return;
    setDropdownOpen((prev) => !prev);
  };

  const getRepoTriggerLabel = () => {
    if (fetchingRepos) {
      return "Fetching repositories from GitHub...";
    }
    if (!selectedRepo) {
      return "Select a repository...";
    }
    const match = repos.find((r) => r.full_name === selectedRepo);
    const name = match?.name ?? selectedRepo.split("/").pop();
    const fullName = match?.full_name ?? selectedRepo;
    return `📦 ${name} (${fullName})`;
  };


  // =========================
  // RENDER ISSUES
  // =========================

  const renderIssues = (title, issues, color) => {
    if (!issues || issues.length === 0) return null;

    return (
      <div>
        <h3 className="section-title">{title}</h3>
        {issues.map((item, index) => (
          <div className={`issue ${color}`} key={index}>
            <h4>{item.issue}</h4>
            <p>{item.explanation}</p>
            <p>
              <strong>Fix:</strong> {item.fix}
            </p>
          </div>
        ))}
      </div>
    );
  };


  // =========================
  // JSX RENDER
  // =========================

  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}
      <nav className="navbar">
        <div className="logo-section">
          <h1 className="logo">CodeSensei</h1>
          <span className="nav-badge">BETA</span>
        </div>

        <div className="nav-links">
          <span className="nav-link">Docs</span>
          <span className="nav-link">Pricing</span>
          <button className="nav-btn">Try Review</button>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="hero">

        {/* ================= LEFT SIDE INPUT PANELS ================= */}
        <div className="left">
          <p className="tag">AI Powered Code Review</p>
          <h1>
            Your AI Senior Developer.
            <span> Available 24/7.</span>
          </h1>

          {/* ================= START BUTTONS ================= */}
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

          {/* ================= GITHUB REPOSITORY WORKSPACE ================= */}
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
                    onClick={() => {
                      localStorage.removeItem("token");
                      setIsAuthenticated(false);
                      setShowGithubInput(false);
                      setRepos([]);
                      setSelectedRepo("");
                      setDropdownOpen(false);
                    }}
                  >
                    Disconnect Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= GITHUB PR REVIEW INPUT ================= */}
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

          {/* ================= WORKSPACE MANIPULATION TEXTAREA ================= */}
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

        {/* ================= RIGHT SIDE LIVE REVIEW DISPLAY ================= */}
        <div className="review-card">
          <div className="card-header">
            <span className="card-title">Live Review</span>
          </div>

          {loading && <p>Reviewing code...</p>}

          {review?.files &&
            review.files.map((file, index) => (
              <div className="review-file" key={index}>
                <h2>{file.filename || file.file_path || `File ${index + 1}`}</h2>
                {renderIssues("🐞 Bugs", file.review?.bugs || file.bugs, "red")}
                {renderIssues("🔒 Security", file.review?.security || file.security, "yellow")}
                {renderIssues("⚡ Performance", file.review?.performance || file.performance, "green")}
                {renderIssues("🧹 Code Quality", file.review?.code_quality || file.code_quality, "blue")}
              </div>
            ))}

          {review &&
            !review.files &&
            typeof review === "object" &&
            hasFormattedIssues(review) && (
            <div className="review-file">
              <h2>Pasted Code Analysis</h2>
              {renderIssues("🐞 Bugs", review.bugs || review.bug || review.errors, "red")}
              {renderIssues("🔒 Security", review.security || review.vulnerabilities, "yellow")}
              {renderIssues("⚡ Performance", review.performance || review.optimization, "green")}
              {renderIssues("🧹 Code Quality", review.code_quality || review.suggestions, "blue")}
            </div>
          )}

          {review &&
            (typeof review === "string" ||
              (!review.files && !hasFormattedIssues(review))) && (
            <div className="review-file raw-text-review">
              <h2>Analysis Report</h2>
              <div style={{ whiteSpace: "pre-wrap", textAlign: "left", lineHeight: "1.6", color: "#e0e0e0" }}>
                {typeof review === "string" ? review : JSON.stringify(review, null, 2)}
              </div>
            </div>
          )}
        </div>

      </section>
    </div>
  );
}

export default App;
