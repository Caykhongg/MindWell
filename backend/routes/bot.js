const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', async function (req, res) {
  var replies = await db.all('SELECT * FROM bot_replies ORDER BY id ASC');
  res.json({ replies: replies });
});

router.post('/', authMiddleware, async function (req, res) {
  var { keywords, reply } = req.body;
  if (!keywords || !reply) {
    return res.status(400).json({ error: 'Keywords và reply là bắt buộc' });
  }
  var result = await db.run("INSERT INTO bot_replies (keywords, reply) VALUES ($1, $2) RETURNING *", [keywords, reply]);
  var row = db.isPg ? result.rows[0] : await db.get('SELECT * FROM bot_replies WHERE id = ?', [result.lastInsertRowid]);
  res.status(201).json({ reply: row });
});

router.put('/:id', authMiddleware, async function (req, res) {
  var existing = await db.get('SELECT * FROM bot_replies WHERE id = $1', [req.params.id]);
  if (!existing) return res.status(404).json({ error: 'Không tìm thấy' });

  var { keywords, reply } = req.body;
  if (keywords) await db.run('UPDATE bot_replies SET keywords = $1 WHERE id = $2', [keywords, req.params.id]);
  if (reply) await db.run('UPDATE bot_replies SET reply = $1 WHERE id = $2', [reply, req.params.id]);
  var updated = await db.get('SELECT * FROM bot_replies WHERE id = $1', [req.params.id]);
  res.json({ reply: updated });
});

router.delete('/:id', authMiddleware, async function (req, res) {
  var existing = await db.get('SELECT * FROM bot_replies WHERE id = $1', [req.params.id]);
  if (!existing) return res.status(404).json({ error: 'Không tìm thấy' });
  await db.run('DELETE FROM bot_replies WHERE id = $1', [req.params.id]);
  res.json({ message: 'Đã xóa' });
});

router.post('/feedback', async function (req, res) {
  var { message_text, bot_reply, helpful, keywords } = req.body;
  if (!message_text || !bot_reply) {
    return res.status(400).json({ error: 'message_text và bot_reply là bắt buộc' });
  }
  await db.run("INSERT INTO chat_feedback (message_text, bot_reply, helpful, keywords) VALUES ($1, $2, $3, $4)",
    [message_text, bot_reply, helpful || 0, keywords || '']);
  res.status(201).json({ message: 'Đã ghi nhận phản hồi' });
});

router.get('/feedback', authMiddleware, async function (req, res) {
  var rows = await db.all('SELECT * FROM chat_feedback ORDER BY created_at DESC LIMIT 100');
  res.json({ feedback: rows });
});

module.exports = router;