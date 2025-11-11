// src/controllers/ai.controller.js
const geminiService = require('../services/gemini.service');
const llamaService = require('../services/llama.service');
const ollamaService = require('../services/ollama.service');
const openrouterService = require('../services/openrouter.service');
const cerebrasService = require('../services/cerebras.service');

// 🧠 Universal Generation Controller (multi-service)
const handleGeneration = async (req, res) => {
  const { prompt, systemPrompt, service } = req.body;

  if (!prompt || !service) {
    return res.status(400).json({ error: 'Prompt and service are required.' });
  }

  try {
    let result;

    switch (service) {
      case 'gemini':
        result = await geminiService.generate(prompt, systemPrompt);
        break;

      case 'llama':
        result = await llamaService.generate(prompt, systemPrompt);
        break;

      case 'ollama':
        result = await ollamaService.generate(prompt, systemPrompt);
        break;

      case 'openrouter':
        result = await openrouterService.generate(prompt, systemPrompt);
        break;

      case 'cerebras':
        result = await cerebrasService.generate(prompt, systemPrompt);
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

// ⚡ Specialized Cerebras Code Generator Controller
const handleCodeGeneration = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    // 🎯 Fixed system prompt for code generation
    const systemPrompt = `
      You are an expert software engineer and code generator.
      Generate only clean, working, well-formatted code based on the user's prompt.
      Do NOT include markdown formatting, explanations, or comments.
      Just return raw valid code.
    `;

    const result = await cerebrasService.generate(prompt, systemPrompt);

    return res.status(200).json({
      output: result.text,  
      source: 'cerebras',
    });
  } catch (error) {
    console.error('Cerebras CodeGen Error:', error.message);
    return res.status(500).json({ error: 'Failed to generate code.' });
  }
};
const handleDebugCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ error: 'Code input is required.' });
    }

    // 🧠 Choose the AI service — Llama is good for reasoning/debug tasks
    const systemPrompt = `
      You are an expert code debugger and software reviewer.
      Analyze the user's code carefully and:
      1. Identify syntax or logical errors.
      2. Suggest improvements for clarity, performance, and best practices.
      3. Provide short corrected snippets only where necessary.
      Respond in plain text (no markdown, no formatting).
    `;

    const result = await require('../services/llama.service').generate(code, systemPrompt);

    return res.status(200).json({
      output: result.text.trim(),
      source: 'llama',
    });
  } catch (error) {
    console.error('Code Debug Error:', error.message);
    return res.status(500).json({ error: 'Failed to debug code.' });
  }
};

module.exports = { handleGeneration, handleCodeGeneration,handleDebugCode, };
