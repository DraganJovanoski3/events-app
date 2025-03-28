const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware to enable CORS and parse JSON bodies
app.use(cors());
app.use(express.json());

// In-memory data storage for demonstration purposes
const users = [];

// ---------- Authentication Routes ----------

// POST /auth/register
app.post('/auth/register', (req, res) => {
  const { username, password, role, localName, localEmail } = req.body;
  
  // Basic validation
  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  // Check if user already exists
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists.' });
  }

  // Create and store the new user
  const user = { id: users.length + 1, username, password, role, localName, localEmail };
  users.push(user);

  res.status(201).json({ message: 'User registered successfully.', user });
});

// POST /auth/login
app.post('/auth/login', (req, res) => {
    const { username, password } = req.body; // Using username and password for login
  
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
  
    // For simplicity, we're returning a dummy token.
    const token = 'dummy-token';
    res.json({ token });
  });

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
