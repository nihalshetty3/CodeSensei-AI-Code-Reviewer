import { normalizeReviewResponse } from "./apiHelpers";

export const REVIEW_HISTORY_KEY = "review_history";

function countIssues(items) {
  if (Array.isArray(items)) return items.length;
  if (items && typeof items === "object") return 1;
  return 0;
}

function toIssueArray(items) {
  if (Array.isArray(items)) return items;
  if (items && typeof items === "object") return [items];
  return [];
}

function collectIssueBlocks(review) {
  if (!review) return [];

  let payload = review;
  if (payload?.review && typeof payload.review === "object") {
    payload = payload.review;
  }
  const normalized = normalizeReviewResponse(payload);
  const blocks = [];

  if (normalized?.files && Array.isArray(normalized.files)) {
    normalized.files.forEach((file) => blocks.push(file.review || file));
  } else if (normalized && typeof normalized === "object") {
    blocks.push(normalized);
  }

  return blocks;
}

export function extractIssueCounts(review) {
  let bugsFound = 0;
  let securityIssues = 0;

  collectIssueBlocks(review).forEach((block) => {
    bugsFound += countIssues(block?.bugs || block?.bug || block?.errors);
    securityIssues += countIssues(block?.security || block?.vulnerabilities);
  });

  return { bugsFound, securityIssues };
}

const ANALYSIS_CATEGORIES = [
  { keys: ["bugs", "bug", "errors"], label: "Bugs" },
  { keys: ["security", "vulnerabilities"], label: "Security" },
  { keys: ["performance", "optimization"], label: "Performance" },
  { keys: ["code_quality", "suggestions"], label: "Code Quality" },
];

function getCategoryIssues(block, keys) {
  for (const key of keys) {
    const items = block?.[key];
    if (items) return toIssueArray(items);
  }
  return [];
}

function formatIssuesSection(issues, label) {
  if (!issues.length) return "";

  let section = `### ${label}\n\n`;
  issues.forEach((item, index) => {
    section += `${index + 1}. **${item.issue || "Issue"}**\n`;
    if (item.explanation) section += `   Explanation: ${item.explanation}\n`;
    if (item.fix) section += `   Fix: \`${item.fix}\`\n`;
    if (item.severity) section += `   Severity: ${item.severity}\n`;
    if (item.line) section += `   Line: ${item.line}\n`;
    section += "\n";
  });
  return section;
}

function formatFileAnalysis(block, filename) {
  let text = filename ? `## ${filename}\n\n` : "## Analysis\n\n";

  ANALYSIS_CATEGORIES.forEach(({ keys, label }) => {
    text += formatIssuesSection(getCategoryIssues(block, keys), label);
  });

  return text;
}

export function buildFullAnalysisText(review) {
  if (!review) return "No analysis data available.";
  if (typeof review === "string") return review;

  let payload = review;
  if (payload?.review && typeof payload.review === "object" && !payload.files) {
    payload = payload.review;
  }
  const normalized = normalizeReviewResponse(payload);
  let output = "";

  if (normalized?.summary) {
    const summaryText =
      typeof normalized.summary === "string"
        ? normalized.summary
        : JSON.stringify(normalized.summary, null, 2);
    output += `## Repository Summary\n\n${summaryText}\n\n`;
  }

  if (normalized?.files && Array.isArray(normalized.files)) {
    normalized.files.forEach((file) => {
      const filename = file.filename || file.file_path || "Unknown file";
      output += `${formatFileAnalysis(file.review || file, filename)}\n`;
    });
  } else if (normalized && typeof normalized === "object") {
    output += formatFileAnalysis(normalized, null);
  }

  const trimmed = output.trim();
  if (trimmed) return trimmed;

  return JSON.stringify(review, null, 2);
}

export function buildImpactSummary(review, bugsFound, securityIssues) {
  if (bugsFound === 0 && securityIssues === 0) {
    return "No issues detected";
  }

  for (const block of collectIssueBlocks(review)) {
    const bugs = toIssueArray(block?.bugs || block?.bug || block?.errors);
    const security = toIssueArray(block?.security || block?.vulnerabilities);
    const primary = bugs[0] || security[0];

    if (primary) {
      const text = String(primary.issue || primary.explanation || "").trim();
      if (text) {
        return text.split(/[.;!\n]/)[0].trim().slice(0, 80);
      }
    }
  }

  return "Code review analysis complete";
}

export function sanitizeHistoryRecord(record) {
  return {
    reviewDate: record?.reviewDate ?? new Date().toISOString(),
    repository: String(record?.repository ?? "Unknown"),
    prNumber: Number(record?.prNumber) || 1,
    bugsFound: Number(record?.bugsFound) || 0,
    securityIssues: Number(record?.securityIssues) || 0,
    reviewSummary: String(record?.reviewSummary ?? "No issues detected").slice(0, 120),
    fullAnalysis: String(
      record?.fullAnalysis ?? record?.reviewSummary ?? "No detailed analysis available."
    ),
  };
}

