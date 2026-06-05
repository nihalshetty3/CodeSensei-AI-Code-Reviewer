
import './App.css';
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [showInput, setShowInput] = useState(false);
  const [code, setCode] = useState("");
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedZip, setSelectedZip] = useState(null);
  const [uploadType, setUploadType] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [showGithubInput, setShowGithubInput] = useState(false);
  const [prUrl, setPrUrl] = useState("");

  const handlePrReview = async () => {
    try {
      setLoading(true);
      const response = await axios.post("http://127.0.0.1:8001/pr-review", {
        pr_url: prUrl,
      });
      setReview(response.data);
    } catch (error) {
      console.error(error.response?.data);
      alert(error.response?.data?.detail || "Failed to review PR");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubReview = async () => {
    try {
      setLoading(true);
      console.log({ repo_url: repoUrl });

      const response = await axios.post(
        "http://127.0.0.1:8001/repository-review",
        { repo_url: repoUrl }
      );
      setReview(response.data);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Failed to review repository");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    try {
      setLoading(true);
      let response;

      // ZIP REVIEW
      if (uploadType === "zip" && selectedZip) {
        const formData = new FormData();
        formData.append("file", selectedZip);

        response = await axios.post(
          "http://127.0.0.1:8001/upload-zip-review",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setReview(response.data);
      }
      // FILES OR FOLDER REVIEW
      else if (
        (uploadType === "files" || uploadType === "folder") &&
        selectedFiles.length > 0
      ) {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append("files", file);
        });

        response = await axios.post(
          "http://127.0.0.1:8001/upload-review",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setReview(response.data);
      }
      // MANUAL CODE REVIEW
      else {
        response = await axios.post("http://127.0.0.1:8001/review", {
          code,
          language: "java", // Consider making this dynamic in the future!
        });
        setReview(response.data);
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Something went wrong while reviewing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 className="logo">CodeSensei</h1>
          <span className="nav-badge">BETA</span>
        </div>
        <div className="nav-links">
          <span className="nav-link">Docs</span>
          <span className="nav-link">Pricing</span>
          <button className="nav-btn">Try Review</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        {/* LEFT SIDE */}
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
            <button
              className="secondary-btn"
              onClick={() => setShowGithubInput(true)}
            >
              Connect GitHub
            </button>
          </div>

          {showGithubInput && (
            <div className="github-review-card">
              <h3>Connect GitHub Repository</h3>
              <input
                className="github-input"
                type="text"
                placeholder="https://github.com/user/repository"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
              />
              <button
                className="github-review-btn"
                onClick={handleGithubReview}
              >
                Analyze Repository
              </button>
            </div>
          )}

          <div className="pr-review-card">
            <h3>🔀 Review Pull Request</h3>
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
                placeholder="Paste code or upload project ZIP..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />

              <div className="review-actions">
                {/* Upload Button */}
                <div className="upload-options">
                  {/* Files */}
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
                        setSelectedFiles((prev) => [
                          ...prev,
                          ...Array.from(e.target.files),
                        ]);
                      }}
                    />
                  </label>

                  {/* Folder */}
                  <label className="upload-btn">
                    Folder
                    <input
                      type="file"
                      hidden
                      multiple
                      webkitdirectory="true"
                      onChange={(e) => {
                        setUploadType("folder");
                        setSelectedZip(null);
                        setSelectedFiles((prev) => [
                          ...prev,
                          ...Array.from(e.target.files),
                        ]);
                      }}
                    />
                  </label>

                  {/* ZIP */}
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
                </div>

                {/* File Preview */}
                <div className="files-container">
                  {selectedFiles.map((file, index) => (
                    <div className="file-preview" key={index}>
                      <span className="file-name">{file.name}</span>
                      <button
                        className="remove-file"
                        onClick={() =>
                          setSelectedFiles(
                            selectedFiles.filter((_, i) => i !== index)
                          )
                        }
                      >
                        ×
                      </button>
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

                {/* Review Button */}
                <button className="submit-btn" onClick={handleReview}>
                  Review Code
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="review-card">
          <div className="card-header">
            <span className="card-title">Live Review</span>
          </div>

          {loading && <p>Reviewing code...</p>}

          {review?.files?.map((file, fileIndex) => (
            <div key={fileIndex}>
              <h2>{file.filename}</h2>

              {file.review?.bugs?.map((bug, index) => (
                <div className="issue red" key={`bug-${index}`}>
                  <h3>{bug.issue}</h3>
                  <p>{bug.explanation}</p>
                  <p>
                    <strong>Fix:</strong> {bug.fix}
                  </p>
                </div>
              ))}

              {file.review?.security?.map((item, index) => (
                <div className="issue yellow" key={`sec-${index}`}>
                  <h3>{item.issue}</h3>
                  <p>{item.explanation}</p>
                  <p>
                    <strong>Fix:</strong> {item.fix}
                  </p>
                </div>
              ))}

              {file.review?.performance?.map((item, index) => (
                <div className="issue green" key={`perf-${index}`}>
                  <h3>{item.issue}</h3>
                  <p>{item.explanation}</p>
                  <p>
                    <strong>Fix:</strong> {item.fix}
                  </p>
                </div>
              ))}

              {file.review?.code_quality?.map((item, index) => (
                <div className="issue blue" key={`cq-${index}`}>
                  <h3>{item.issue}</h3>
                  <p>{item.explanation}</p>
                  <p>
                    <strong>Fix:</strong> {item.fix}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;