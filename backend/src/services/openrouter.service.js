// src/services/openrouter.service.js
// const fetch = require("node-fetch"); // Native fetch is available in Node 18+

/**
 * Cleans unwanted model tokens from the AI output
 * (like <s>, </s>, [OUT], [/OUT], etc.)
 */
function cleanAIResponse(text = "") {
  return text
    .replace(/<\/?s>/gi, "")              // removes <s> and </s>
    .replace(/\[OUT\]|\[\/OUT\]/gi, "")   // removes [OUT] and [/OUT]
    .replace(/\[INST\]|\[\/INST\]/gi, "") // removes [INST] and [/INST]
    .replace(/<\|.*?\|>/g, "")            // removes tokens like <|assistant|>
    .trim();
}

/**
 * Sends prompt to OpenRouter and returns AI-generated response
 */
async function generate(prompt, systemPrompt) {
  try {
    const messages = [];

    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt });
    }

    messages.push({ role: "user", content: prompt });

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:5173", // ✅ frontend URL
        "X-Title": "ai-hub", // your app name
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct", // default model
        messages,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();


    if (!data?.choices?.length) {
      throw new Error("No response from OpenRouter model");
    }

    // Clean response text from unwanted tags
    const rawText = data.choices[0].message?.content || "";
    const cleanText = cleanAIResponse(rawText);

    return {
      text: cleanText,
      source: "openrouter",
    };

  } catch (error) {
    console.error("OpenRouter API Error:", error);
    throw new Error("Failed to generate content from OpenRouter.");
  }
}

module.exports = { generate };
