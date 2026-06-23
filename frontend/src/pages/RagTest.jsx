import { useState } from "react";
import {
  Bot,
  ExternalLink,
  FileText,
  Loader2,
  Send,
  Sparkles,
  User,
} from "lucide-react";

export default function RagTest() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(crypto.randomUUID());

  const handleSearch = async () => {
    if (!query.trim()) return;

    const userQuestion = query;

    setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: userQuestion,
        },
      ]);

    setQuery("");
    setLoading(true);

    try {
      const response = await fetch(
       "http://localhost:8001/rag/reviews/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: sessionId,
            message: userQuestion,
          }),
        }
      );

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
          provider: data.provider,
          source: data.source,
          documents: data.documents || [],
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Failed to fetch response.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0F19] text-slate-100">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 pb-32 pt-8">
        {/* Telemetry header */}
        <header className="mb-8 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 shadow-[0_0_40px_rgba(99,102,241,0.08)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 shadow-[0_0_20px_rgba(99,102,241,0.25)]">
              <Sparkles className="h-6 w-6 text-indigo-400" strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-2xl font-bold tracking-tight text-transparent md:text-3xl">
                CodeSensei RAG Engine
              </h1>
              <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Context-Aware Retrieval Active
              </span>
            </div>
          </div>
        </header>

        {/* Chat stream */}
        <div className="flex-1 space-y-6 overflow-y-auto pb-4">
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800/80 bg-slate-900/30 px-8 py-16 text-center">
              <Bot className="mb-4 h-10 w-10 text-slate-600" strokeWidth={1.5} />
              <p className="max-w-sm text-sm text-slate-500">
                Ask a question about your indexed docs — security best practices,
                React patterns, FastAPI guides, and more.
              </p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                  msg.role === "user"
                    ? "border-indigo-500/30 bg-indigo-600/20 text-indigo-300"
                    : "border-purple-500/30 bg-purple-600/20 text-purple-300"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="h-4 w-4" strokeWidth={2} />
                ) : (
                  <Bot className="h-4 w-4" strokeWidth={2} />
                )}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] ${
                  msg.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <p
                  className={`mb-1.5 text-xs font-semibold uppercase tracking-wider ${
                    msg.role === "user" ? "text-indigo-400" : "text-purple-400"
                  }`}
                >
                  {msg.role === "user" ? "You" : "CodeSensei"}
                </p>

                <div
                  className={
                    msg.role === "user"
                      ? "rounded-2xl rounded-tr-sm border border-indigo-500/20 bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-left text-slate-100 shadow-md shadow-indigo-500/20"
                      : "rounded-2xl rounded-tl-sm border border-slate-800/80 bg-slate-900/70 p-4 shadow-inner backdrop-blur-md"
                  }
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                    {msg.content}
                  </div>
                  {msg.provider && (
  <div className="mt-3">
    <span className="inline-flex items-center gap-1 rounded-lg border border-slate-700/60 bg-slate-950/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
      Provider: {msg.provider}
    </span>
  </div>
)}

                  {msg.role === "assistant" && (msg.source || msg.documents?.length > 0) && (
                    <div className="mt-4 space-y-3 border-t border-slate-800/60 pt-4">
                      {msg.source && (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                            Source
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-950/60 px-3 py-1 font-mono text-xs text-slate-300">
                            <Sparkles className="h-3 w-3 text-purple-400" />
                            {msg.source}
                          </span>
                        </div>
                      )}

                      {msg.documents?.length > 0 && (
                        <div>
                          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                            Retrieved Documents
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {msg.documents.map((doc) => (
                              <a
                                key={doc.name}
                                href={`http://localhost:8000${doc.url}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-950/60 px-3 py-1.5 font-mono text-xs text-slate-300 transition-all hover:border-purple-500/50 hover:text-purple-300 hover:shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                              >
                                <FileText className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                                {doc.name}
                                <ExternalLink className="h-3 w-3 shrink-0 opacity-60" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-purple-500/30 bg-purple-600/20">
                <Bot className="h-4 w-4 animate-pulse text-purple-300" strokeWidth={2} />
              </div>
              <div className="rounded-2xl rounded-tl-sm border border-slate-800/80 bg-slate-900/70 px-4 py-3 backdrop-blur-md">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                  <span className="animate-pulse">Retrieving context and generating answer…</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed input bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800/80 bg-[#0B0F19]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/90 p-2 shadow-[0_0_30px_rgba(0,0,0,0.35)]">
            <input
              className="flex-1 rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-3.5 text-sm text-slate-200 outline-none transition-all placeholder:text-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
              placeholder="Ask a question about your indexed documentation…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              disabled={loading}
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-105 hover:bg-purple-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              aria-label="Send message"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
