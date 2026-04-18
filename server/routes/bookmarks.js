const express = require('express');
const { getDB } = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  const db = getDB();
  const bookmarks = db.all(
    `SELECT b.id, b.created_at,
      c.id as career_id, c.name, c.description, c.field, c.icon,
      c.salary_range, c.growth_outlook, c.related_interests, c.related_skills, c.resources
    FROM bookmarks b
    JOIN careers c ON b.career_id = c.id
    WHERE b.user_id = ?
    ORDER BY b.created_at DESC`,
    req.user.id
  );

  res.json(bookmarks.map(b => ({
    id: b.id, created_at: b.created_at,
    career: {
      id: b.career_id, name: b.name, description: b.description,
      field: b.field, icon: b.icon, salary_range: b.salary_range,
      growth_outlook: b.growth_outlook,
      related_interests: JSON.parse(b.related_interests || '[]'),
      related_skills: JSON.parse(b.related_skills || '[]'),
      resources: JSON.parse(b.resources || '[]')
    }
  })));
});

router.post('/:careerId', authenticateToken, (req, res) => {
  const db = getDB();
  try {
    // Check if already exists
    const exists = db.get('SELECT id FROM bookmarks WHERE user_id=? AND career_id=?', req.user.id, req.params.careerId);
    if (!exists) {
      db.run('INSERT INTO bookmarks (user_id, career_id) VALUES (?,?)', req.user.id, req.params.careerId);
    }
    res.json({ message: 'Career bookmarked' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error bookmarking' });
  }
});

router.delete('/:careerId', authenticateToken, (req, res) => {
  const db = getDB();
  db.run('DELETE FROM bookmarks WHERE user_id=? AND career_id=?', req.user.id, req.params.careerId);
  res.json({ message: 'Bookmark removed' });
});

router.get('/check/:careerId', authenticateToken, (req, res) => {
  const db = getDB();
  const b = db.get('SELECT id FROM bookmarks WHERE user_id=? AND career_id=?', req.user.id, req.params.careerId);
  res.json({ bookmarked: !!b });
});

module.exports = router;
