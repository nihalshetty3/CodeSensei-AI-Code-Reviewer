import "./App.css";
import { useState } from "react";
import axios from "axios";

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

  const BASE_URL = "http://127.0.0.1:8001";


  // =========================
  // REVIEW HANDLERS
  // =========================

  const handlePrReview = async () => {

    try {

      setLoading(true);

      const response = await axios.post(
        `${BASE_URL}/pr-review`,
        {
          pr_url: prUrl,
        }
      );

      setReview(response.data);

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.detail ||
        "Failed to review PR"
      );

    } finally {

      setLoading(false);

    }
  };


  const handleGithubReview = async () => {

    try {

      setLoading(true);

      const response = await axios.post(
        `${BASE_URL}/repository-review`,
        {
          repo_url: repoUrl,
        }
      );

      setReview(response.data);

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.detail ||
        "Failed to review repository"
      );

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

      setReview(response.data);

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.detail ||
        "Something went wrong while reviewing."
      );

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
  // RENDER ISSUES
  // =========================

  const renderIssues = (title, issues, color) => {

    if (!issues || issues.length === 0) return null;

    return (
      <div>

        <h3 className="section-title">
          {title}
        </h3>

        {
          issues.map((item, index) => (

            <div
              className={`issue ${color}`}
              key={index}
            >

              <h4>{item.issue}</h4>

              <p>{item.explanation}</p>

              <p>
                <strong>Fix:</strong> {item.fix}
              </p>

            </div>

          ))
        }

      </div>
    );
  };


  // =========================
  // JSX
  // =========================

  return (

    <div className="app">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div className="logo-section">

          <h1 className="logo">
            CodeSensei
          </h1>

          <span className="nav-badge">
            BETA
          </span>

        </div>

        <div className="nav-links">

          <span className="nav-link">
            Docs
          </span>

          <span className="nav-link">
            Pricing
          </span>

          <button className="nav-btn">
            Try Review
          </button>

        </div>

      </nav>


      {/* ================= HERO SECTION ================= */}

      <section className="hero">

        {/* ================= LEFT SIDE ================= */}

        <div className="left">

          <p className="tag">
            AI Powered Code Review
          </p>

          <h1>
            Your AI Senior Developer.
            <span> Available 24/7.</span>
          </h1>


          {/* ================= BUTTONS ================= */}

          <div className="buttons">

            <button
              className="primary-btn"
              onClick={() => setShowInput(true)}
            >
              Start Reviewing
            </button>

            <button
              className="secondary-btn"
              onClick={() =>
                setShowGithubInput(!showGithubInput)
              }
            >
              Connect GitHub
            </button>

          </div>


          {/* ================= GITHUB REVIEW ================= */}

          {
            showGithubInput && (

              <div className="github-review-card">

                <h3>
                  Connect GitHub Repository
                </h3>

                <input
                  className="github-input"
                  type="text"
                  placeholder="https://github.com/user/repository"
                  value={repoUrl}
                  onChange={(e) =>
                    setRepoUrl(e.target.value)
                  }
                />

                <button
                  className="github-review-btn"
                  onClick={handleGithubReview}
                >
                  Analyze Repository
                </button>

              </div>
            )
          }


          {/* ================= PR REVIEW ================= */}

          <div className="pr-review-card">

            <h3>
              Review Pull Request
            </h3>

            <input
              type="text"
              placeholder="Paste GitHub PR URL..."
              value={prUrl}
              onChange={(e) =>
                setPrUrl(e.target.value)
              }
            />

            <button onClick={handlePrReview}>
              Analyze PR
            </button>

          </div>


          {/* ================= REVIEW BOX ================= */}

          {
            showInput && (

              <div className="review-box">

                <textarea
                  placeholder="Paste your code here..."
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value)
                  }
                />



                {/* ================= UPLOAD OPTIONS ================= */}

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

        setSelectedFiles([
          ...selectedFiles,
          ...Array.from(e.target.files),
        ]);
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

        setSelectedFiles([
          ...selectedFiles,
          ...Array.from(e.target.files),
        ]);
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

        setSelectedZip(
          e.target.files[0]
        );
      }}
    />
  </label>

  <button
    className="submit-btn"
    onClick={handleReview}
  >
    {
      loading
        ? "Reviewing..."
        : "Review Code"
    }
  </button>

</div>


                {/* ================= FILE PREVIEW ================= */}

                <div className="files-container">

                  {
                    selectedFiles.map((file, index) => (

                      <div
                        className="file-preview"
                        key={index}
                      >

                        <span className="file-name">
                          {file.name}
                        </span>

                        <button
                          className="remove-file"
                          onClick={() =>
                            removeFile(index)
                          }
                        >
                          ×
                        </button>

                      </div>

                    ))
                  }


                  {
                    selectedZip && (

                      <div className="file-preview">

                        <span className="file-name">
                          📦 {selectedZip.name}
                        </span>

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
                    )
                  }

                </div>


                {/* ================= SUBMIT (moved next to upload options) ================= */}

              </div>
            )
          }

        </div>


        {/* ================= RIGHT SIDE ================= */}

        <div className="review-card">

          <div className="card-header">

            <span className="card-title">
              Live Review
            </span>

          </div>


          {
            loading && (
              <p>
                Reviewing code...
              </p>
            )
          }


          {
            review?.files?.map((file, index) => (

              <div
                className="review-file"
                key={index}
              >

                <h2>
                  {file.filename}
                </h2>

                {
                  renderIssues(
                    "🐞 Bugs",
                    file.review?.bugs,
                    "red"
                  )
                }

                {
                  renderIssues(
                    "🔒 Security",
                    file.review?.security,
                    "yellow"
                  )
                }

                {
                  renderIssues(
                    "⚡ Performance",
                    file.review?.performance,
                    "green"
                  )
                }

                {
                  renderIssues(
                    "🧹 Code Quality",
                    file.review?.code_quality,
                    "blue"
                  )
                }

              </div>

            ))
          }

        </div>

      </section>

    </div>
  );
}

export default App;