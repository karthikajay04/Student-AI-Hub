async function getTranscriptText(videoUrl) {
  try {
    // Extract video ID
    const match = videoUrl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (!match) throw new Error("Invalid YouTube URL");

    const videoId = match[1];
    console.log(`🎥 Fetching transcript for video ID: ${videoId}`);

    // Try to use youtube-transcript package
    let transcript;
    try {
      const { YoutubeTranscript } = require("youtube-transcript");
      transcript = await YoutubeTranscript.fetchTranscript(videoId);
    } catch (packageError) {
      console.error("❌ YouTube transcript package not available:", packageError.message);
      throw new Error("YouTube transcript extraction is not configured. Please ensure the youtube-transcript package is installed.");
    }

    if (!transcript || transcript.length === 0) {
      throw new Error("No transcript available for this video.");
    }

    const transcriptText = transcript.map((t) => t.text).join(" ");
    console.log(`✅ Transcript fetched successfully! Length: ${transcriptText.length} characters`);

    // Validate transcript content
    if (transcriptText.length < 50) {
      throw new Error("Transcript is too short to summarize properly.");
    }

    return transcriptText;
  } catch (error) {
    console.error("❌ Transcript fetch failed:", error.message);
    throw new Error(`Failed to get video transcript: ${error.message}`);
  }
}

module.exports = { getTranscriptText };
