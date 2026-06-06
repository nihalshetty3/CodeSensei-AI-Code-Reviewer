import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function AuthSuccess() {
  const [params] = useSearchParams();

  useEffect(() => {
    // 1. Grab the token query parameter from the URL string
    const token = params.get("token");

    if (token) {
      // 2. Save it securely inside the browser storage
      localStorage.setItem("token", token);
      
      // 3. Bounce the user right back to your main dashboard page
      window.location.href = "/";
    }
  }, [params]);

  return (
    <div style={{ color: "#fff", textAlign: "center", marginTop: "100px", fontFamily: "sans-serif" }}>
      <h2>Authenticating with CodeSensei...</h2>
      <p style={{ color: "#666" }}>Please wait while we sync your GitHub session.</p>
    </div>
  );
}

export default AuthSuccess;