export const GUEST_AUTH_KEY = "isGuestAuthenticated";

export function isGuestSessionActive() {
  return localStorage.getItem(GUEST_AUTH_KEY) === "true";
}

export function isGitHubConnected() {
  return !!localStorage.getItem("token");
}

export function hasHistoryAccess() {
  return isGitHubConnected();
}

export function setGuestSessionActive() {
  localStorage.setItem(GUEST_AUTH_KEY, "true");
}

export function clearGuestSession() {
  localStorage.removeItem(GUEST_AUTH_KEY);
  localStorage.removeItem("isAuthenticated");
}

export function clearAllSessionData() {
  const reviewHistory = localStorage.getItem("review_history");
  localStorage.removeItem(GUEST_AUTH_KEY);
  localStorage.removeItem("isAuthenticated");
  localStorage.clear();
  if (reviewHistory) {
    localStorage.setItem("review_history", reviewHistory);
  }
}
