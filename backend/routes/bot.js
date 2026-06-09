const express = require('express');
const { getDb } = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', function (req, res) {
  var db = getDb();
  var replies = db.prepare('SELECT * FROM bot_replies ORDER BY id ASC').all();
  res.json({ replies: replies });
});

router.post('/', authMiddleware, function (req, res) {
  var db = getDb();
  var { keywords, reply } = req.body;
  if (!keywords || !reply) {
    return res.status(400).json({ error: 'Keywords và reply là bắt buộc' });
  }
  var result = db.prepare('INSERT INTO bot_replies (keywords, reply) VALUES (?, ?)').run(keywords, reply);
  var row = db.prepare('SELECT * FROM bot_replies WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ reply: row });
});

router.put('/:id', authMiddleware, function (req, res) {
  var db = getDb();
  var existing = db.prepare('SELECT * FROM bot_replies WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Không tìm thấy' });

  var { keywords, reply } = req.body;
  if (keywords) db.prepare('UPDATE bot_replies SET keywords = ? WHERE id = ?').run(keywords, req.params.id);
  if (reply) db.prepare('UPDATE bot_replies SET reply = ? WHERE id = ?').run(reply, req.params.id);
  var updated = db.prepare('SELECT * FROM bot_replies WHERE id = ?').get(req.params.id);
  res.json({ reply: updated });
});

router.delete('/:id', authMiddleware, function (req, res) {
  var db = getDb();
  var existing = db.prepare('SELECT * FROM bot_replies WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Không tìm thấy' });
  db.prepare('DELETE FROM bot_replies WHERE id = ?').run(req.params.id);
  res.json({ message: 'Đã xóa' });
});

router.post('/feedback', function (req, res) {
  var db = getDb();
  var { message_text, bot_reply, helpful, keywords } = req.body;
  if (!message_text || !bot_reply) {
    return res.status(400).json({ error: 'message_text và bot_reply là bắt buộc' });
  }
  db.prepare('INSERT INTO chat_feedback (message_text, bot_reply, helpful, keywords) VALUES (?, ?, ?, ?)')
    .run(message_text, bot_reply, helpful || 0, keywords || '');
  res.status(201).json({ message: 'Đã ghi nhận phản hồi' });
});

router.get('/feedback', authMiddleware, function (req, res) {
  var db = getDb();
  var rows = db.prepare('SELECT * FROM chat_feedback ORDER BY created_at DESC LIMIT 100').all();
  res.json({ feedback: rows });
});

module.exports = router;
