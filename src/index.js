const express = require('express');
const cors = require('cors');
require('dotenv').config();

const rulesRoutes = require('./routes/rules');

const app = express();
const PORT = process.env.PORT || 3001; // Changed default from 3000 to 3001

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', rulesRoutes);

// Basic home route
app.get('/', (req, res) => {
  res.send('MCP Server is running. Use /api/rules to get the global rules.');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});