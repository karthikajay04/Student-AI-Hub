import React from 'react';

function VideoSummarizer() {
  // Changed `file` state to `videoUrl` state
  const [videoUrl, setVideoUrl] = React.useState('');
  const [progress, setProgress] = React.useState(0);
  const [summary, setSummary] = React.useState('');

  // Removed onDrop, onPick, onChange, and inputRef as they are no longer needed

  function summarize() {
    // Check for videoUrl instead of file
    if (!videoUrl) return;

    // Validate the URL (simple check)
    if (!videoUrl.startsWith('http://') && !videoUrl.startsWith('https://')) {
      alert('Please enter a valid video URL (e.g., http://... or https://...)');
      return;
    }

    setSummary('');
    setProgress(0);
    const steps = [10, 25, 50, 70, 100];
    let i = 0;
    const id = setInterval(() => {
      setProgress(steps[i]);
      i++;
      if (i === steps.length) {
        clearInterval(id);
        setSummary(
          'This video discusses core data structures and algorithms, presenting practical examples and a concise review of complexity.'
        );
      }
    }, 300);
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

        {/* Added new URL input field */}
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

        {progress > 0 && progress < 100 && (
          <div className="w-full bg-gray-800 h-2 rounded-full mt-6">
            <div
              className="bg-gradient-to-r from-blue-400 via-red-400 to-yellow-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="flex justify-center gap-4 mt-8">
          <button
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition
                       disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={summarize}
            // Disable button if videoUrl is empty
            disabled={!videoUrl}
          >
            Summarize Video
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold transition"
            onClick={() => {
              // Reset videoUrl instead of file
              setVideoUrl('');
              setProgress(0);
              setSummary('');
            }}
          >
            Reset
          </button>
        </div>

        <div className="mt-10 bg-gray-900 p-6 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">Summary</h3>
          <p className="text-gray-300">
            {summary || '// The summary will appear here after processing.'}
          </p>
        </div>
      </div>
    </section>
  );
}

export default VideoSummarizer;