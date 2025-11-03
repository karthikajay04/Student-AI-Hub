// routes/api.routes.js
const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');

// Main API route for generation
// POST /api/generate
router.post('/generate', aiController.handleGeneration);

// You can add other routes here later
// router.post('/login', authController.login);
// router.get('/projects', projectController.getProjects);

module.exports = router;