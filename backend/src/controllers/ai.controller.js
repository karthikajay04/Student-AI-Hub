// src/controllers/ai.controller.js
const geminiService = require('../services/gemini.service');
const llamaService = require('../services/llama.service');
const ollamaService=require('../services/ollama.service');

const handleGeneration = async (req, res) => {
  // Get all three inputs from the React app
  const { prompt, systemPrompt, service } = req.body;

  if (!prompt || !service) {
    return res.status(400).json({ error: 'Prompt and service are required.' });
  }

  try {
    let result;

    switch (service) {
      case 'gemini':
        // Pass both prompts to the service
        result = await geminiService.generate(prompt, systemPrompt);
        break;
      
      case 'llama':
        // Pass both prompts to the service
        result = await llamaService.generate(prompt, systemPrompt);
        break;
      case 'ollama':
        // Pass both prompts to the local ollama service
        result = await ollamaService.generate(prompt, systemPrompt);
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