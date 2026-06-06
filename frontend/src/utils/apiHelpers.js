export const BASE_URL = "http://127.0.0.1:8000/api";

export const DEV_DUMMY_REPOS = [
  { name: "CodeSensei-Frontend", full_name: "Gauthami/CodeSensei-Frontend" },
  { name: "AI-Review-Engine", full_name: "Gauthami/AI-Review-Engine" },
  { name: "OceanGuard-Dashboard", full_name: "Gauthami/OceanGuard-Dashboard" },
];

export const isLocalhost = () => {
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
};

/** API wraps single-snippet results as { success, review: { bugs, ... } } */
export const normalizeReviewResponse = (data) => {
  if (!data || typeof data !== "object") return data;
  if (Array.isArray(data.files)) return data;
  if (data.review && typeof data.review === "object") return data.review;
  return data;
};

export const hasFormattedIssues = (data) =>
  data &&
  (data.bugs ||
    data.bug ||
    data.errors ||
    data.security ||
    data.vulnerabilities ||
    data.performance ||
    data.optimization ||
    data.code_quality ||
    data.suggestions);
