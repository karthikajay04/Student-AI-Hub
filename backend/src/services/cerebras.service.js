// src/services/cerebras.service.js
const Cerebras = require("@cerebras/cerebras_cloud_sdk");

const cerebras = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY,
});

/**
 * Sends a chat completion request to the Cerebras API
 * using the zai-glm-4.6 model.
 */
async function generate(prompt, systemPrompt) {
  try {
    const messages = [];

    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt });
    }

    messages.push({ role: "user", content: prompt });

    // 🧠 Create chat completion (stream = false for simplicity)
    const completion = await cerebras.chat.completions.create({
      model: "zai-glm-4.6",
      messages,
      stream: false, // you can set true if you want streaming
      max_completion_tokens: 40960,
      temperature: 0.6,
      top_p: 0.95,
    });

    // ✅ Extract output text safely
    const text =
      completion?.choices?.[0]?.message?.content?.trim() ||
      completion?.choices?.[0]?.delta?.content?.trim() ||
      "";

    return {
      text,
      source: "cerebras",
    };
  } catch (error) {
    console.error("Cerebras API Error:", error);
    throw new Error("Failed to generate content from Cerebras.");
  }
}

module.exports = { generate };
