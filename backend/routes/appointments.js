const express = require('express');
const { getDb } = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  const db = getDb();
  const appointments = db.prepare('SELECT * FROM appointments WHERE user_id = ? ORDER BY date DESC').all(req.userId);
  res.json({ appointments });
});

router.post('/', authMiddleware, (req, res) => {
  const { date } = req.body;
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  const db = getDb();
  const result = db.prepare('INSERT INTO appointments (user_id, date, status) VALUES (?, ?, ?)').run(req.userId, date, 'pending');
  const appointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(result.lastInsertRowid);

  res.status(201).json({ appointment });
});

router.patch('/:id', authMiddleware, (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const db = getDb();
  const appointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(req.params.id);
  if (!appointment) {
    return res.status(404).json({ error: 'Appointment not found' });
  }
  if (appointment.user_id !== req.userId) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  db.prepare('UPDATE appointments SET status = ? WHERE id = ?').run(status, req.params.id);
  const updated = db.prepare('SELECT * FROM appointments WHERE id = ?').get(req.params.id);
  res.json({ appointment: updated });
});

module.exports = router;
