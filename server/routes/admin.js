const express = require('express');
const { getDB } = require('../database/db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken, requireAdmin);

router.get('/analytics', (req, res) => {
  const db = getDB();

  const totalUsers = db.get("SELECT COUNT(*) as count FROM users WHERE role='student'").count;
  const totalCareers = db.get('SELECT COUNT(*) as count FROM careers').count;
  const totalAssessments = db.get('SELECT COUNT(*) as count FROM assessments').count;
  const totalBookmarks = db.get('SELECT COUNT(*) as count FROM bookmarks').count;
  const totalRecommendations = db.get('SELECT COUNT(*) as count FROM recommendations').count;
  const recentUsers = db.get("SELECT COUNT(*) as count FROM users WHERE created_at >= datetime('now','-7 days') AND role='student'").count;

  const topCareers = db.all(
    `SELECT c.name, c.field, c.icon, COUNT(r.id) as rec_count, AVG(r.score) as avg_score
    FROM careers c LEFT JOIN recommendations r ON c.id=r.career_id
    GROUP BY c.id ORDER BY rec_count DESC LIMIT 5`
  );

  const topBookmarked = db.all(
    `SELECT c.name, c.field, c.icon, COUNT(b.id) as bookmark_count
    FROM careers c LEFT JOIN bookmarks b ON c.id=b.career_id
    GROUP BY c.id ORDER BY bookmark_count DESC LIMIT 5`
  );

  const fieldDistribution = db.all(
    'SELECT field, COUNT(*) as count FROM careers GROUP BY field ORDER BY count DESC'
  );

  const userGrowth = db.all(
    `SELECT DATE(created_at) as date, COUNT(*) as count
    FROM users WHERE role='student' AND created_at >= datetime('now','-7 days')
    GROUP BY DATE(created_at) ORDER BY date ASC`
  );

  res.json({
    stats: { total_users: totalUsers, total_careers: totalCareers, total_assessments: totalAssessments, total_bookmarks: totalBookmarks, total_recommendations: totalRecommendations, recent_users: recentUsers },
    topCareers, topBookmarked, fieldDistribution, userGrowth
  });
});

router.get('/users', (req, res) => {
  const db = getDB();
  const users = db.all(
    `SELECT u.id, u.name, u.email, u.role, u.created_at, p.stream, p.current_education,
      (SELECT COUNT(*) FROM assessments a WHERE a.user_id=u.id) as assessment_count,
      (SELECT COUNT(*) FROM bookmarks b WHERE b.user_id=u.id) as bookmark_count
    FROM users u LEFT JOIN profiles p ON u.id=p.user_id ORDER BY u.created_at DESC`
  );
  res.json(users);
});

router.delete('/users/:id', (req, res) => {
  const db = getDB();
  db.run("DELETE FROM users WHERE id=? AND role!='admin'", req.params.id);
  res.json({ message: 'User deleted' });
});

router.get('/careers', (req, res) => {
  const db = getDB();
  const careers = db.all(
    `SELECT c.*,
      (SELECT COUNT(*) FROM recommendations r WHERE r.career_id=c.id) as rec_count,
      (SELECT COUNT(*) FROM bookmarks b WHERE b.career_id=c.id) as bookmark_count
    FROM careers c ORDER BY c.name ASC`
  );
  res.json(careers.map(c => ({
    ...c,
    required_stream: JSON.parse(c.required_stream || '[]'),
    related_interests: JSON.parse(c.related_interests || '[]'),
    related_skills: JSON.parse(c.related_skills || '[]'),
    resources: JSON.parse(c.resources || '[]')
  })));
});

router.post('/careers', (req, res) => {
  const { name, description, field, icon, salary_range, growth_outlook, required_stream, min_grade, related_interests, related_skills, resources } = req.body;
  if (!name || !description || !field)
    return res.status(400).json({ message: 'Name, description, and field are required' });

  const db = getDB();
  try {
    const result = db.run(
      'INSERT INTO careers (name,description,field,icon,salary_range,growth_outlook,required_stream,min_grade,related_interests,related_skills,resources) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      name, description, field, icon || '🎯', salary_range || '', growth_outlook || 'Good',
      JSON.stringify(required_stream || []), min_grade || 60,
      JSON.stringify(related_interests || []), JSON.stringify(related_skills || []), JSON.stringify(resources || [])
    );
    res.status(201).json({ message: 'Career added', id: result.lastInsertRowid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding career' });
  }
});

router.put('/careers/:id', (req, res) => {
  const { name, description, field, icon, salary_range, growth_outlook, required_stream, min_grade, related_interests, related_skills, resources } = req.body;
  const db = getDB();
  try {
    db.run(
      'UPDATE careers SET name=?,description=?,field=?,icon=?,salary_range=?,growth_outlook=?,required_stream=?,min_grade=?,related_interests=?,related_skills=?,resources=? WHERE id=?',
      name, description, field, icon, salary_range, growth_outlook,
      JSON.stringify(required_stream || []), min_grade,
      JSON.stringify(related_interests || []), JSON.stringify(related_skills || []),
      JSON.stringify(resources || []), req.params.id
    );
    res.json({ message: 'Career updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating career' });
  }
});

router.delete('/careers/:id', (req, res) => {
  const db = getDB();
  db.run('DELETE FROM careers WHERE id=?', req.params.id);
  res.json({ message: 'Career deleted' });
});

module.exports = router;
