const db = require("../db");

// GET all notes for logged-in user
exports.getNotes = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, title, content FROM notes WHERE user_id = $1 ORDER BY id DESC",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

// ADD a note
exports.addNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const result = await db.query(
      `INSERT INTO notes (user_id, title, content)
       VALUES ($1, $2, $3)
       RETURNING id, title, content`,
      [req.user.id, title, content]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to add note" });
  }
};

// DELETE a note
exports.deleteNote = async (req, res) => {
  try {
    await db.query(
      "DELETE FROM notes WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete note" });
  }
};
