function IssueCard({ title, issues, color }) {
  if (!issues || issues.length === 0) return null;

  return (
    <div>
      <h3 className="section-title">{title}</h3>
      {issues.map((item, index) => (
        <div className={`issue ${color}`} key={index}>
          <h4>{item.issue}</h4>
          <p>{item.explanation}</p>
          <p>
            <strong>Fix:</strong> {item.fix}
          </p>
        </div>
      ))}
    </div>
  );
}

export default IssueCard;
