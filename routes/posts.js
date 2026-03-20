const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all posts
router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM posts');
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET post by ID
router.get('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    connection.release();
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE a new post
router.post('/', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    
    if (!title || !content || !author) {
      return res.status(400).json({ message: 'Title, content, and author are required' });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO posts (title, content, author, created_at) VALUES (?, ?, ?, NOW())',
      [title, content, author]
    );
    connection.release();

    res.status(201).json({
      id: result.insertId,
      title,
      content,
      author,
      message: 'Post created successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a post
router.put('/:id', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const connection = await pool.getConnection();
    
    await connection.query(
      'UPDATE posts SET title = ?, content = ?, author = ?, updated_at = NOW() WHERE id = ?',
      [title, content, author, req.params.id]
    );
    connection.release();

    res.json({ id: req.params.id, message: 'Post updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a post
router.delete('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
    connection.release();

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;