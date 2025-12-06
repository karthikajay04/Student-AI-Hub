// src/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import Routes
const apiRoutes = require("./routes/api.routes");

const app = express();

// ----------------- Middleware -----------------
app.use(cors({
  origin: "https://frontend-k5qm.onrender.com", // or "http://localhost:5173"
  credentials: true
}));

app.use(express.json());           // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse form-data if needed

// ------------------ API Routes ------------------
app.use("/api", apiRoutes);

// ----------------- Server Start -----------------
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
