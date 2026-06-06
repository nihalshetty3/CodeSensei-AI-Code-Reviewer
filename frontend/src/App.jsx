import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import Workspace from "./pages/Workspace";
import {
  BASE_URL,
  DEV_DUMMY_REPOS,
  isLocalhost,
  normalizeReviewResponse,
} from "./utils/apiHelpers";

function App() {
  // Input and UI States
  const [showInput, setShowInput] = useState(false);
  const [showGithubInput, setShowGithubInput] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // File Upload and Raw Input States
  const [code, setCode] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedZip, setSelectedZip] = useState(null);
  const [uploadType, setUploadType] = useState("");

  // Repository & Integration States
  const [prUrl, setPrUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState(""); // Kept for text fallback
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [fetchingRepos, setFetchingRepos] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  // Parsed Response State
  const [review, setReview] = useState(null);

  // --- Effects ---

  // Auth & Token checking
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

  // Fetch Repositories dynamically if token exists
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

  // --- Helper Functions ---

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

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

  const handleDisconnectAccount = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setShowGithubInput(false);
    setRepos([]);
    setSelectedRepo("");
    setDropdownOpen(false);
  };

  // --- API Request Handlers ---

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

  const handlePrReview = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/pr-review`, {
        pr_url: prUrl,
      });
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
    const fallbackTarget = repoUrl || selectedRepo;
    if (!fallbackTarget) {
      alert("Please select or enter a repository first.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${BASE_URL}/repository-review`,
        { repo_url: fallbackTarget },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
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

      // 1. ZIP REVIEW
      if (uploadType === "zip" && selectedZip) {
        const formData = new FormData();
        formData.append("file", selectedZip);

        response = await axios.post(`${BASE_URL}/upload-zip-review`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      // 2. FILES OR FOLDER REVIEW
      else if (
        (uploadType === "files" || uploadType === "folder") &&
        selectedFiles.length > 0
      ) {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append("files", file);
        });

        response = await axios.post(`${BASE_URL}/upload-review`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      // 3. MANUAL CODE REVIEW
      else {
        response = await axios.post(`${BASE_URL}/review`, {
          code,
          language: "java", // Dynamic language capability can be built here later
        });
      }

      setReview(normalizeReviewResponse(response.data));
    } catch (error) {
      console.error(error);
      if (!error.response || error.message === "Network Error") {
        alert(
          "Backend server connection refused. Please ensure your backend is running on http://127.0.0.1:8000"
        );
      } else {
        alert(
          error.response?.data?.detail || "Something went wrong while reviewing."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Navbar />
      <Workspace
        showInput={showInput}
        setShowInput={setShowInput}
        showGithubInput={showGithubInput}
        code={code}
        setCode={setCode}
        selectedFiles={selectedFiles}
        selectedZip={selectedZip}
        uploadType={uploadType}
        setUploadType={setUploadType}
        setSelectedFiles={setSelectedFiles}
        setSelectedZip={setSelectedZip}
        prUrl={prUrl}
        setPrUrl={setPrUrl}
        repoUrl={repoUrl}
        setRepoUrl={setRepoUrl}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        repos={repos}
        selectedRepo={selectedRepo}
        setSelectedRepo={setSelectedRepo}
        fetchingRepos={fetchingRepos}
        isAuthenticated={isAuthenticated}
        loading={loading}
        handleDisconnectAccount={handleDisconnectAccount}
        review={review}
        handleConnectGitHub={handleConnectGitHub}
        handlePrReview={handlePrReview}
        handleGithubReview={handleGithubReview}
        handleReview={handleReview}
        removeFile={removeFile}
        toggleDropdown={toggleDropdown}
        getRepoTriggerLabel={getRepoTriggerLabel}
      />
    </div>
  );
}

export default App;