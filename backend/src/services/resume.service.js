// src/services/resume.service.js
const fs = require("fs");
const pdf = require("pdf-parse");
const llamaService = require("./llama.service");
const openrouterService = require("./openrouter.service");
const cerebrasService = require("./cerebras.service");

/**
 * Extracts text from PDF or text-based files.
 */
async function extractText(filePath, mimetype) {
  try {
    if (mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      const extractedText = data.text.trim();

      // Check if PDF contains meaningful text
      if (extractedText.length < 50) {
        throw new Error("PDF appears to be image-based or contains very little text. Please use a text-based PDF or paste the resume text directly in the text area.");
      }

      return extractedText;
    }

    if (mimetype.startsWith("text/")) {
      return fs.readFileSync(filePath, "utf8");
    }

    throw new Error(`Unsupported file type: ${mimetype}`);
  } catch (error) {
    console.error("❌ Error extracting text:", error);
    throw new Error("Failed to extract text from file.");
  }
}

/**
 * Analyzes a resume using the selected AI service (llama, openrouter, cerebras).
 */
async function analyzeFile(
  filePath,
  mimetype,
  systemPrompt,
  service = "openrouter"
) {
  try {
    // 1️⃣ Extract resume text
    const resumeText = await extractText(filePath, mimetype);

    // 2️⃣ AI system prompt
    const jsonPrompt = `
      ${systemPrompt}

      Resume text to analyze:
      ${resumeText}

      IMPORTANT: Respond with ONLY a valid JSON object. Do not include any text before or after the JSON. The response must start with { and end with }.
    `;

    // 3️⃣ Choose the AI model
    let result;
    switch (service) {
      case "llama":
        result = await llamaService.generate(jsonPrompt, "");
        break;
      case "cerebras":
        result = await cerebrasService.generate(jsonPrompt, "");
        break;
      default:
        result = await openrouterService.generate(jsonPrompt, "");
        break;
    }

    const rawOutput = result.text.trim();

    // 4️⃣ Extract JSON safely (avoid model text noise)
    let jsonString = rawOutput;

    // Try to find JSON object in the response
    const jsonMatch = rawOutput.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    }

    // Clean up common issues
    jsonString = jsonString
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
      .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
      .trim();

    try {
      const parsed = JSON.parse(jsonString);

      // Validate that we have the expected structure
      if (typeof parsed.score === 'number' && Array.isArray(parsed.tips)) {
        return parsed;
      } else {
        throw new Error("JSON does not contain expected score and tips fields.");
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      throw new Error(`Failed to parse AI response as JSON: ${parseError.message}`);
    }
  } catch (error) {
    console.error("💥 Resume analysis error:", error);
    throw new Error("Failed to analyze resume.");
  }
}

/**
 * Summarizes text using the selected AI service.
 */
async function summarizeText(text, service = "openrouter") {
  try {
    const summaryPrompt = `
      Please provide a concise summary of the following text. Keep it brief but capture all the key points and main ideas.

      Text to summarize:
      ${text}

      Summary:
    `;

    let result;
    switch (service) {
      case "llama":
        result = await llamaService.generate(summaryPrompt, "");
        break;
      case "cerebras":
        result = await cerebrasService.generate(summaryPrompt, "");
        break;
      default:
        result = await openrouterService.generate(summaryPrompt, "");
        break;
    }

    return result.text.trim();
  } catch (error) {
    console.error("Summarization error:", error);
    throw new Error("Failed to summarize text.");
  }
}

/**
 * Extracts transcript from YouTube video URL.
 * Note: This is a placeholder implementation. In production, you would need:
 * - YouTube Data API or a transcript extraction service
 * - Proper error handling for videos without captions
 */
async function extractVideoTranscript(videoUrl) {
  try {
    // Extract video ID from YouTube URL
    const videoId = extractYouTubeVideoId(videoUrl);
    if (!videoId) {
      throw new Error('Invalid YouTube URL. Please provide a valid YouTube video link.');
    }

    // Placeholder: In a real implementation, you would:
    // 1. Use YouTube's caption API or a third-party service
    // 2. Fetch available transcripts/captions
    // 3. Return the transcript text

    // For now, return a placeholder message
    throw new Error('Video transcript extraction is not yet implemented. This would require YouTube API integration or a transcript service. Please paste the video transcript text directly in the text summarizer instead.');

  } catch (error) {
    console.error("Video transcript extraction error:", error);
    throw error;
  }
}

/**
 * Extracts YouTube video ID from various URL formats
 */
function extractYouTubeVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

module.exports = { analyzeFile, summarizeText, extractText, extractVideoTranscript };
