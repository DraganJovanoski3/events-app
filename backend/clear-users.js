const mysql = require('mysql2/promise');
require('dotenv').config();

async function clearUsers() {
  let connection;
  try {
    // Create connection to MySQL server
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'event_management'
    });

    console.log('Successfully connected to MySQL server');

    // Delete all users
    const [result] = await connection.query('DELETE FROM users');
    console.log(`Successfully deleted ${result.affectedRows} users.`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

clearUsers(); 