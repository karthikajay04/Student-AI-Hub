// src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api.routes');

const app = express();

// Middleware
app.use(cors()); // Allows your React app to talk to this server
app.use(express.json()); // Parses incoming JSON requests

// --- API Routes ---
// All API routes will be prefixed with /api
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});