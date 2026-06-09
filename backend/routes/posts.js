const express = require('express');
const { getDb } = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  const db = getDb();
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const posts = db.prepare(`
    SELECT p.id, p.title, p.content, p.created_at,
           u.id AS author_id, u.name AS author_name
    FROM posts p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?
  `).all(limit, offset);

  const total = db.prepare('SELECT COUNT(*) AS count FROM posts').get().count;

  res.json({ posts, total, page, limit });
});

router.post('/', authMiddleware, (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const db = getDb();
  const result = db.prepare('INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)').run(req.userId, title, content);

  const post = db.prepare(`
    SELECT p.id, p.title, p.content, p.created_at,
           u.id AS author_id, u.name AS author_name
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = ?
  `).get(result.lastInsertRowid);

  res.status(201).json({ post });
});

router.delete('/:id', authMiddleware, (req, res) => {
  const db = getDb();
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  if (post.user_id !== req.userId) {
    return res.status(403).json({ error: 'Not authorized to delete this post' });
  }

  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  res.json({ message: 'Post deleted' });
});

module.exports = router;
