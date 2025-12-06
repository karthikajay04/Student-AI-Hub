import React from "react";
import axios from "axios";
import { API_BASE_URL } from "../../api";

function TextSummarizer() {
  const [text, setText] = React.useState("");
  const [file, setFile] = React.useState(null);
  const [isSummarizing, setIsSummarizing] = React.useState(false);
  const [summary, setSummary] = React.useState("");
  const [error, setError] = React.useState("");
  const [selectedModel, setSelectedModel] = React.useState("openrouter");
  const inputRef = React.useRef(null);

  // --- File Handling ---

  function onDrop(e) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) {
      setFile(f);
      setText("");
      setSummary("");
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
      setSummary("");
      setError("");
    }
  }

  // --- API Call ---

  async function summarize() {
    setIsSummarizing(true);
    setError("");
    setSummary("");

    const backendUrl = API_BASE_URL;

    try {
      // --- FILE MODE ---
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("service", selectedModel);

        const response = await axios.post(
          `${backendUrl}/api/summarize-text`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        setSummary(response.data.summary);
      }

      // --- TEXT MODE ---
      else if (text.trim()) {
        const response = await axios.post(`${backendUrl}/api/generate`, {
          prompt: `Please provide a concise summary of the following text. Keep it brief but capture all the key points and main ideas.\n\nText: ${text}`,
          service: selectedModel,
        });

        setSummary(response.data.text);
      } else {
        setError("Please upload a file or paste text first.");
      }
    } catch (err) {
      console.error("Summarization Error:", err);
      let errorMsg = "An error occurred. Please try again.";

      if (err.response?.data?.error) {
        errorMsg = `Error: ${err.response.data.error}`;
      }

      setError(errorMsg);
    } finally {
      setIsSummarizing(false);
    }
  }

  return (
    <section className="min-h-screen bg-black text-white flex justify-center items-center p-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-2 text-blue-400 text-center">
          Text Summarizer
        </h2>
        <p className="text-zinc-400 mb-6 text-center">
          Upload a file (PDF/TXT) or paste text to get a quick TL;DR summary.
        </p>

        {/* AI Model Selector */}
        <div className="mb-6 flex items-center justify-between bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
          <label htmlFor="model-select" className="text-sm font-medium text-zinc-300">
            AI Model:
          </label>
          <select
            id="model-select"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-4 py-2 bg-zinc-800 text-white rounded-lg border border-zinc-600
                       focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
                       cursor-pointer hover:bg-zinc-700"
          >
            <option value="cerebras">Cerebras</option>
            <option value="openrouter">OpenRouter</option>
            <option value="llama">Llama</option>
            <option value="ollama">Ollama</option>
          </select>
        </div>

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
          className="w-full border-2 border-dashed border-zinc-700 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition mb-4"
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
              Drag & drop a file here, or click to browse{" "}
              <span className="text-red-400">(PDF or TXT)</span>
            </div>
          )}
        </div>

        <textarea
          className="w-full h-48 p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Or paste text here..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setFile(null);
          }}
        />

        <div className="flex justify-center gap-4 mt-6 flex-wrap">
          <button
            onClick={summarize}
            disabled={isSummarizing}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${isSummarizing
              ? "bg-blue-800 text-zinc-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {isSummarizing ? "Summarizing…" : "Summarize"}
          </button>

          <button
            onClick={() => {
              setText("");
              setFile(null);
              setSummary("");
              setError("");
            }}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-all"
          >
            Clear
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 text-center text-red-400">{error}</div>
        )}

        <div className="mt-8 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
          <strong className="block text-yellow-400 mb-2 text-lg">
            Summary
          </strong>
          <p className="text-zinc-300">
            {summary || "Your summary will appear here."}
          </p>
        </div>
      </div>
    </section>
  );
}

export default TextSummarizer;
