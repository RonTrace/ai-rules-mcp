require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple authentication middleware
const authenticateToken = (req, res, next) => {
  // For development, you can make this optional
  const authHeader = req.headers['authorization'];
  if (!authHeader && process.env.NODE_ENV === 'production') {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }
    
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      req.user = verified;
    } catch (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
  }
  
  next();
};

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'MCP Server is running' });
});

// Get all rule sets
app.get('/api/rules', authenticateToken, (req, res) => {
  try {
    const rulesDir = path.join(__dirname, 'rules');
    const ruleFiles = fs.readdirSync(rulesDir).filter(file => file.endsWith('.json'));
    
    const ruleSets = ruleFiles.map(file => {
      const filePath = path.join(rulesDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return {
        name: file.replace('.json', ''),
        data: JSON.parse(fileContent)
      };
    });
    
    res.json(ruleSets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific rule set
app.get('/api/rules/:name', authenticateToken, (req, res) => {
  try {
    const { name } = req.params;
    const filePath = path.join(__dirname, 'rules', `${name}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Rule set not found' });
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    res.json(JSON.parse(fileContent));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});