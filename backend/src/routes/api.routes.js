const express = require("express");
const router = express.Router();

const aiController = require("../controllers/ai.controller");
const resumeController = require("../controllers/resume.controller");
const youtubeController = require("../controllers/youtube.controller");
const multer = require("multer");

const authRoutes = require("./auth.routes");

const contactRoute = require("./contact");
const notesRoutes = require("./notes.routes");

const roadmapRoutes = require("./roadmap.routes");

// -------------------- AI GENERATION ROUTES --------------------
router.post('/generate', aiController.handleGeneration);
router.post('/codegen', aiController.handleCodeGeneration);
router.post('/debug', aiController.handleDebugCode);

// -------------------- RESUME ANALYSIS ROUTES --------------------
const upload = multer({ dest: 'uploads/' });

router.post('/analyze-resume', upload.single('resume'), resumeController.handleResume);
router.post('/summarize-text', upload.single('file'), resumeController.handleTextSummarization);
router.post('/summarize-video', youtubeController.handleVideoSummary);

// -------------------- AUTH ROUTES --------------------
router.use("/auth", authRoutes); // correct way


// contact page route
router.use("/contact", contactRoute);

// note routes
router.use("/notes", notesRoutes);


// roadmap routes
router.use("/roadmap", roadmapRoutes);

module.exports = router;
