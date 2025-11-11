// src/controllers/resume.controller.js
const resumeService = require('../services/resume.service');
const fs = require('fs');

const handleTextSummarization = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    const filePath = req.file.path;
    const service = req.body.service || 'openrouter';

    // Extract text from file
    const text = await resumeService.extractText(filePath, req.file.mimetype);

    // Summarize using AI
    const summary = await resumeService.summarizeText(text, service);

    // Clean up the temporary file
    fs.unlinkSync(filePath);

    res.json({ summary });

  } catch (error) {
    console.error('Text summarization error:', error);
    res.status(500).json({ error: 'Failed to summarize text.' });
  }
};

const handleResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No resume file uploaded.' });
  }

  try {
    const filePath = req.file.path;
    const service = req.body.service || 'openrouter';

    // The prompt for ATS evaluation
    const systemPrompt = `
      You are an expert ATS evaluator. Analyze the resume text provided below.
      Return ONLY valid JSON with two keys:
      "score" (0-100) based on resume completeness, and
      "tips" (an array of short, actionable improvement tips).
      Example: {"score":85,"tips":["Add measurable achievements","Include a summary","List your tech stack clearly"]}
    `;

    // Call service function with selected AI service
    const analysisResult = await resumeService.analyzeFile(filePath, req.file.mimetype, systemPrompt, service);

    // Clean up the temporary file
    fs.unlinkSync(filePath);

    res.json(analysisResult);

  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze resume.' });
  }
};

module.exports = { handleResume, handleTextSummarization };
