const express = require('express');
const { getDb } = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, (req, res) => {
  const { score, result } = req.body;
  if (score === undefined || !result) {
    return res.status(400).json({ error: 'Score and result are required' });
  }

  const db = getDb();
  const outcome = db.prepare('INSERT INTO mental_tests (user_id, score, result) VALUES (?, ?, ?)').run(req.userId, score, result);
  const test = db.prepare('SELECT * FROM mental_tests WHERE id = ?').get(outcome.lastInsertRowid);

  res.status(201).json({ test });
});

router.get('/', authMiddleware, (req, res) => {
  const db = getDb();
  const tests = db.prepare('SELECT * FROM mental_tests WHERE user_id = ? ORDER BY created_at DESC').all(req.userId);
  res.json({ tests });
});

module.exports = router;
