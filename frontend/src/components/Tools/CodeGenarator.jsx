import React from "react";

function CodeGenerator() {
  const [prompt, setPrompt] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [output, setOutput] = React.useState("");

 async function generate() {
  if (!prompt.trim()) return;
  setIsGenerating(true);
  setOutput("");

  try {
    const response = await fetch("http://localhost:5001/api/codegen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (data.output) {
      setOutput(data.output.trim());
    } else {
      setOutput("// Error: Could not generate code.");
    }
  } catch (error) {
    console.error("Frontend error:", error);
    setOutput("// Error: Failed to connect to backend.");
  }

  setIsGenerating(false);
}


  function copyToClipboard() {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
  }

  return (
    <section className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-[#0d0d0d] border border-blue-700 rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-yellow-400 mb-3">
          Code Generator
        </h2>
        <p className="text-gray-400 mb-4">
          Enter a detailed prompt describing the code you want to generate.
        </p>

        <textarea
          className="w-full p-4 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={8}
          placeholder="E.g., Write a JavaScript function to debounce a callback with immediate option..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <div className="flex flex-wrap gap-4 mt-4">
          <button
            onClick={generate}
            disabled={isGenerating}
            className={`px-5 py-2 rounded-lg font-semibold transition-all ${
              isGenerating
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isGenerating ? "Generating…" : "Generate Code"}
          </button>

          <button
            onClick={() => setPrompt("")}
            className="px-5 py-2 rounded-lg font-semibold bg-red-600 hover:bg-red-700 text-white transition-all"
          >
            Clear
          </button>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-3">
            <strong className="text-yellow-400">Generated Code</strong>
            <button
              onClick={copyToClipboard}
              disabled={!output}
              className={`px-4 py-1 rounded-md text-sm font-semibold transition-all ${
                output
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              Copy
            </button>
          </div>

          <pre className="bg-[#111111] border border-gray-700 rounded-lg p-4 overflow-x-auto text-sm text-gray-100">
            <code>{output || "// Your generated code will appear here."}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}

export default CodeGenerator;
