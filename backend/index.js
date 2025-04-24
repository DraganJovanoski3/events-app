// index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// Use bcryptjs as a drop-in replacement if needed:
// const bcrypt = require('bcryptjs');
const bcrypt = require('bcrypt');
const db = require('./db');
const adminRoutes = require('./routes/admin');

const app = express();
const port = 3001;
const saltRounds = 10;

// Increase payload size limit
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());
app.use(express.json());

// Admin routes
app.use('/api/admin', adminRoutes);

// Registration Endpoint
app.post('/auth/register', (req, res) => {
  // Destructure the request body
  const { username, password, role, barDetail, localName, localEmail } = req.body;

  // Check for required fields
  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  // Check if the user already exists
  const checkQuery = 'SELECT * FROM users WHERE username = ?';
  db.query(checkQuery, [username], (err, results) => {
    if (err) {
      console.error('Error checking user existence:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.length > 0) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash the password
    bcrypt.hash(password, saltRounds, (hashErr, hash) => {
      if (hashErr) {
        console.error('Error hashing password:', hashErr);
        return res.status(500).json({ message: 'Error processing password' });
      }

      // Insert the new user into the database
      const insertQuery = `
        INSERT INTO users (
          username, 
          password, 
          role,
          bar_detail, 
          local_name, 
          local_email
        ) VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      db.query(
        insertQuery,
        [username, hash, role, barDetail || null, localName || null, localEmail || null],
        (insertErr, results) => {
          if (insertErr) {
            console.error('Error inserting user:', insertErr);
            return res.status(500).json({ message: 'Database error' });
          }
          
          // Build the user object without the password field
          const user = {
            id: results.insertId,
            username,
            role,
            bar_detail: barDetail,
            local_name: localName,
            local_email: localEmail
          };
          
          res.status(201).json({
            message: 'User registered successfully.',
            user
          });
        }
      );
    });
  });
});

// Home Endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Events API');
});

// Login Endpoint
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password.' });
  }
  
  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = results[0];
    // Compare the provided password with the stored hashed password
    bcrypt.compare(password, user.password, (compareErr, isMatch) => {
      if (compareErr) {
        console.error('Error comparing passwords:', compareErr);
        return res.status(500).json({ message: 'Error during authentication' });
      }
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
      
      // Build the user data for the response without the password
      const userData = {
        id: user.id,
        username: user.username,
        role: user.role,
        bar_detail: user.bar_detail,
        local_name: user.local_name,
        local_email: user.local_email
      };
      
      res.json({
        message: 'Login successful.',
        user: userData
      });
    });
  });
});

// Update Venue Endpoint
app.put('/api/venue', (req, res) => {
  // Expecting the username, barDetail, localName, and localEmail in the request body.
  const { username, barDetail, localName, localEmail } = req.body;

  if (!username || !barDetail) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  // Update the user's venue details in the database
  const updateQuery = `
    UPDATE users 
    SET bar_detail = ?, local_name = ?, local_email = ? 
    WHERE username = ?
  `;

  db.query(updateQuery, [barDetail, localName || null, localEmail || null, username], (err, results) => {
    if (err) {
      console.error('Error updating venue details:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({
      message: 'Venue details updated successfully.',
      bar_detail: barDetail,
      local_name: localName,
      local_email: localEmail
    });
  });
});

// Delete all users endpoint (for development/testing only)
app.delete('/api/users/all', (req, res) => {
  // This is a dangerous operation, so we'll add a simple check
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ message: 'This operation is only allowed in development mode.' });
  }

  const deleteQuery = 'DELETE FROM users';
  db.query(deleteQuery, (err, results) => {
    if (err) {
      console.error('Error deleting users:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.json({
      message: `Successfully deleted ${results.affectedRows} users.`,
      affectedRows: results.affectedRows
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
