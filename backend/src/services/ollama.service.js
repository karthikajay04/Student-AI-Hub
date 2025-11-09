// src/services/ollama.service.js
const { Ollama } = require('ollama');

// Initialize the Ollama client to connect to your local server
const ollama = new Ollama({
  host: 'http://localhost:11434',
});

// The model you have downloaded and are running
const MODEL_NAME = 'deepseek-r1:8b';

/**
 * Generates a response from the local Ollama model.
 * @param {string} prompt - The user's prompt.
 * @param {string} systemPrompt - The predefined system-level instructions.
 * @returns {Promise<{text: string, source: string}>}
 */
async function generate(prompt, systemPrompt) {
  try {
    const messages = [];

    // Add the system prompt first, if it exists
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }

    // Add the user's prompt
    messages.push({ role: 'user', content: prompt });

    console.log(`[Ollama Service] Sending request to model: ${MODEL_NAME}`);

    // Call the Ollama chat API
    const chatCompletion = await ollama.chat({
      model: MODEL_NAME,
      messages: messages,
      stream: false, // We want the full response, not a stream
    });

    // Extract the text content from the response
    const text = chatCompletion.message.content;

    // Return in the same format as your reference file
    return {
      text: text,
      source: 'ollama',
    };

  } catch (error) {
    console.error("Ollama API Error:", error);
    // Check for common connection errors
    if (error.cause && error.cause.code === 'ECONNREFUSED') {
      throw new Error('Failed to connect to Ollama server. Is it running?');
    }
    throw new Error('Failed to generate content from Ollama.');
  }
}

module.exports = { generate };