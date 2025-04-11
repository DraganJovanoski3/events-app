// index.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');

const app = express();
const port = 3001;
const saltRounds = 10;

app.use(cors());
app.use(express.json());

// Registration Endpoint
app.post('/auth/register', (req, res) => {
  const { username, password, role, barDetail, localName, localEmail } = req.body;
  
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

      // Insert the new user with correct column names
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
          
          // Return user data without the password
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
    // Compare the password
    bcrypt.compare(password, user.password, (compareErr, isMatch) => {
      if (compareErr) {
        console.error('Error comparing passwords:', compareErr);
        return res.status(500).json({ message: 'Error during authentication' });
      }
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
      
      // Return user data without the password
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
