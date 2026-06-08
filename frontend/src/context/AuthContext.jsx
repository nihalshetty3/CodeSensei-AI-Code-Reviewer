import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEV_DUMMY_REPOS, isLocalhost } from "../utils/apiHelpers";
import { fetchGithubRepos } from "../utils/reviewApi";
import {
  clearAllSessionData,
  clearGuestSession,
  isGuestSessionActive,
  setGuestSessionActive,
} from "../utils/authSession";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isGuestAuthenticated, setIsGuestAuthenticated] = useState(() =>
    isGuestSessionActive()
  );
  const [repos, setRepos] = useState([]);
  const [fetchingRepos, setFetchingRepos] = useState(false);

  const isGuestMode = !localStorage.getItem("token");

  const seedDummyRepos = useCallback(() => {
    setRepos(DEV_DUMMY_REPOS);
  }, []);

  const logout = useCallback(() => {
    clearAllSessionData();
    setIsGuestAuthenticated(false);
    setRepos([]);
  }, []);

  const clearLoginSession = useCallback(() => {
    clearGuestSession();
    setIsGuestAuthenticated(false);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    if (urlToken) {
      localStorage.setItem("token", urlToken);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isMockSession = token === "mock_dev_token";

    if (token && repos.length === 0 && !isMockSession) {
      const loadRepos = async () => {
        try {
          setFetchingRepos(true);
          const data = await fetchGithubRepos(token);
          setRepos(data);
        } catch (error) {
          console.error("Failed to fetch repositories:", error);
          if (error.response?.status === 401) {
            logout();
          }
        } finally {
          setFetchingRepos(false);
        }
      };
      loadRepos();
    }
  }, [repos.length, logout]);

  const continueAsGuest = useCallback(() => {
    setGuestSessionActive();
    setIsGuestAuthenticated(true);
  }, []);

  const connectGitHub = useCallback(() => {
    if (isLocalhost()) {
      localStorage.setItem("token", "mock_dev_token");
      seedDummyRepos();
      return;
    }
    window.location.href = "http://localhost:8000/api/auth/github";
  }, [seedDummyRepos]);

  const disconnectGitHub = useCallback(() => {
    logout();
  }, [logout]);

  const value = useMemo(
    () => ({
      isGuestAuthenticated,
      isAuthenticated: isGuestAuthenticated,
      isGuestMode,
      repos,
      fetchingRepos,
      setRepos,
      connectGitHub,
      continueAsGuest,
      clearLoginSession,
      disconnectGitHub,
      logout,
    }),
    [
      isGuestAuthenticated,
      isGuestMode,
      repos,
      fetchingRepos,
      connectGitHub,
      continueAsGuest,
      clearLoginSession,
      disconnectGitHub,
      logout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
