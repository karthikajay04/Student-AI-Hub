const { getTranscriptText } = require("../services/youtube.service");
const openrouterService = require("../services/openrouter.service"); // or llamaService/cerebras

async function handleVideoSummary(req, res) {
  try {
    const { videoUrl, transcriptText, service } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ error: "YouTube URL is required." });
    }

    let finalTranscript = transcriptText;

    // 1️⃣ Try to fetch transcript automatically if not provided
    if (!transcriptText) {
      console.log(`🎥 Processing video: ${videoUrl}`);
      try {
        finalTranscript = await getTranscriptText(videoUrl);
        console.log(`📝 Auto-extracted transcript length: ${finalTranscript.length} characters`);
      } catch (transcriptError) {
        console.log(`⚠️ Auto transcript extraction failed: ${transcriptError.message}`);
        return res.status(400).json({
          error: "This video doesn't have automatic transcripts available.",
          suggestion: "Please paste the video transcript manually in the text area below.",
          requiresManualTranscript: true
        });
      }
    } else {
      console.log(`📝 Manual transcript provided, length: ${transcriptText.length} characters`);
    }

    // Check if transcript is meaningful
    if (finalTranscript.length < 100) {
      return res.status(400).json({
        error: "Transcript is too short to summarize properly. Please provide a more complete transcript."
      });
    }

    // 2️⃣ Create summarization prompt with transcript
    const summarizationPrompt = `
      You are an expert at summarizing YouTube videos. Your task is to analyze the provided transcript and create a summary that captures the main points of THIS SPECIFIC VIDEO.

      VIDEO URL: ${videoUrl}
      TRANSCRIPT:
      ${finalTranscript}

      INSTRUCTIONS:
      - Read the entire transcript carefully
      - Identify the main topic and key points discussed in this video
      - Create 5-8 bullet points that summarize the core content
      - Focus ONLY on information from this transcript
      - Do not make up information or reference other videos
      - Be specific and accurate to the content provided

      SUMMARY OF THIS VIDEO:
    `;

    // 3️⃣ Send to AI summarizer
    const result = await openrouterService.generate(summarizationPrompt, "");

    res.json({
      summary: result.text,
      source: service || "openrouter",
      transcriptUsed: transcriptText ? "manual" : "auto"
    });

  } catch (error) {
    console.error("🎥 Video summarization error:", error);
    res.status(500).json({ error: "Failed to summarize video." });
  }
}

module.exports = { handleVideoSummary };
