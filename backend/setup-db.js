// setup-db.js
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  let connection;
  try {
    console.log('Attempting to connect to MySQL server with following configuration:');
    console.log('Host:', process.env.DB_HOST);
    console.log('User:', process.env.DB_USER);
    console.log('Database:', process.env.DB_NAME);
    
    // Create connection to MySQL server
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    console.log('Successfully connected to MySQL server');

    // Create database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS event_management');
    console.log('Database created or already exists');

    // Use the database
    await connection.query('USE event_management');
    console.log('Using event_management database');

    // Drop existing tables if they exist
    await connection.query('DROP TABLE IF EXISTS event_attendees');
    await connection.query('DROP TABLE IF EXISTS events');
    await connection.query('DROP TABLE IF EXISTS venues');
    await connection.query('DROP TABLE IF EXISTS users');
    await connection.query('DROP TABLE IF EXISTS categories');

    // Create users table
    await connection.query(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'bar') NOT NULL,
        bar_detail TEXT,
        local_name VARCHAR(100),
        local_email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_username (username)
      )
    `);
    console.log('Users table created');

    // Create venues table
    await connection.query(`
      CREATE TABLE venues (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        address TEXT NOT NULL,
        capacity INT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Venues table created');

    // Create categories table
    await connection.query(`
      CREATE TABLE categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Categories table created');

    // Create events table
    await connection.query(`
      CREATE TABLE events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        date DATETIME NOT NULL,
        venue_id INT,
        category_id INT,
        created_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (venue_id) REFERENCES venues(id),
        FOREIGN KEY (category_id) REFERENCES categories(id),
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `);
    console.log('Events table created');

    // Create event_attendees table
    await connection.query(`
      CREATE TABLE event_attendees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_id INT NOT NULL,
        user_id INT NOT NULL,
        status ENUM('attending', 'maybe', 'not_attending') DEFAULT 'attending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE KEY unique_attendee (event_id, user_id)
      )
    `);
    console.log('Event attendees table created');

    // Insert default categories
    const defaultCategories = [
      ['Music', 'Live music events and concerts'],
      ['Sports', 'Sports events and competitions'],
      ['Food & Drink', 'Food festivals and tasting events'],
      ['Arts & Culture', 'Art exhibitions and cultural events'],
      ['Nightlife', 'Club events and parties']
    ];

    await connection.query(
      'INSERT INTO categories (name, description) VALUES ?',
      [defaultCategories]
    );
    console.log('Default categories inserted');

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    if (error.sql) {
      console.error('SQL Query:', error.sql);
    }
    process.exit(1);
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log('Database connection closed');
      } catch (error) {
        console.error('Error closing connection:', error);
      }
    }
  }
}

// Run the setup
setupDatabase(); 