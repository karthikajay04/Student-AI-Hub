import React from "react";

function ResumeAnalyzer() {
  const [text, setText] = React.useState("");
  const [result, setResult] = React.useState(null);
  const [file, setFile] = React.useState(null);
  const inputRef = React.useRef(null);

  function onDrop(e) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  }

  function onPick() {
    inputRef.current?.click();
  }

  function onChange(e) {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  }

  function analyze() {
    setResult({
      score: 78,
      tips: [
        "Use active verbs",
        "Quantify achievements",
        "Align keywords with the job posting",
      ],
    });
  }

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

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={onChange}
        />

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

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste resume text here..."
          rows={8}
          className="w-full mt-5 p-4 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
          aria-label="Resume text"
        />

        <div className="mt-5 text-center">
          <button
            onClick={analyze}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold text-white transition shadow-md"
            aria-label="Analyze resume"
          >
            Analyze
          </button>
        </div>

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