function nextPrNumber(existingHistory) {
  const max = existingHistory.reduce(
    (highest, entry) => Math.max(highest, Number(entry.prNumber) || 0),
    0
  );
  return max + 1;
}

export function buildHistoryRecord(review, repository, prNumber) {
  const { bugsFound, securityIssues } = extractIssueCounts(review);

  return sanitizeHistoryRecord({
    reviewDate: new Date().toISOString(),
    repository,
    prNumber,
    bugsFound,
    securityIssues,
    reviewSummary: buildImpactSummary(review, bugsFound, securityIssues),
    fullAnalysis: buildFullAnalysisText(review),
  });
}

export function getStoredReviewHistory() {
  try {
    const raw = localStorage.getItem(REVIEW_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(sanitizeHistoryRecord);
  } catch {
    return [];
  }
}

function persistHistoryRecord(record) {
  const existingHistory = getStoredReviewHistory();
  const cleanRecord = sanitizeHistoryRecord(record);

  localStorage.setItem(
    REVIEW_HISTORY_KEY,
    JSON.stringify([cleanRecord, ...existingHistory])
  );

  window.dispatchEvent(
    new CustomEvent("review-history-updated", { detail: cleanRecord })
  );

  return cleanRecord;
}

export function resolveUploadRepositoryName(selectedFiles, selectedZip) {
  if (selectedZip?.name) return selectedZip.name;
  if (selectedFiles?.length) return selectedFiles[0].name;
  return "uploaded-file";
}

export function saveUploadReviewToHistory(review, { selectedFiles, selectedZip }) {
  const existingHistory = getStoredReviewHistory();
  const repository = resolveUploadRepositoryName(selectedFiles, selectedZip);
  const prNumber = nextPrNumber(existingHistory);
  const record = buildHistoryRecord(review, repository, prNumber);
  return persistHistoryRecord(record);
}

export function savePasteReviewToHistory(review) {
  const existingHistory = getStoredReviewHistory();
  const prNumber = nextPrNumber(existingHistory);
  const record = buildHistoryRecord(review, "Playground Snippet", prNumber);
  return persistHistoryRecord(record);
}

export function resolveGithubRepositoryName(selectedRepo, repos = []) {
  const match = repos.find((repo) => repo.url === selectedRepo);
  if (match?.name) return match.name;
  if (match?.full_name) return match.full_name.split("/").pop();
  if (selectedRepo) {
    const parts = selectedRepo.replace(/\/$/, "").split("/");
    return parts[parts.length - 1] || selectedRepo;
  }
  return "unknown-repo";
}

export function buildGithubImpactSummary(review, bugsFound, securityIssues) {
  if (bugsFound === 0 && securityIssues === 0) {
    return "Repository review analysis completed.";
  }

  let payload = review;
  if (payload?.review && typeof payload.review === "object" && !payload.files) {
    payload = payload.review;
  }
  const normalized = normalizeReviewResponse(payload);

  if (normalized?.files && Array.isArray(normalized.files)) {
    for (const file of normalized.files) {
      const block = file.review || file;
      const filename = file.filename || file.file_path || "file";
      const bugs = toIssueArray(block?.bugs || block?.bug || block?.errors);

      if (bugs[0]) {
        const issueText = String(bugs[0].issue || bugs[0].explanation || "").trim();
        const shortIssue = issueText.split(/[.;!\n]/)[0].trim().slice(0, 60);
        if (shortIssue) return `${shortIssue} in ${filename}`;
      }
    }

    for (const file of normalized.files) {
      const block = file.review || file;
      const filename = file.filename || file.file_path || "file";
      const security = toIssueArray(block?.security || block?.vulnerabilities);

      if (security[0]) {
        const issueText = String(security[0].issue || security[0].explanation || "").trim();
        const shortIssue = issueText.split(/[.;!\n]/)[0].trim().slice(0, 60);
        if (shortIssue) return `${shortIssue} in ${filename}`;
      }
    }
  }

  return buildImpactSummary(review, bugsFound, securityIssues);
}

export function saveGithubReviewToHistory(review, { selectedRepo, repos }) {
  const repository = resolveGithubRepositoryName(selectedRepo, repos);
  const { bugsFound, securityIssues } = extractIssueCounts(review);
  const prNumber = Math.floor(Math.random() * 100) + 1;

  const record = sanitizeHistoryRecord({
    reviewDate: new Date().toISOString(),
    repository,
    prNumber,
    bugsFound,
    securityIssues,
    reviewSummary: buildGithubImpactSummary(review, bugsFound, securityIssues),
    fullAnalysis: buildFullAnalysisText(review),
  });

  return persistHistoryRecord(record);
}
