const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  const { score, result } = req.body;
  if (score === undefined || !result) {
    return res.status(400).json({ error: 'Score and result are required' });
  }

  var outcome = await db.run("INSERT INTO mental_tests (user_id, score, result) VALUES ($1, $2, $3) RETURNING id", [req.userId, score, result]);
  var testId = db.isPg ? outcome.rows[0].id : outcome.lastInsertRowid;
  var test = await db.get('SELECT * FROM mental_tests WHERE id = $1', [testId]);

  res.status(201).json({ test });
});

router.get('/', authMiddleware, async (req, res) => {
  var tests = await db.all('SELECT * FROM mental_tests WHERE user_id = $1 ORDER BY created_at DESC', [req.userId]);
  res.json({ tests });
});

module.exports = router;