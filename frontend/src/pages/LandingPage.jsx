import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { isGuestAuthenticated, continueAsGuest } = useAuth();

  const handleStartReviewing = () => {
    continueAsGuest();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#0B0C10]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-2xl font-bold text-transparent">
              CodeSensei
            </span>
            <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-indigo-400">
              BETA
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <span className="text-sm text-slate-500">Docs</span>
            <span className="text-sm text-slate-500">Pricing</span>
            <Link
              to="/login"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-indigo-500/50 hover:text-white"
            >
              Connect GitHub
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-20">
        <p className="mb-4 text-sm font-semibold tracking-widest text-indigo-400 uppercase">
          AI Powered Code Review
        </p>
        <h1 className="max-w-3xl text-5xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
          Your AI Senior Developer.
          <span className="mt-2 block bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">
            Available 24/7.
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-slate-400">
          Ship cleaner code with instant AI feedback. Start as a guest with paste &amp; upload —
          or connect GitHub for full repository and PR reviews.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleStartReviewing}
            className="rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(99,102,241,0.45)] transition hover:bg-indigo-500"
          >
            Start Reviewing
            {!isGuestAuthenticated && (
              <span className="ml-2 text-indigo-200/80">— Guest Mode</span>
            )}
          </button>
          <Link
            to="/login"
            className="rounded-xl border border-slate-700 bg-[#0F1016] px-8 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-indigo-500/40 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]"
          >
            Connect GitHub
          </Link>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Guest Mode",
              desc: "Paste code or upload files instantly — no login required.",
              icon: "⚡",
            },
            {
              title: "GitHub Integration",
              desc: "Review entire repositories and pull requests with OAuth.",
              icon: "🐙",
            },
            {
              title: "Live Analysis",
              desc: "IDE-style split view with streaming AI diagnostics.",
              icon: "✨",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-800 bg-[#0F1016] p-6 transition hover:border-indigo-500/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.12)]"
            >
              <span className="text-2xl">{card.icon}</span>
              <h3 className="mt-3 font-semibold text-white">{card.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
