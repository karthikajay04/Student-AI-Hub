const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notes.controller");
const authMiddleware = require("../middleware/auth");

// All routes require login
router.use(authMiddleware);

router.get("/", notesController.getNotes);
router.post("/", notesController.addNote);
router.delete("/:id", notesController.deleteNote);

module.exports = router;
