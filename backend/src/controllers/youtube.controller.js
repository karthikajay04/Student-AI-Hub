// src/controllers/youtube.controller.js
const { getTranscriptText } = require("../services/youtube.service");
const openrouterService = require("../services/openrouter.service");

async function handleVideoSummary(req, res) {
  try {
    const { videoUrl, transcriptText, service = "openrouter" } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ error: "Video URL is required." });
    }

    let finalTranscript = transcriptText;

    // 1️⃣ If no manual transcript, try automatic transcript
    if (!transcriptText) {
      try {
        console.log("🎥 Fetching transcript...");
        finalTranscript = await getTranscriptText(videoUrl);
      } catch (err) {
        return res.status(400).json({
          error: "This video has no transcript available. Paste manually.",
          requiresManualTranscript: true
        });
      }
    }

    // 2️⃣ Validate transcript
    if (!finalTranscript || finalTranscript.length < 50) {
      return res.status(400).json({
        error: "Transcript too short to summarize.",
        requiresManualTranscript: true
      });
    }

    // 3️⃣ Build summarization prompt
    const prompt = `
Summarize the YouTube video into 5–8 bullet points based ONLY on the transcript.

Transcript:
${finalTranscript}

Rules:
- Accurate
- No hallucinations
- Use bullet points
`;

    // 4️⃣ Use your AI summarizer
    const result = await openrouterService.generate(prompt, "openai/gpt-4.1-mini");

    if (!result?.text) {
      return res.status(500).json({ error: "AI failed to generate summary." });
    }

    res.json({
      summary: result.text,
      transcriptUsed: transcriptText ? "manual" : "auto",
      source: "openrouter"
    });

  } catch (error) {
    console.error("Video summary error:", error);
    res.status(500).json({ error: "Server error while summarizing video." });
  }
}

module.exports = {
  handleVideoSummary
};



//hello