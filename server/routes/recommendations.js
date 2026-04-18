const express = require('express');
const { getDB } = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  const db = getDB();

  const recs = db.all(
    `SELECT r.id, r.score, r.created_at,
      c.id as career_id, c.name, c.description, c.field, c.icon,
      c.salary_range, c.growth_outlook, c.required_stream,
      c.related_interests, c.related_skills, c.resources, c.min_grade
    FROM recommendations r
    JOIN careers c ON r.career_id = c.id
    WHERE r.user_id = ?
    ORDER BY r.score DESC`,
    req.user.id
  );

  // Get latest assessment for skills gap analysis
  const latestAssessment = db.get(
    'SELECT * FROM assessments WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
    req.user.id
  );
  const userSkills = latestAssessment ? JSON.parse(latestAssessment.skills || '[]') : [];
  const userInterests = latestAssessment ? JSON.parse(latestAssessment.interests || '[]') : [];

  const result = recs.map(r => {
    const careerSkills = JSON.parse(r.related_skills || '[]');
    const careerInterests = JSON.parse(r.related_interests || '[]');

    const matchedSkills = careerSkills.filter(s => userSkills.includes(s));
    const missingSkills = careerSkills.filter(s => !userSkills.includes(s));
    const matchedInterests = careerInterests.filter(i => userInterests.includes(i));

    // Potential score if user had all missing skills
    const potentialScore = missingSkills.length > 0
      ? Math.min(100, r.score + Math.round(25 * (missingSkills.length / Math.max(careerSkills.length, 1))))
      : r.score;

    return {
      id: r.id,
      score: r.score,
      created_at: r.created_at,
      gap: {
        matchedSkills,
        missingSkills,
        matchedInterests,
        potentialScore
      },
      career: {
        id: r.career_id, name: r.name, description: r.description,
        field: r.field, icon: r.icon, salary_range: r.salary_range,
        growth_outlook: r.growth_outlook,
        required_stream: JSON.parse(r.required_stream || '[]'),
        related_interests: careerInterests,
        related_skills: careerSkills,
        resources: JSON.parse(r.resources || '[]'),
        min_grade: r.min_grade
      }
    };
  });

  res.json(result);
});

module.exports = router;
