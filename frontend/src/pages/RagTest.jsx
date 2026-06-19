import { useState } from "react";

export default function RagTest() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

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
        "http://localhost:8000/rag/query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: userQuestion,
          }),
        }
      );

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
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
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        CodeSensei RAG Chat
      </h1>

      <div className="flex gap-3 mb-6">
        <input
          className="border p-3 flex-1 rounded"
          placeholder="Ask a question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 rounded"
        >
          Send
        </button>
      </div>

      {loading && (
        <p className="mb-4">
          Thinking...
        </p>
      )}

      <div className="space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.role === "user"
                ? "bg-blue-600 text-white p-4 rounded-lg ml-20"
                : "bg-slate-800 text-white p-4 rounded-lg mr-20"
            }
          >
            <div className="font-semibold mb-2">
              {msg.role === "user"
                ? "You"
                : "CodeSensei"}
            </div>

            <div className="whitespace-pre-wrap">
              {msg.content}
            </div>

            {msg.role === "assistant" && (
              <>
                {msg.source && (
                  <p className="text-sm text-gray-300 mt-4">
                    <strong>Source:</strong>{" "}
                    {msg.source}
                  </p>
                )}

                {msg.documents?.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-300 mb-1">
                      <strong>Documents:</strong>
                    </p>

                    <ul className="list-disc ml-5 text-sm">
                      {msg.documents.map((doc) => (
                        <li key={doc.name}>
                          <a
                            href={`http://localhost:8000${doc.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline"
                          >
                            {doc.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}