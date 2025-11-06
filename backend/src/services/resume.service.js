// ... other imports
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Assuming genAI is initialized here or passed in
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * UPDATED: Now accepts filePath and mimetype directly
 */
async function uploadFileToGemini(filePath, mimetype) {
  try {
    // 'file' is the object from multer, e.g., req.file
    // 'file.path' is the path to the temp file saved by multer
    // 'file.mimetype' is the file's MIME type

    console.log(`Uploading file: ${filePath} (${mimetype})`);

    // --- THIS IS THE FIX ---
    // Change from genAI.uploadFile to genAI.files.uploadFile
    const uploadedFileResponse = await genAI.files.uploadFile(filePath, {
      mimeType: mimetype,
      displayName: "resume-upload", // Using a generic name
    });
    // --- END OF FIX ---

    // The response contains the file object
    const uploadedFile = uploadedFileResponse.file;
    
    console.log(`Successfully uploaded file: ${uploadedFile.name} (${uploadedFile.uri})`);

    // Return the file object (which contains the 'name' and 'uri')
    return uploadedFile;

  } catch (error) {
    // This will now log the *original* error, which is more helpful
    console.error("Original error in uploadFileToGemini:", error); 
    
    // This passes the original error message along
    throw new Error(`Failed to upload file to Gemini: ${error.message}`);
  }
}

/**
 * UPDATED: Now accepts filePath, mimetype, and the systemPrompt
 */
async function analyzeFile(filePath, mimetype, systemPrompt) {
  // 1. Upload the file first
  const uploadedFile = await uploadFileToGemini(filePath, mimetype);

  // 2. Now you can use the file in a prompt
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    // 3. Use the systemPrompt from the controller
    systemInstruction: systemPrompt,
    // 4. Tell the model to output JSON
    generationConfig: { responseMimeType: "application/json" }
  });

  // 5. The hardcoded prompt is no longer needed here.
  // We just need to provide the file as context.
  const result = await model.generateContent([
    "Please analyze the attached resume.", // Simple instruction
    {
      fileData: {
        mimeType: uploadedFile.mimeType,
        fileUri: uploadedFile.uri,
      },
    },
  ]);

  const response = result.response;
  const text = response.text();
  
  // 6. Parse the JSON text into an object before returning
  return JSON.parse(text);
}

module.exports = {
  analyzeFile,
  // ... any other exports
};