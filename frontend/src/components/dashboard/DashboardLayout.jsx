import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  handleApiError,
  runFileReview,
  runGithubReview,
  runManualReview,
  runPrReview,
} from "../../utils/reviewApi";
import SidebarNav from "./SidebarNav";
import WorkspacePanel from "./WorkspacePanel";
import LiveReviewPanel from "./LiveReviewPanel";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    isGuestMode,
    repos,
    fetchingRepos,
    disconnectGitHub,
  } = useAuth();

  const [activeTab, setActiveTab] = useState("paste");
  const [code, setCode] = useState("");
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedZip, setSelectedZip] = useState(null);
  const [uploadType, setUploadType] = useState("");

  const [selectedRepo, setSelectedRepo] = useState("");
  const [prUrl, setPrUrl] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleConnectGitHub = () => {
    navigate("/login");
  };

  const toggleDropdown = () => {
    if (fetchingRepos) return;
    setDropdownOpen((prev) => !prev);
  };

  const getRepoTriggerLabel = () => {
    if (fetchingRepos) return "Fetching repositories from GitHub...";
    if (!selectedRepo) return "Select a repository...";
    const match = repos.find((r) => r.full_name === selectedRepo);
    const name = match?.name ?? selectedRepo.split("/").pop();
    const fullName = match?.full_name ?? selectedRepo;
    return `📦 ${name} (${fullName})`;
  };

  const handleDisconnect = () => {
    disconnectGitHub();
    setSelectedRepo("");
    setDropdownOpen(false);
    if (activeTab === "github") setActiveTab("paste");
  };

  const handleFilesAdd = (files) => {
    if (!files.length) return;
    setUploadType("files");
    setSelectedZip(null);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleFolderAdd = (files) => {
    if (!files.length) return;
    setUploadType("folder");
    setSelectedZip(null);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleZipSelect = (file) => {
    setUploadType("zip");
    setSelectedFiles([]);
    setSelectedZip(file);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearZip = () => {
    setSelectedZip(null);
    setUploadType("");
  };

  const canRunAnalysis =
    activeTab === "paste"
      ? code.trim().length > 0
      : activeTab === "upload"
        ? selectedZip !== null || selectedFiles.length > 0
        : false;

  const handleRunAnalysis = async () => {
    try {
      setLoading(true);
      let result;

      if (activeTab === "paste") {
        result = await runManualReview(code);
      } else if (activeTab === "upload") {
        result = await runFileReview({ uploadType, selectedFiles, selectedZip });
      }

      setReview(result);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewRepo = async () => {
    if (!selectedRepo) {
      alert("Please select a repository first.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const result = await runGithubReview(selectedRepo, token);
      setReview(result);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewPr = async () => {
    try {
      setLoading(true);
      const result = await runPrReview(prUrl);
      setReview(result);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = useCallback(
    (tab) => {
      if (tab === "github" && isGuestMode) return;
      setActiveTab(tab);
    },
    [isGuestMode]
  );

  return (
    <div className="flex h-screen min-h-screen flex-col bg-[#0B0C10]">
      <div className="flex min-h-0 flex-1">
        <SidebarNav
          isGuestMode={isGuestMode}
          isAuthenticated={isAuthenticated}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onConnectGitHub={handleConnectGitHub}
        />

        <main className="flex min-h-0 flex-1 gap-4 p-4">
          <WorkspacePanel
            activeTab={activeTab}
            isGuestMode={isGuestMode}
            code={code}
            onCodeChange={setCode}
            selectedFiles={selectedFiles}
            selectedZip={selectedZip}
            uploadType={uploadType}
            onFilesAdd={handleFilesAdd}
            onFolderAdd={handleFolderAdd}
            onZipSelect={handleZipSelect}
            onRemoveFile={handleRemoveFile}
            onClearZip={handleClearZip}
            repos={repos}
            selectedRepo={selectedRepo}
            prUrl={prUrl}
            dropdownOpen={dropdownOpen}
            fetchingRepos={fetchingRepos}
            loading={loading}
            onSelectRepo={setSelectedRepo}
            onToggleDropdown={toggleDropdown}
            onCloseDropdown={() => setDropdownOpen(false)}
            onPrUrlChange={setPrUrl}
            onReviewRepo={handleReviewRepo}
            onReviewPr={handleReviewPr}
            onDisconnect={handleDisconnect}
            getRepoTriggerLabel={getRepoTriggerLabel}
            onRunAnalysis={handleRunAnalysis}
            canRunAnalysis={canRunAnalysis}
          />

          <div className="w-[42%] min-w-[320px] shrink-0">
            <LiveReviewPanel review={review} loading={loading} />
          </div>
        </main>
      </div>
    </div>
  );
}
