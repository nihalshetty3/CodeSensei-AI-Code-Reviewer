import { useState } from "react";

export default function RagTest() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

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
            query,
          }),
        }
      );

      const data = await response.json();

      setResult(data);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        CodeSensei RAG Test
      </h1>

      <div className="flex gap-3 mb-6">
        <input
          className="border p-3 flex-1 rounded"
          placeholder="Ask a question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 rounded"
        >
          Search
        </button>
      </div>

      {loading && (
        <p>Loading...</p>
      )}

      {result && (
        <div className="border rounded p-6">
          <h2 className="text-xl font-bold mb-4">
            Retrieval Result
          </h2>

          <p>
            <strong>Source:</strong>{" "}
            {result.source}
          </p>

          <div className="mt-4">
            <strong>Documents:</strong>

            <ul className="list-disc ml-6">
              {result.documents.map((doc) => (
                <li key={doc}>{doc}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <strong>Context:</strong>

            <pre className="bg-slate-900 text-gray-300 p-4 rounded overflow-auto whitespace-pre-wrap max-h-96">
              {result.answer}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}