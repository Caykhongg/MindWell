const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  var appointments = await db.all('SELECT * FROM appointments WHERE user_id = $1 ORDER BY date DESC', [req.userId]);
  res.json({ appointments });
});

router.post('/', authMiddleware, async (req, res) => {
  const { date } = req.body;
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  var result = await db.run("INSERT INTO appointments (user_id, date, status) VALUES ($1, $2, $3) RETURNING id", [req.userId, date, 'pending']);
  var apptId = db.isPg ? result.rows[0].id : result.lastInsertRowid;
  var appointment = await db.get('SELECT * FROM appointments WHERE id = $1', [apptId]);

  res.status(201).json({ appointment });
});

router.patch('/:id', authMiddleware, async (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const appointment = await db.get('SELECT * FROM appointments WHERE id = $1', [req.params.id]);
  if (!appointment) {
    return res.status(404).json({ error: 'Appointment not found' });
  }
  if (appointment.user_id !== req.userId) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  await db.run('UPDATE appointments SET status = $1 WHERE id = $2', [status, req.params.id]);
  const updated = await db.get('SELECT * FROM appointments WHERE id = $1', [req.params.id]);
  res.json({ appointment: updated });
});

module.exports = router;