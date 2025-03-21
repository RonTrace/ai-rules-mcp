const express = require('express');
const axios = require('axios');
const router = express.Router();

// Route to get global rules
router.get('/rules', async (req, res) => {
  try {
    const githubRawUrl = process.env.GITHUB_RAW_URL;
    const response = await axios.get(githubRawUrl);
    
    res.status(200).send({
      success: true,
      data: response.data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching rules:', error);
    res.status(500).send({
      success: false,
      error: 'Failed to fetch global rules',
      message: error.message
    });
  }
});

module.exports = router;