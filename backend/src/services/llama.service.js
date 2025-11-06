// src/services/llama.service.js
const OpenAI = require('openai');

const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: process.env.HF_TOKEN,
});

async function generate(prompt, systemPrompt) {
  try {
    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const chatCompletion = await client.chat.completions.create({
        // --- THIS IS THE FIX ---
        model: "meta-llama/Meta-Llama-3-8B-Instruct", // Removed ":novita"
        // --- END OF FIX ---
        messages: messages,
    });

    const text = chatCompletion.choices[0].message.content;
    
    return { 
      text: text, 
      source: 'llama' 
    };

  } catch (error) {
    console.error("Llama (Hugging Face) API Error:", error);
    throw new Error('Failed to generate content from Llama.');
  }
}

module.exports = { generate };