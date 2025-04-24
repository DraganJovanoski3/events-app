const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all events for a venue
router.get('/venue/:venueId', async (req, res) => {
  try {
    const { venueId } = req.params;
    const query = 'SELECT * FROM events WHERE venue_id = ?';
    db.query(query, [venueId], (err, results) => {
      if (err) {
        console.error('Error fetching events:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      res.json(results);
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new event
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      startTime,
      endTime,
      hasTickets,
      price,
      capacity,
      venueId
    } = req.body;

    const query = `
      INSERT INTO events (
        title, description, date, start_time, end_time,
        has_tickets, price, capacity, venue_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [title, description, date, startTime, endTime, hasTickets, price, capacity, venueId],
      (err, result) => {
        if (err) {
          console.error('Error creating event:', err);
          return res.status(500).json({ message: 'Database error' });
        }
        res.status(201).json({
          message: 'Event created successfully',
          eventId: result.insertId
        });
      }
    );
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an event
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      date,
      startTime,
      endTime,
      hasTickets,
      price,
      capacity
    } = req.body;

    const query = `
      UPDATE events 
      SET title = ?, description = ?, date = ?, start_time = ?,
          end_time = ?, has_tickets = ?, price = ?, capacity = ?
      WHERE id = ?
    `;

    db.query(
      query,
      [title, description, date, startTime, endTime, hasTickets, price, capacity, id],
      (err, result) => {
        if (err) {
          console.error('Error updating event:', err);
          return res.status(500).json({ message: 'Database error' });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event updated successfully' });
      }
    );
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an event
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM events WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Error deleting event:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.json({ message: 'Event deleted successfully' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 