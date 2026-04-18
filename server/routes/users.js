const express = require('express');
const { getDB } = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', authenticateToken, (req, res) => {
  const db = getDB();
  const user = db.get('SELECT id, name, email, role, created_at FROM users WHERE id = ?', req.user.id);
  const profile = db.get('SELECT * FROM profiles WHERE user_id = ?', req.user.id);
  res.json({ ...user, profile });
});

router.put('/profile', authenticateToken, (req, res) => {
  const { name, bio, stream, grade_10, grade_12, current_grade, current_education } = req.body;
  const db = getDB();
  try {
    if (name) db.run('UPDATE users SET name = ? WHERE id = ?', name, req.user.id);

    const exists = db.get('SELECT id FROM profiles WHERE user_id = ?', req.user.id);
    if (exists) {
      db.run(
        'UPDATE profiles SET stream=?, grade_10=?, grade_12=?, current_grade=?, current_education=?, bio=? WHERE user_id=?',
        stream || null, grade_10 || null, grade_12 || null, current_grade || null,
        current_education || null, bio || null, req.user.id
      );
    } else {
      db.run(
        'INSERT INTO profiles (user_id, stream, grade_10, grade_12, current_grade, current_education, bio) VALUES (?,?,?,?,?,?,?)',
        req.user.id, stream || null, grade_10 || null, grade_12 || null,
        current_grade || null, current_education || null, bio || null
      );
    }

    const updatedUser = db.get('SELECT id, name, email, role FROM users WHERE id = ?', req.user.id);
    const profile = db.get('SELECT * FROM profiles WHERE user_id = ?', req.user.id);
    res.json({ message: 'Profile updated successfully', user: { ...updatedUser, profile } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;
