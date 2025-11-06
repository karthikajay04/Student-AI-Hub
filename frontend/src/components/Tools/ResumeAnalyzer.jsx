import React from "react";
import axios from "axios"; // Make sure to 'npm install axios'

function ResumeAnalyzer() {
  const [text, setText] = React.useState("");
  const [result, setResult] = React.useState(null);
  const [file, setFile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const inputRef = React.useRef(null);

  // --- File Handling Functions ---

  function onDrop(e) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) {
      setFile(f);
      setText(""); // Clear text
      setResult(null);
      setError("");
    }
  }

  // Triggers the hidden file input
  function onPick() {
    inputRef.current?.click();
  }

  // Handles file selection from the hidden input
  function onChange(e) {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setText(""); // Clear text
      setResult(null);
      setError("");
    }
  }

  // --- Main API Call Function ---

  async function analyze() {
    setLoading(true);
    setError("");
    setResult(null);

    // This is your backend's URL
    const backendUrl = "http://localhost:5001";

    try {
      // --- METHOD 1: Handle File Upload ---
      if (file) {
        const formData = new FormData();
        formData.append('resume', file); // 'resume' must match backend

        const response = await axios.post(
          `${backendUrl}/api/analyze-resume`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        // File analysis returns JSON directly
        setResult(response.data);

      } 
      // --- METHOD 2: Handle Text Paste ---
      else if (text) {
        // This system prompt forces the AI to return JSON
        const systemPrompt = `
          You are an expert resume analyzer. Analyze the following resume text.
          Return ONLY a valid JSON object with two keys: 
          "score" (a number from 0-100) and 
          "tips" (an array of 3-5 short, actionable tips for improvement).
          Example: {"score": 80, "tips": ["Tip 1", "Tip 2"]}
        `;

        const response = await axios.post(
          `${backendUrl}/api/generate`, // Use your existing text endpoint
          {
            prompt: text,
            systemPrompt: systemPrompt,
            service: 'gemini' // Or 'llama', 'gemini' is fine
          }
        );
        
        // The AI's response is a string, so we must parse it
        const parsedResult = JSON.parse(response.data.text);
        setResult(parsedResult);
        
      } else {
        setError("Please upload a file or paste resume text.");
      }

    } catch (err) {
      console.error("Analysis Error:", err);
      let errorMsg = "An error occurred. Please try again.";
      if (err.response) {
        errorMsg = `Error: ${err.response.data.error || 'Failed to analyze'}`;
      } else if (err.message.includes("JSON")) {
        errorMsg = "Error: Failed to parse AI response. Please try again.";
      }
      setError(errorMsg);
    } finally {
      setLoading(false); // Always stop loading
    }
  }

  // --- JSX (The Component UI) ---

  return (
    <section className="min-h-screen bg-black text-white flex justify-center items-center p-6">
      <div className="w-full max-w-2xl bg-zinc-900 rounded-2xl p-8 shadow-lg border border-zinc-800">
        <h2 className="text-3xl font-bold mb-4 text-blue-400">
          Resume Analyzer
        </h2>
        <p className="text-gray-300 mb-6">
          Upload a resume (PDF/DOCX) or paste text to get ATS-style feedback and
          a quick score.
        </p>

        {/* This hidden input is used for 'click-to-upload' */}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={onChange}
        />

        {/* This div handles BOTH drag-and-drop and click */}
        <div
          className="w-full border-2 border-dashed border-zinc-700 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={onPick} // This makes it clickable
          role="button"
          tabIndex={0}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && onPick()
          }
          aria-label="Upload resume"
        >
          {file ? (
            <div className="text-yellow-400 font-semibold">
              Selected: <span className="text-white">{file.name}</span>
            </div>
          ) : (
            <div className="text-gray-400">
              Drag & drop a resume here, or click to browse{" "}
              <span className="text-red-400">(PDF, DOCX)</span>
            </div>
          )}
        </div>

        {/* This textarea has the correct styling */}
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setFile(null); // Clears file if user types
          }}
          placeholder="Paste resume text here..."
          rows={8}
          className="w-full mt-5 p-4 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
          aria-label="Resume text"
        />

        {/* Button with Loading State */}
        <div className="mt-5 text-center">
          <button
            onClick={analyze}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold text-white transition shadow-md disabled:opacity-50"
            aria-label="Analyze resume"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="mt-4 text-center text-red-400">
            {error}
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div
            className="mt-6 bg-zinc-800 border border-zinc-700 rounded-xl p-4"
            aria-live="polite"
          >
            <div className="text-lg font-bold text-yellow-400 mb-2">
              Score:{" "}
              <span className="text-white">{result.score}/100</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              {result.tips.map((t, i) => (
                <li key={i} className="text-blue-300">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

export default ResumeAnalyzer;