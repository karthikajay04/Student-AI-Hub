// routes/api.routes.js
const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const resumeController = require('../controllers/resume.controller');
const multer = require('multer');

// -------------------- AI GENERATION ROUTES --------------------

// 🔹 Generic AI generation (used by multiple tools: codegen, textgen, etc.)
router.post('/generate', aiController.handleGeneration);

// 🔹 Dedicated route for Code Generator using Cerebras
router.post('/codegen', aiController.handleCodeGeneration);

router.post('/debug', aiController.handleDebugCode);


// -------------------- RESUME ANALYSIS ROUTES --------------------

// Set up multer for temporary file storage
const upload = multer({ dest: 'uploads/' });

// 🔹 Resume analysis route
router.post('/analyze-resume', upload.single('resume'), resumeController.handleResume);

// ---------------------------------------------------------------
// You can add other routes here later
// router.post('/login', authController.login);
// router.get('/projects', projectController.getProjects);
// ---------------------------------------------------------------

module.exports = router;
