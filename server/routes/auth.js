const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB } = require('../database/db');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });
  if (password.length < 6)
    return res.status(400).json({ message: 'Password must be at least 6 characters' });

  const db = getDB();
  try {
    const existing = db.get('SELECT id FROM users WHERE email = ?', email);
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      name, email, hashedPassword
    );
    db.run('INSERT INTO profiles (user_id) VALUES (?)', result.lastInsertRowid);

    const token = jwt.sign(
      { id: result.lastInsertRowid, email, role: 'student' },
      JWT_SECRET, { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: { id: result.lastInsertRowid, name, email, role: 'student' }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  const db = getDB();
  try {
    const user = db.get('SELECT * FROM users WHERE email = ?', email);
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    if (!bcrypt.compareSync(password, user.password))
      return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET, { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

router.get('/me', authenticateToken, (req, res) => {
  const db = getDB();
  const user = db.get('SELECT id, name, email, role, created_at FROM users WHERE id = ?', req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const profile = db.get('SELECT * FROM profiles WHERE user_id = ?', req.user.id);
  res.json({ ...user, profile });
});

module.exports = router;
