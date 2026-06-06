import IssueCard from "./IssueCard";
import { hasFormattedIssues } from "../utils/apiHelpers";

function ReviewPanel({ review, loading }) {
  return (
    <div className="review-card">
      <div className="card-header">
        <span className="card-title">Live Review</span>
      </div>

      {loading && <p>Reviewing code...</p>}

      {review?.files &&
        review.files.map((file, index) => (
          <div className="review-file" key={index}>
            <h2>{file.filename || file.file_path || `File ${index + 1}`}</h2>
            <IssueCard title="🐞 Bugs" issues={file.review?.bugs || file.bugs} color="red" />
            <IssueCard title="🔒 Security" issues={file.review?.security || file.security} color="yellow" />
            <IssueCard title="⚡ Performance" issues={file.review?.performance || file.performance} color="green" />
            <IssueCard title="🧹 Code Quality" issues={file.review?.code_quality || file.code_quality} color="blue" />
          </div>
        ))}

      {review &&
        !review.files &&
        typeof review === "object" &&
        hasFormattedIssues(review) && (
          <div className="review-file">
            <h2>Pasted Code Analysis</h2>
            <IssueCard title="🐞 Bugs" issues={review.bugs || review.bug || review.errors} color="red" />
            <IssueCard title="🔒 Security" issues={review.security || review.vulnerabilities} color="yellow" />
            <IssueCard title="⚡ Performance" issues={review.performance || review.optimization} color="green" />
            <IssueCard title="🧹 Code Quality" issues={review.code_quality || review.suggestions} color="blue" />
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
  );
}

export default ReviewPanel;
