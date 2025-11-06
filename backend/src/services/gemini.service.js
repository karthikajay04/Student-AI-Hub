// src/services/gemini.service.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- UPDATED ---
// The function now accepts systemPrompt
async function generate(prompt, systemPrompt) {
// --- END UPDATE ---
  try {
    // --- UPDATED ---
    // Pass the systemPrompt to the model as a systemInstruction
    const model = genAI.getGenerativeModel({
      model: 'gemini-pro',
      systemInstruction: systemPrompt || undefined // Use systemPrompt if it exists
    });
    // --- END UPDATE ---

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    return { 
      text: text, 
      source: 'gemini' 
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error('Failed to generate content.');
  }
}

module.exports = { generate };