// test-db.js
const db = require('./db');

console.log('Testing database connection...');

// Test 1: Simple query to check connection
db.query('SELECT 1 + 1 AS result', (err, results) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }
  console.log('✅ Database connection successful!');
  console.log('Test 1 result:', results[0].result);
  
  // Test 2: Check if tables exist
  const tables = ['users', 'venues', 'events', 'event_attendees', 'categories'];
  let tablesChecked = 0;
  
  tables.forEach(table => {
    db.query(`SHOW TABLES LIKE '${table}'`, (err, results) => {
      if (err) {
        console.error(`❌ Error checking table '${table}':`, err);
      } else if (results.length > 0) {
        console.log(`✅ Table '${table}' exists`);
      } else {
        console.log(`❌ Table '${table}' does not exist`);
      }
      
      tablesChecked++;
      if (tablesChecked === tables.length) {
        // Test 3: Check users table structure
        db.query('DESCRIBE users', (err, results) => {
          if (err) {
            console.error('❌ Error checking users table structure:', err);
          } else {
            console.log('✅ Users table structure:');
            results.forEach(column => {
              console.log(`  - ${column.Field}: ${column.Type} ${column.Null === 'NO' ? 'NOT NULL' : ''} ${column.Key || ''}`);
            });
          }
          
          // Test 4: Try to insert a test user
          const testUser = {
            username: 'test_user_' + Date.now(),
            password: 'test_password',
            role: 'user'
          };
          
          db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', 
            [testUser.username, testUser.password, testUser.role], 
            (err, results) => {
              if (err) {
                console.error('❌ Error inserting test user:', err);
              } else {
                console.log('✅ Successfully inserted test user with ID:', results.insertId);
                
                // Clean up: delete the test user
                db.query('DELETE FROM users WHERE id = ?', [results.insertId], (err) => {
                  if (err) {
                    console.error('❌ Error deleting test user:', err);
                  } else {
                    console.log('✅ Successfully deleted test user');
                  }
                  
                  // Close the connection
                  db.end(err => {
                    if (err) {
                      console.error('❌ Error closing connection:', err);
                    } else {
                      console.log('✅ Database connection closed');
                    }
                  });
                });
              }
            }
          );
        });
      }
    });
  });
}); 