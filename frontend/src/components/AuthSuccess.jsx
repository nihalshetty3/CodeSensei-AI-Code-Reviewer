import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard", { replace: true });
    }
  }, [params, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0C10] text-center">
      <h2 className="text-xl font-semibold text-white">Authenticating with CodeSensei...</h2>
      <p className="mt-2 text-sm text-slate-500">
        Please wait while we sync your GitHub session.
      </p>
    </div>
  );
}
