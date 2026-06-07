import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEV_DUMMY_REPOS, isLocalhost } from "../utils/apiHelpers";
import { fetchGithubRepos } from "../utils/reviewApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("token")
  );
  const [repos, setRepos] = useState([]);
  const [fetchingRepos, setFetchingRepos] = useState(false);

  const isGuestMode = !isAuthenticated;

  const seedDummyRepos = useCallback(() => {
    setRepos(DEV_DUMMY_REPOS);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
if (urlToken) {
  localStorage.setItem("token", urlToken);
  setIsAuthenticated(true);

  window.history.replaceState(
    {},
    document.title,
    window.location.pathname
  );
}
  }, [seedDummyRepos]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isMockSession = token === "mock_dev_token";

    if (isAuthenticated && repos.length === 0 && !isMockSession && token) {
      const loadRepos = async () => {
        try {
          setFetchingRepos(true);
          const data = await fetchGithubRepos(token);
          setRepos(data);
        } catch (error) {
          console.error("Failed to fetch repositories:", error);
          if (error.response?.status === 401) {
            localStorage.removeItem("token");
            setIsAuthenticated(false);
            setRepos([]);
          }
        } finally {
          setFetchingRepos(false);
        }
      };
      loadRepos();
    }
  }, [isAuthenticated, repos.length]);

  const connectGitHub = useCallback(() => {
    if (isLocalhost()) {
      localStorage.setItem("token", "mock_dev_token");
      setIsAuthenticated(true);
      seedDummyRepos();
      return;
    }
    window.location.href = "http://localhost:8000/api/auth/github";
  }, [seedDummyRepos]);

  const disconnectGitHub = useCallback(() => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setRepos([]);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isGuestMode,
      repos,
      fetchingRepos,
      setRepos,
      connectGitHub,
      disconnectGitHub,
    }),
    [
      isAuthenticated,
      isGuestMode,
      repos,
      fetchingRepos,
      connectGitHub,
      disconnectGitHub,
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
