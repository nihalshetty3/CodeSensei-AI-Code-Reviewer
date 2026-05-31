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
    setLoading(true);

    // FILE REVIEW
    if (selectedFiles.length > 0) {

      const formData = new FormData();

      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axios.post(
        "http://127.0.0.1:8001/upload-review",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("File Review Response");
      console.log(response.data);

      setReview(response.data);

    } else {

      // MANUAL CODE REVIEW

      const response = await axios.post(
        "http://127.0.0.1:8001/review",
        {
          code: code,
          language: "java", // or detect dynamically later
        }
      );

      console.log("Manual Review Response");
      console.log(response.data);

      setReview(response.data);
    }

  } catch (error) {

    console.error(error);

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
  review?.files?.map((file, fileIndex) => (

    <div key={fileIndex}>

      <h2>{file.filename}</h2>

      {file.review?.bugs?.map((bug, index) => (

        <div className="issue red" key={index}>
          <h3>{bug.issue}</h3>

          <p>{bug.explanation}</p>

          <p>
            <strong>Fix:</strong> {bug.fix}
          </p>
        </div>

      ))}

      {file.review?.security?.map((item, index) => (

        <div className="issue yellow" key={index}>
          <h3>{item.issue}</h3>

          <p>{item.explanation}</p>

          <p>
            <strong>Fix:</strong> {item.fix}
          </p>
        </div>

      ))}

      {file.review?.performance?.map((item, index) => (

        <div className="issue green" key={index}>
          <h3>{item.issue}</h3>

          <p>{item.explanation}</p>

          <p>
            <strong>Fix:</strong> {item.fix}
          </p>
        </div>

      ))}

      {file.review?.code_quality?.map((item, index) => (

        <div className="issue blue" key={index}>
          <h3>{item.issue}</h3>

          <p>{item.explanation}</p>

          <p>
            <strong>Fix:</strong> {item.fix}
          </p>
        </div>

      ))}

    </div>

  ))
}

        </div>

      </section>

    </div>

  )
}

export default App