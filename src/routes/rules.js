const express = require('express');
const axios = require('axios');
const router = express.Router();

// Route to get global rules
router.get('/rules', async (req, res) => {
  try {
    const githubRawUrl = process.env.GITHUB_RAW_URL;
    
    if (!githubRawUrl) {
      return res.status(500).send('GITHUB_RAW_URL environment variable is not set');
    }
    
    const response = await axios.get(githubRawUrl);
    
    // Return the raw markdown content directly, not wrapped in JSON
    res.status(200).send(response.data);
  } catch (error) {
    console.error('Error fetching rules:', error.message);
    res.status(500).send('Failed to fetch global rules: ' + error.message);
  }
});

module.exports = router;