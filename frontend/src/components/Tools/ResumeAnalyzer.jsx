import React from "react";
import axios from "axios";
import { API_BASE_URL } from "../../api";

function ResumeAnalyzer() {
  const [text, setText] = React.useState("");
  const [result, setResult] = React.useState(null);
  const [file, setFile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const inputRef = React.useRef(null);

  // --- File Handling ---

  function onDrop(e) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) {
      setFile(f);
      setText("");
      setResult(null);
      setError("");
    }
  }

  function onPick() {
    inputRef.current?.click();
  }

  function onChange(e) {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setText("");
      setResult(null);
      setError("");
    }
  }

  // --- Backend API Call ---

  async function analyze() {
    setLoading(true);
    setError("");
    setResult(null);

    const backendUrl = API_BASE_URL;

    try {
      // --- FILE MODE ---
      if (file) {
        const formData = new FormData();
        formData.append("resume", file);
        formData.append("service", "openrouter"); // or "llama" / "cerebras"

        const response = await axios.post(
          `${backendUrl}/api/analyze-resume`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        // This route returns structured JSON
        setResult(response.data);
      }

      // --- TEXT MODE ---
      else if (text.trim()) {
        const systemPrompt = `
          You are an expert ATS evaluator. Analyze the resume text provided below.
          Return ONLY valid JSON with two keys:
          "score" (0-100) based on resume completeness, and 
          "tips" (an array of short, actionable improvement tips).
          Example: {"score":85,"tips":["Add measurable achievements","Include a summary","List your tech stack clearly"]}
        `;

        const response = await axios.post(`${backendUrl}/api/generate`, {
          prompt: text,
          systemPrompt,
          service: "openrouter", // You can also use "llama" or "cerebras"
        });

        // AI returns text → parse JSON
        const parsed =
          response.data.text && response.data.text.match(/\{[\s\S]*\}/);
        if (!parsed) throw new Error("Invalid AI JSON format");

        const json = JSON.parse(parsed[0]);
        setResult(json);
      } else {
        setError("Please upload a file or paste resume text first.");
      }
    } catch (err) {
      console.error("Analysis Error:", err);
      let errorMsg = "An error occurred. Please try again.";

      if (err.response?.data?.error) {
        errorMsg = `Error: ${err.response.data.error}`;
      } else if (err.message.includes("JSON")) {
        errorMsg = "Error: Could not parse AI response. Try again.";
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  // --- Component UI ---
  return (
    <section className="min-h-screen bg-black text-white flex justify-center items-center p-6">
      <div className="w-full max-w-2xl bg-zinc-900 rounded-2xl p-8 shadow-lg border border-zinc-800">
        <h2 className="text-3xl font-bold mb-4 text-blue-400">Resume Analyzer</h2>
        <p className="text-gray-300 mb-6">
          Upload a resume (PDF/TXT) or paste your resume text to get an ATS-style
          score and improvement tips.
        </p>

        {/* Hidden File Input */}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt"
          className="hidden"
          onChange={onChange}
        />

        {/* Drag-and-drop Zone */}
        <div
          className="w-full border-2 border-dashed border-zinc-700 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={onPick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && onPick()
          }
        >
          {file ? (
            <div className="text-yellow-400 font-semibold">
              Selected: <span className="text-white">{file.name}</span>
            </div>
          ) : (
            <div className="text-gray-400">
              Drag & drop a resume here, or click to browse{" "}
              <span className="text-red-400">(PDF or TXT)</span>
            </div>
          )}
        </div>

        {/* Textarea */}
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setFile(null);
          }}
          placeholder="Paste resume text here..."
          rows={8}
          className="w-full mt-5 p-4 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
        />

        {/* Analyze Button */}
        <div className="mt-5 text-center">
          <button
            onClick={analyze}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold text-white transition shadow-md disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 text-center text-red-400">{error}</div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-6 bg-zinc-800 border border-zinc-700 rounded-xl p-4">
            {result.score && (
              <div className="text-lg font-bold text-yellow-400 mb-2">
                Score: <span className="text-white">{result.score}/100</span>
              </div>
            )}
            {result.tips && (
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                {result.tips.map((t, i) => (
                  <li key={i} className="text-blue-300">
                    {t}
                  </li>
                ))}
              </ul>
            )}
            {!result.score && !result.tips && (
              <pre className="text-gray-400 text-sm whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default ResumeAnalyzer;
