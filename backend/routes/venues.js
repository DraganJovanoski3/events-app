const express = require('express');
const router = express.Router();
const db = require('../db');

// Get venue details for the current user
router.get('/details', (req, res) => {
  // Get the username from the request (you might want to get this from the auth token)
  const username = req.user?.username;
  
  if (!username) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Query to get the user's venue details
  const query = `
    SELECT bar_detail, local_name, local_email
    FROM users
    WHERE username = ?
  `;

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error fetching venue details:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    const venueData = results[0];
    
    try {
      // Parse the bar_detail JSON string
      const venueDetails = JSON.parse(venueData.bar_detail || '{}');
      
      // Return the venue details
      res.json({
        ...venueDetails,
        name: venueData.local_name || venueDetails.name,
        email: venueData.local_email || venueDetails.email
      });
    } catch (error) {
      console.error('Error parsing venue details:', error);
      res.status(500).json({ message: 'Error parsing venue details' });
    }
  });
});

module.exports = router; 