import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { connectGitHub } = useAuth();

  const handleGitHubLogin = () => {
    connectGitHub();
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0C10] px-6">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-[#0F1016] p-8 shadow-[0_0_40px_rgba(0,0,0,0.4)]">
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Close and return to home"
          className="absolute top-4 right-4 rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-800/40 hover:text-gray-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <Link
          to="/"
          className="mb-6 inline-block cursor-pointer bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent transition-all duration-200 hover:opacity-80 hover:brightness-110"
        >
          CodeSensei
        </Link>

        <h1 className="text-2xl font-bold text-white">Sign in to continue</h1>
        <p className="mt-2 text-sm text-slate-400">
          Unlock GitHub repository and pull request reviews.
        </p>

        <button
          type="button"
          onClick={handleGitHubLogin}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] transition hover:bg-indigo-500"
        >
          <span className="text-lg">🐙</span>
          Continue with GitHub
        </button>

        <p className="mt-6 text-center text-xs text-slate-500">
          Just want to try it?{" "}
          <Link to="/dashboard" className="text-indigo-400 hover:text-indigo-300">
            Continue as Guest
          </Link>
        </p>
      </div>
    </div>
  );
}
