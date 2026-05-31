import './App.css'
import { useState } from 'react'
import axios from 'axios'

function App() {

  const [showInput, setShowInput] = useState(false)
  const [code, setCode] = useState("")
  const [review, setReview] = useState(null)
  const [loading, setLoading] = useState(false)
const [selectedFiles, setSelectedFiles] = useState([])

  const handleReview = async () => {

    try {

      setLoading(true)

      const response = await axios.post(
        "http://127.0.0.1:8000/api/review",
        {
          code: code,
          language: "javascript"
        }
      )

      console.log(response.data)

      setReview(response.data)

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)

    }
  }

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

          <button className="nav-btn">
            Try Review
          </button>
        </div>

      </nav>

      {/* Hero Section */}

      <section className="hero">

       {/* LEFT SIDE */}

<div className="left">

  <p className="tag">
    AI Powered Code Review
  </p>

  <h1>
    Your AI Senior Developer.
    <span> Available 24/7.</span>
  </h1>

  <div className="buttons">

    <button
      className="primary-btn"
      onClick={() => setShowInput(true)}
    >
      Start Reviewing
    </button>

    <button className="secondary-btn">
      Connect GitHub
    </button>

  </div>

  {
    showInput && (

      <div className="review-box">

        <textarea
          placeholder="Paste code or upload project ZIP..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <div className="review-actions">

          {/* Upload Button */}

          <label className="upload-btn">

            +

         <input
  type="file"
  multiple
  accept=".zip,.js,.py,.java,.cpp,.txt"
  hidden
  onChange={(e) =>
    setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)])
  }
/>
          </label>

          {/* File Preview */}

         <div className="files-container">

  {
    selectedFiles.map((file, index) => (

      <div className="file-preview" key={index}>

        <span className="file-name">
          {file.name}
        </span>

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

    ))
  }

</div>

          {/* Review Button */}

          <button
            className="submit-btn"
            onClick={handleReview}
          >
            Review Code
          </button>

        </div>

      </div>

    )
  }

</div>
        {/* RIGHT SIDE */}

        <div className="review-card">

          <div className="card-header">

            <span className="card-title">
              Live Review
            </span>

          </div>

          {
            loading && (
              <p>Reviewing code...</p>
            )
          }

          {
            review && review.review && (

              <div>

                {/* BUGS */}

                {
                  review.review.bugs?.map((bug, index) => (

                    <div className="issue red" key={index}>

                      <div className="issue-icon">
                        ⚠
                      </div>

                      <div>

                        <h3>{bug.issue}</h3>

                        <p>{bug.explanation}</p>

                        <p>
                          <strong>Fix:</strong> {bug.fix}
                        </p>

                      </div>

                    </div>

                  ))
                }

                {/* SECURITY */}

                {
                  review.review.security?.map((item, index) => (

                    <div className="issue yellow" key={index}>

                      <div className="issue-icon">
                        🔒
                      </div>

                      <div>

                        <h3>{item.issue}</h3>

                        <p>{item.explanation}</p>

                        <p>
                          <strong>Fix:</strong> {item.fix}
                        </p>

                      </div>

                    </div>

                  ))
                }

                {/* PERFORMANCE */}

                {
                  review.review.performance?.map((item, index) => (

                    <div className="issue green" key={index}>

                      <div className="issue-icon">
                        🚀
                      </div>

                      <div>

                        <h3>{item.issue}</h3>

                        <p>{item.explanation}</p>

                        <p>
                          <strong>Fix:</strong> {item.fix}
                        </p>

                      </div>

                    </div>

                  ))
                }

              </div>

            )
          }

        </div>

      </section>

    </div>

  )
}

export default App