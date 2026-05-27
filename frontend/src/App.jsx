import './App.css'

function App() {
  return (
    <div className="app">

      <nav className="navbar">
        <div style={{display:'flex', alignItems:'center'}}>
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
          <p className="tag">AI Powered Code Review</p>

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
            <button className="primary-btn">Start Reviewing</button>
            <button className="secondary-btn">Connect GitHub</button>
          </div>
        </div>

        <div className="review-card">
          <div className="card-header">
            <span className="card-title">Live Review</span>
            <span className="card-score">7 / 10</span>
          </div>

          <div className="issue red">
            <div className="issue-icon">⚠</div>
            <div>
              <h3>Hardcoded password detected</h3>
              <p>Line 14 · High Risk · Security</p>
            </div>
          </div>

          <div className="issue yellow">
            <div className="issue-icon">⚠</div>
            <div>
              <h3>Unused variable detected</h3>
              <p>Line 22 · ESLint Warning</p>
            </div>
          </div>

          <div className="issue green">
            <div className="issue-icon">✓</div>
            <div>
              <h3>Suggested Improvement</h3>
              <p>Use async/await instead of nested promises.</p>
            </div>
          </div>
        </div>

      </section>

    </div>
  )
}

export default App