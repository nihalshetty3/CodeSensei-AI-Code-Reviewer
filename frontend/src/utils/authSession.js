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
  localStorage.removeItem(GUEST_AUTH_KEY);
  localStorage.removeItem("isAuthenticated");
  localStorage.clear();
}
