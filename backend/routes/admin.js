const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');

// Admin Login Endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password.' });
  }
  
  const query = 'SELECT * FROM users WHERE username = ? AND role = "admin"';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error during admin login:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid admin credentials.' });
    }

    const admin = results[0];
    bcrypt.compare(password, admin.password, (compareErr, isMatch) => {
      if (compareErr) {
        console.error('Error comparing passwords:', compareErr);
        return res.status(500).json({ message: 'Error during authentication' });
      }
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid admin credentials.' });
      }
      
      // Build the admin data for the response without the password
      const adminData = {
        id: admin.id,
        username: admin.username,
        role: admin.role
      };
      
      res.json({
        message: 'Admin login successful.',
        user: adminData,
        token: 'admin-token' // In a real app, you would generate a JWT token here
      });
    });
  });
});

// Dashboard Statistics
router.get('/dashboard/stats', (req, res) => {
  const statsQueries = {
    totalUsers: 'SELECT COUNT(*) as count FROM users',
    activeUsers: 'SELECT COUNT(*) as count FROM users WHERE updated_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)',
    totalVenues: 'SELECT COUNT(*) as count FROM venues',
    totalEvents: 'SELECT COUNT(*) as count FROM events'
  };

  const results = {};
  let completedQueries = 0;
  const totalQueries = Object.keys(statsQueries).length;

  Object.entries(statsQueries).forEach(([key, query]) => {
    db.query(query, (err, data) => {
      if (err) {
        console.error(`Error fetching ${key}:`, err);
        return res.status(500).json({ message: 'Database error' });
      }
      
      results[key] = data[0].count;
      completedQueries++;

      if (completedQueries === totalQueries) {
        res.json(results);
      }
    });
  });
});

// Recent Activity
router.get('/activity/recent', (req, res) => {
  const query = `
    SELECT 
      'user_registered' as type,
      'person_add' as icon,
      CONCAT('New user registered: ', username) as description,
      created_at as time
    FROM users
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    UNION ALL
    SELECT 
      'event_created' as type,
      'event' as icon,
      CONCAT('New event created: ', title) as description,
      created_at as time
    FROM events
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    UNION ALL
    SELECT 
      'venue_added' as type,
      'business' as icon,
      CONCAT('New venue added: ', name) as description,
      created_at as time
    FROM venues
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    ORDER BY time DESC
    LIMIT 10
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching recent activity:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
});

module.exports = router; 