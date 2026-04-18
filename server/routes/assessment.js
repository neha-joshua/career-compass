const express = require('express');
const { getDB } = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, (req, res) => {
  const { interests, skills, grade_10, grade_12, current_grade, stream, location, resume_skills, time_spent } = req.body;
  if (!interests || !skills || !stream)
    return res.status(400).json({ message: 'Interests, skills, and stream are required' });

  if (!Array.isArray(interests) || interests.length < 3)
    return res.status(400).json({ message: 'Please select at least 3 interests' });

  if (!Array.isArray(skills) || skills.length < 3)
    return res.status(400).json({ message: 'Please select at least 3 skills' });

  // Validate grade ranges
  const grades = [grade_10, grade_12, current_grade].filter(g => g !== null && g !== undefined && g !== '');
  for (const g of grades) {
    const num = parseFloat(g);
    if (isNaN(num) || num < 0 || num > 100) {
      return res.status(400).json({ message: 'Grades must be between 0 and 100' });
    }
  }

  const db = getDB();
  try {
    const resumeSkillsArr = Array.isArray(resume_skills) ? resume_skills : [];

    db.run(
      'INSERT INTO assessments (user_id, interests, skills, grade_10, grade_12, current_grade, stream, location, resume_skills, time_spent) VALUES (?,?,?,?,?,?,?,?,?,?)',
      req.user.id, JSON.stringify(interests), JSON.stringify(skills),
      grade_10 || null, grade_12 || null, current_grade || null, stream,
      location || null, JSON.stringify(resumeSkillsArr), time_spent || 0
    );

    db.run(
      'UPDATE profiles SET stream=?, grade_10=?, grade_12=?, current_grade=? WHERE user_id=?',
      stream, grade_10 || null, grade_12 || null, current_grade || null, req.user.id
    );

    const careers = db.all('SELECT * FROM careers');
    const userGrade = current_grade || grade_12 || grade_10 || 0;

    // Merge user skills with resume skills for scoring
    const allSkills = [...new Set([...skills, ...resumeSkillsArr])];

    const scored = careers.map(career => ({
      career_id: career.id,
      score: calculateScore(career, { interests, skills: allSkills, stream, grade: userGrade })
    })).sort((a, b) => b.score - a.score);

    db.run('DELETE FROM recommendations WHERE user_id = ?', req.user.id);

    // Store top 50 recommendations
    for (const rec of scored.slice(0, 50)) {
      db.run(
        'INSERT INTO recommendations (user_id, career_id, score) VALUES (?,?,?)',
        req.user.id, rec.career_id, rec.score
      );
    }

    res.json({ message: 'Assessment submitted successfully', recommendations_count: Math.min(scored.length, 50) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing assessment' });
  }
});

router.get('/latest', authenticateToken, (req, res) => {
  const db = getDB();
  const assessment = db.get(
    'SELECT * FROM assessments WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
    req.user.id
  );
  if (!assessment) return res.status(404).json({ message: 'No assessment found' });
  res.json({
    ...assessment,
    interests: JSON.parse(assessment.interests || '[]'),
    skills: JSON.parse(assessment.skills || '[]'),
    resume_skills: JSON.parse(assessment.resume_skills || '[]'),
  });
});

router.get('/history', authenticateToken, (req, res) => {
  const db = getDB();
  const assessments = db.all(
    'SELECT * FROM assessments WHERE user_id = ? ORDER BY created_at ASC',
    req.user.id
  );

  if (!assessments.length) return res.json([]);

  const careers = db.all('SELECT * FROM careers');

  const history = assessments.map(a => {
    const interests = JSON.parse(a.interests || '[]');
    const skills = JSON.parse(a.skills || '[]');
    const resumeSkills = JSON.parse(a.resume_skills || '[]');
    const allSkills = [...new Set([...skills, ...resumeSkills])];
    const userGrade = a.current_grade || a.grade_12 || a.grade_10 || 0;

    const scored = careers.map(c => ({
      career_id: c.id,
      name: c.name,
      icon: c.icon,
      score: calculateScore(c, { interests, skills: allSkills, stream: a.stream, grade: userGrade })
    })).sort((a, b) => b.score - a.score).slice(0, 5);

    return {
      id: a.id,
      date: a.created_at,
      stream: a.stream,
      interests_count: interests.length,
      skills_count: skills.length,
      top_career: scored[0]?.name,
      top_score: scored[0]?.score || 0,
      top5: scored
    };
  });

  res.json(history);
});

function calculateScore(career, assessment) {
  let score = 0;

  // Stream match (20 pts)
  const requiredStreams = JSON.parse(career.required_stream || '[]');
  if (requiredStreams.includes('Any') || requiredStreams.length === 0 || requiredStreams.includes(assessment.stream)) {
    score += 20;
  } else {
    score += 5;
  }

  // Grade score (20 pts)
  const userGrade = assessment.grade || 0;
  const minGrade = career.min_grade || 60;
  score += userGrade >= minGrade ? 20 : Math.max(0, 20 * (userGrade / minGrade));

  // Interest match (35 pts)
  const careerInterests = JSON.parse(career.related_interests || '[]');
  const userInterests = assessment.interests || [];
  if (careerInterests.length > 0 && userInterests.length > 0) {
    const matches = careerInterests.filter(i => userInterests.includes(i)).length;
    score += 35 * (matches / careerInterests.length);
  }

  // Skills match (25 pts)
  const careerSkills = JSON.parse(career.related_skills || '[]');
  const userSkills = assessment.skills || [];
  if (careerSkills.length > 0 && userSkills.length > 0) {
    const matches = careerSkills.filter(s => userSkills.some(us =>
      us.toLowerCase() === s.toLowerCase() ||
      us.toLowerCase().includes(s.toLowerCase().split(' ')[0])
    )).length;
    score += 25 * (matches / careerSkills.length);
  }

  return Math.round(Math.min(score, 100));
}

module.exports = router;
