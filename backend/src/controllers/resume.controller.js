// src/controllers/resume.controller.js
const resumeService = require('../services/resume.service');
const fs = require('fs');

const handleResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No resume file uploaded.' });
  }

  try {
    const filePath = req.file.path;

    // The prompt to structure the resume
    const systemPrompt = `
      You are an expert resume analyzer. Extract the following details 
      from the provided resume and return them as a clean JSON object:
      - name (string)
      - contact (object with email and phone)
      - summary (string)
      - skills (array of strings)
      - experience (array of objects, each with company, role, and duration)
      - education (array of objects, each with school, degree, and graduation_year)
    `;

    // Call a new service function
    const structuredResume = await resumeService.analyzeFile(filePath, req.file.mimetype, systemPrompt);

    // Clean up the temporary file
    fs.unlinkSync(filePath); 

    res.json(structuredResume);

  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze resume.' });
  }
};

module.exports = { handleResume };