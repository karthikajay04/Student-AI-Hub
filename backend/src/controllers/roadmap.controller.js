const db = require("../db");
const aiService = require("./ai.controller"); // your existing AI handler

// ------------------ ADD MAIN ITEM ------------------
exports.addItem = async (req, res) => {
  const { title } = req.body;
  const userId = req.user.id;

  try {
    const result = await db.query(
      `INSERT INTO roadmap_items (user_id, title)
       VALUES ($1, $2)
       RETURNING *`,
      [userId, title]
    );

    res.json({ item: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to add item" });
  }
};

// ------------------ GET ALL ITEMS ------------------
exports.getItems = async (req, res) => {
  const userId = req.user.id;

  try {
    // fetch all items
    const items = await db.query(
      `SELECT * FROM roadmap_items WHERE user_id=$1 ORDER BY created_at DESC`,
      [userId]
    );

    // fetch subtasks
    const subtasks = await db.query(
      `SELECT * FROM roadmap_subtasks WHERE item_id IN (
         SELECT id FROM roadmap_items WHERE user_id=$1
       )`,
      [userId]
    );

    // group subtasks under items
    const itemsWithSubtasks = items.rows.map((item) => ({
      ...item,
      subTasks: subtasks.rows.filter((t) => t.item_id === item.id),
    }));

    res.json({ items: itemsWithSubtasks });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
};

// ------------------ UPDATE MAIN ITEM ------------------
exports.updateItem = async (req, res) => {
  const { notes, title, expanded } = req.body;
  const { id } = req.params;
  const userId = req.user.id;

  try {
    await db.query(
      `UPDATE roadmap_items SET 
          title=COALESCE($1, title),
          notes=COALESCE($2, notes),
          expanded=COALESCE($3, expanded)
       WHERE id=$4 AND user_id=$5`,
      [title, notes, expanded, id, userId]
    );

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to update" });
  }
};

// ------------------ DELETE ITEM ------------------
exports.deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM roadmap_items WHERE id=$1", [id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete" });
  }
};

// ------------------ ADD SUBTASK ------------------
exports.addSubtask = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO roadmap_subtasks (item_id, text)
       VALUES ($1, $2)
       RETURNING *`,
      [id, text]
    );

    res.json({ subtask: result.rows[0] });
  } catch {
    res.status(500).json({ error: "Failed to add subtask" });
  }
};

// ------------------ TOGGLE SUBTASK ------------------
exports.toggleSubtask = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `UPDATE roadmap_subtasks
       SET done = NOT done
       WHERE id=$1
       RETURNING *`,
      [id]
    );

    res.json({ subtask: result.rows[0] });
  } catch {
    res.status(500).json({ error: "Failed to toggle" });
  }
};

// ------------------ DELETE SUBTASK ------------------
exports.deleteSubtask = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM roadmap_subtasks WHERE id=$1", [id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete subtask" });
  }
};

// ------------------ AI GENERATION ------------------
exports.generateAI = async (req, res) => {
  const { title, systemPrompt, service } = req.body;

  try {
    const result = await aiService.handleGenerationInternal({
      prompt: title,
      systemPrompt,
      service,
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "AI generation failed" });
  }
};
