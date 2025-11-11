import React from 'react';
import axios from 'axios';

function VideoSummarizer() {
  const [videoUrl, setVideoUrl] = React.useState('');
  const [transcriptText, setTranscriptText] = React.useState('');
  const [requiresManualTranscript, setRequiresManualTranscript] = React.useState(false);
  const [isSummarizing, setIsSummarizing] = React.useState(false);
  const [summary, setSummary] = React.useState('');
  const [error, setError] = React.useState('');

  async function summarize() {
    if (!videoUrl.trim()) return;

    // Basic URL validation
    if (!videoUrl.startsWith('http://') && !videoUrl.startsWith('https://')) {
      setError('Please enter a valid video URL (e.g., http://... or https://...)');
      return;
    }

    // If manual transcript is required but not provided, show error
    if (requiresManualTranscript && !transcriptText.trim()) {
      setError('Please paste the video transcript in the text area below.');
      return;
    }

    setIsSummarizing(true);
    setError('');
    setSummary('');

    const backendUrl = "http://localhost:5001";

    try {
      const requestData = {
        videoUrl: videoUrl.trim(),
        service: "openrouter",
      };

      // Include transcript if manually provided
      if (transcriptText.trim()) {
        requestData.transcriptText = transcriptText.trim();
      }

      const response = await axios.post(`${backendUrl}/api/summarize-video`, requestData);

      // Check if manual transcript is required
      if (response.data.requiresManualTranscript) {
        setRequiresManualTranscript(true);
        setError(response.data.error);
        return;
      }

      setSummary(response.data.summary);
      setRequiresManualTranscript(false); // Reset if successful
    } catch (err) {
      console.error("Video summarization error:", err);

      if (err.response?.data?.requiresManualTranscript) {
        setRequiresManualTranscript(true);
        setError(err.response.data.error);
      } else {
        let errorMsg = "An error occurred. Please try again.";
        if (err.response?.data?.error) {
          errorMsg = `Error: ${err.response.data.error}`;
        }
        setError(errorMsg);
      }
    } finally {
      setIsSummarizing(false);
    }
  }

  return (
    <section className="min-h-screen bg-black text-white flex justify-center items-center py-12">
      <div className="w-full max-w-3xl bg-[#0d0d0d] p-8 rounded-2xl shadow-lg border border-blue-500/20">
        <h2 className="text-3xl font-bold text-blue-400 mb-4 text-center">🎬 Video Summarizer</h2>
        <p className="text-gray-300 text-center mb-8">
          Paste a video link (e.g., YouTube, Vimeo) to generate a quick{' '}
          <span className="text-yellow-400">TL;DR</span>.
        </p>

        {/* Removed file input and drag-and-drop area */}

        {/* Video URL input field */}
        <div className="my-6">
          <label htmlFor="video-url" className="block text-sm font-medium text-gray-300 mb-2">
            Video Link
          </label>
          <input
            id="video-url"
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="e.g., https://www.youtube.com/watch?v=..."
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg
                       border border-gray-700
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       transition-all"
          />
        </div>

        {/* Manual transcript input (shown when required) */}
        {requiresManualTranscript && (
          <div className="my-6">
            <label htmlFor="transcript-text" className="block text-sm font-medium text-gray-300 mb-2">
              Video Transcript (Required)
            </label>
            <textarea
              id="transcript-text"
              value={transcriptText}
              onChange={(e) => setTranscriptText(e.target.value)}
              placeholder="Paste the video transcript here..."
              rows={8}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg
                         border border-gray-700
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         transition-all resize-none"
            />
            <p className="text-sm text-gray-400 mt-2">
              💡 Tip: You can get the transcript by clicking the CC button on YouTube and copying the text.
            </p>
          </div>
        )}



        <div className="flex justify-center gap-4 mt-8">
          <button
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              isSummarizing
                ? "bg-blue-800 text-zinc-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={summarize}
            disabled={isSummarizing || !videoUrl.trim()}
          >
            {isSummarizing ? "Summarizing…" : "Summarize Video"}
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold transition"
            onClick={() => {
              setVideoUrl('');
              setTranscriptText('');
              setRequiresManualTranscript(false);
              setSummary('');
              setError('');
            }}
          >
            Clear
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 text-center text-red-400">{error}</div>
        )}

        <div className="mt-10 bg-gray-900 p-6 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">Summary</h3>
          <p className="text-gray-300">
            {summary || "// The summary will appear here after processing."}
          </p>
        </div>
      </div>
    </section>
  );
}

export default VideoSummarizer;
