// src/controllers/ai.controller.js
const geminiService = require('../services/gemini.service');

const handleGeneration = async (req, res) => {
  // --- UPDATED ---
  // Now destructuring systemPrompt as well
  const { prompt, systemPrompt, service } = req.body;
  // --- END UPDATE ---

  if (!prompt || !service) {
    return res.status(400).json({ error: 'Prompt and service are required.' });
  }

  try {
    let result;

    switch (service) {
      case 'gemini':
        // --- UPDATED ---
        // Pass systemPrompt to the service
        result = await geminiService.generate(prompt, systemPrompt);
        // --- END UPDATE ---
        break;
      
      

      default:
        return res.status(400).json({ error: 'Invalid service selected.' });
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error(`Error in ${service} service:`, error.message);
    return res.status(500).json({ error: `An error occurred with the ${service} service.` });
  }
};

module.exports = { handleGeneration };