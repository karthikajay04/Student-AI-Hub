const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
const {
  getGoogleLoginURL,
  getGoogleUser,
} = require("../services/google.service");

// ------------------ SIGNUP (EMAIL + PASSWORD) ------------------
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    // Check if email already exists
    const existing = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existing.rows.length > 0)
      return res.status(409).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [name, email, passwordHash]
    );

    const user = result.rows[0];

    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(201).json({ token, user });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ------------------ LOGIN (EMAIL + PASSWORD) ------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ error: "Invalid email or password" });

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ------------------ GOOGLE LOGIN (REDIRECT TO GOOGLE) ------------------
exports.googleLogin = (req, res) => {
  try {
    const url = getGoogleLoginURL();
    return res.redirect(url);
  } catch (err) {
    console.error("Google Login Redirect Error:", err);
    res.status(500).send("Google Login failed");
  }
};

// ------------------ GOOGLE CALLBACK (GOOGLE → BACKEND → FRONTEND) ------------------
exports.googleCallback = async (req, res) => {
  try {
    const code = req.query.code;
    const googleUser = await getGoogleUser(code);

    // Check if user exists
    const existing = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [googleUser.email]
    );

    let user;

    if (existing.rows.length === 0) {
      // Insert new Google user (no password needed)
      const insert = await db.query(
        `
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email
        `,
        [googleUser.name, googleUser.email, "google_oauth_user"]
      );

      user = insert.rows[0];
    } else {
      user = existing.rows[0];
    }

    // ✅ Create JWT Token
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ Redirect to frontend WITH token + name + email
    return res.redirect(
      `${process.env.GOOGLE_AUTH_REDIRECT}?token=${encodeURIComponent(
        token
      )}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(
        user.email
      )}`
    );
  } catch (error) {
    console.error("Google Callback Error:", error);
    return res.status(500).send("Google Authentication Failed");
  }
};

// ------------------ ME (VERIFY JWT) ------------------
exports.me = async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "Unauthorized" });

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.json({ user: decoded });
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
