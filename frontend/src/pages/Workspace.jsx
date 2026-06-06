import Sidebar from "../components/Sidebar";
import ReviewPanel from "../components/ReviewPanel";

function Workspace({
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
  review,
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
    <section className="hero">
      <Sidebar
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
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        repos={repos}
        selectedRepo={selectedRepo}
        setSelectedRepo={setSelectedRepo}
        fetchingRepos={fetchingRepos}
        isAuthenticated={isAuthenticated}
        loading={loading}
        handleConnectGitHub={handleConnectGitHub}
        handleDisconnectAccount={handleDisconnectAccount}
        handlePrReview={handlePrReview}
        handleGithubReview={handleGithubReview}
        handleReview={handleReview}
        removeFile={removeFile}
        toggleDropdown={toggleDropdown}
        getRepoTriggerLabel={getRepoTriggerLabel}
      />
      <ReviewPanel review={review} loading={loading} />
    </section>
  );
}

export default Workspace;
