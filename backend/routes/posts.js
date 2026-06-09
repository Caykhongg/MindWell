const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const posts = await db.all(`
    SELECT p.id, p.title, p.content, p.created_at,
           u.id AS author_id, u.name AS author_name
    FROM posts p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
    LIMIT $1 OFFSET $2
  `, [limit, offset]);

  const total = await db.get('SELECT COUNT(*) AS count FROM posts');
  res.json({ posts, total: total.count, page, limit });
});

router.post('/', authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  var result = await db.run("INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING id", [req.userId, title, content]);
  var postId = db.isPg ? result.rows[0].id : result.lastInsertRowid;

  const post = await db.get(`
    SELECT p.id, p.title, p.content, p.created_at,
           u.id AS author_id, u.name AS author_name
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = $1
  `, [postId]);

  res.status(201).json({ post });
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const post = await db.get('SELECT * FROM posts WHERE id = $1', [req.params.id]);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  if (post.user_id !== req.userId) {
    return res.status(403).json({ error: 'Not authorized to delete this post' });
  }

  await db.run('DELETE FROM posts WHERE id = $1', [req.params.id]);
  res.json({ message: 'Post deleted' });
});

module.exports = router;