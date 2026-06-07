import axios from "axios";
import { BASE_URL, normalizeReviewResponse } from "./apiHelpers";

const CONNECTION_REFUSED_MSG =
  "Backend server connection refused. Please ensure your backend is running on http://127.0.0.1:8000";

export function handleApiError(error) {
  console.error(error);
  if (!error.response || error.message === "Network Error") {
    alert(CONNECTION_REFUSED_MSG);
  } else {
    alert(error.response?.data?.detail || "Something went wrong.");
  }
}

export async function fetchGithubRepos(token) {
  const response = await axios.get(`${BASE_URL}/github/repos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function runManualReview(code) {
  const response = await axios.post(`${BASE_URL}/review`, {
    code,
    language: "java",
  });
  return normalizeReviewResponse(response.data);
}

export async function runFileReview({ uploadType, selectedFiles, selectedZip }) {
  if (uploadType === "zip" && selectedZip) {
    const formData = new FormData();
    formData.append("file", selectedZip);
    const response = await axios.post(`${BASE_URL}/upload-zip-review`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeReviewResponse(response.data);
  }

  if (
    (uploadType === "files" || uploadType === "folder") &&
    selectedFiles.length > 0
  ) {
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));
    const response = await axios.post(`${BASE_URL}/upload-review`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeReviewResponse(response.data);
  }

  throw new Error("No files selected for upload review.");
}

export async function runGithubReview(selectedRepo, token) {
  const response = await axios.post(
    `${BASE_URL}/repository-review`,
    { repo_url: selectedRepo },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return normalizeReviewResponse(response.data);
}

export async function runPrReview(prUrl) {
  const response = await axios.post(`${BASE_URL}/pr-review`, { pr_url: prUrl });
  return normalizeReviewResponse(response.data);
}
