const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function createAdminUser() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'event_management'
    });

    const username = 'admin';
    const password = 'admin123';
    const role = 'admin';
    const hashedPassword = await bcrypt.hash(password, 10);

    const [existingUser] = await connection.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (existingUser.length > 0) {
      console.log('Admin user already exists');
      return;
    }

    await connection.execute(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, role]
    );

    console.log('Admin user created successfully');
    console.log('Username: admin');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createAdminUser(); 