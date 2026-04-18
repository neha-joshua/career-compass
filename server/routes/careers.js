const express = require('express');
const { getDB } = require('../database/db');

const router = express.Router();

router.get('/', (req, res) => {
  const db = getDB();
  const { field, search } = req.query;
  let careers = db.all('SELECT * FROM careers ORDER BY name ASC');

  if (field && field !== 'All') {
    careers = careers.filter(c => c.field === field);
  }
  if (search) {
    const q = search.toLowerCase();
    careers = careers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.field.toLowerCase().includes(q)
    );
  }

  res.json(careers.map(c => ({
    ...c,
    required_stream: JSON.parse(c.required_stream || '[]'),
    related_interests: JSON.parse(c.related_interests || '[]'),
    related_skills: JSON.parse(c.related_skills || '[]'),
    resources: JSON.parse(c.resources || '[]')
  })));
});

router.get('/:id', (req, res) => {
  const db = getDB();
  const career = db.get('SELECT * FROM careers WHERE id = ?', req.params.id);
  if (!career) return res.status(404).json({ message: 'Career not found' });

  res.json({
    ...career,
    required_stream: JSON.parse(career.required_stream || '[]'),
    related_interests: JSON.parse(career.related_interests || '[]'),
    related_skills: JSON.parse(career.related_skills || '[]'),
    resources: JSON.parse(career.resources || '[]')
  });
});

module.exports = router;
