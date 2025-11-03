// server.js
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

// --- Serve React App ---
// This part is for production.
// It assumes your React app is built into a 'build' folder.
// (You can ignore this for now if you're just in development)
/*
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}
*/

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});