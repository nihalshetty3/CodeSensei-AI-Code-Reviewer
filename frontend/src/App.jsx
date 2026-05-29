import './App.css'
import { useState } from 'react'
import axios from 'axios'

function App() {

  const [showInput, setShowInput] = useState(false)
  const [code, setCode] = useState("")
  const [review, setReview] = useState(null)
  const [loading, setLoading] = useState(false)

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

      <nav className="navbar">

        <div style={{ display:'flex', alignItems:'center' }}>
          <h1 className="logo">CodeSensei</h1>
          <span className="nav-badge">BETA</span>
        </div>

        <div className="nav-links">
          <span className="nav-link">Docs</span>
          <span className="nav-link">Pricing</span>
          <button className="nav-btn">Try Review</button>
        </div>

      </nav>

      <section className="hero">

        <div className="left">

          <p className="tag">
            AI Powered Code Review
          </p>

          <h1>
            Your AI Senior Developer.
            <span> Available 24/7.</span>
          </h1>

          <p className="description">
            CodeSensei reviews your code using AI agents,
            ESLint, security analysis, GitHub integrations,
            and intelligent reasoning.
          </p>

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
                  placeholder="Paste your code here..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />

                <button
                  className="submit-btn"
                  onClick={handleReview}
                >
                  Review Code
                </button>

              </div>

            )
          }

        </div>

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

    

      {
        review.review.bugs?.map((bug, index) => (

          <div className="issue red" key={index}>

            <div className="issue-icon">⚠</div>

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

            <div className="issue-icon">🔒</div>

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

    

      {
        review.review.performance?.map((item, index) => (

          <div className="issue green" key={index}>

            <div className="issue-icon">🚀</div>

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