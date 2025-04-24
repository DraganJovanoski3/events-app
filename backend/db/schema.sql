-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  has_tickets BOOLEAN DEFAULT FALSE,
  price DECIMAL(10,2) DEFAULT 0,
  capacity INT DEFAULT 0,
  venue_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (venue_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index for faster venue event queries
CREATE INDEX idx_events_venue_id ON events(venue_id); 