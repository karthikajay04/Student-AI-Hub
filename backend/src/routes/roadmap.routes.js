const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const roadmap = require("../controllers/roadmap.controller");

// ROADMAP CRUD
router.post("/", auth, roadmap.addItem);
router.get("/", auth, roadmap.getItems);
router.put("/:id", auth, roadmap.updateItem);
router.delete("/:id", auth, roadmap.deleteItem);

// SUBTASKS
router.post("/:id/subtask", auth, roadmap.addSubtask);
router.put("/subtask/:id", auth, roadmap.toggleSubtask);
router.delete("/subtask/:id", auth, roadmap.deleteSubtask);

// AI GENERATION
router.post("/generate", auth, roadmap.generateAI);

module.exports = router;
