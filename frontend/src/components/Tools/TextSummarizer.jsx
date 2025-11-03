import React from "react";

function TextSummarizer() {
  const [text, setText] = React.useState("");
  const [isSummarizing, setIsSummarizing] = React.useState(false);
  const [summary, setSummary] = React.useState("");

  function summarize() {
    if (!text.trim()) return;
    setIsSummarizing(true);
    setSummary("");
    setTimeout(() => {
      setSummary(
        "This text covers key concepts in a concise manner, highlighting the most important points and takeaways."
      );
      setIsSummarizing(false);
    }, 700);
  }

  return (
    <section className="min-h-screen bg-black text-white flex justify-center items-center p-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-2 text-blue-400 text-center">
          Text Summarizer
        </h2>
        <p className="text-zinc-400 mb-6 text-center">
          Paste text to get a quick TL;DR summary.
        </p>

        <textarea
          className="w-full h-48 p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Paste or type text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex justify-center gap-4 mt-6 flex-wrap">
          <button
            onClick={summarize}
            disabled={isSummarizing}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              isSummarizing
                ? "bg-blue-800 text-zinc-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSummarizing ? "Summarizing…" : "Summarize"}
          </button>

          <button
            onClick={() => {
              setText("");
              setSummary("");
            }}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-all"
          >
            Clear
          </button>
        </div>

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
