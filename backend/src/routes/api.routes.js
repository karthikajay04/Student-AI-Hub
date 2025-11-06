// routes/api.routes.js
const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
// ... other imports
const multer = require('multer');
const resumeController = require('../controllers/resume.controller');

// Main API route for generation
// POST /api/generate
router.post('/generate', aiController.handleGeneration);



// Set up multer for temporary file storage
const upload = multer({ dest: 'uploads/' });

// A new route for resume analysis
router.post('/analyze-resume', upload.single('resume'), resumeController.handleResume);

// You can add other routes here later
// router.post('/login', authController.login);
// router.get('/projects', projectController.getProjects);

module.exports = router;