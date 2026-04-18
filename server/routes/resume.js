const express = require('express');
const multer = require('multer');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are accepted'));
    }
  },
});

// ── Keyword dictionaries ───────────────────────────────────────────────────

const SKILL_KEYWORDS = {
  // Programming & Tech
  'python': 'Programming/Coding',
  'javascript': 'Programming/Coding',
  'typescript': 'Programming/Coding',
  'java': 'Programming/Coding',
  'c++': 'Programming/Coding',
  'c#': 'Programming/Coding',
  'r programming': 'Programming/Coding',
  'matlab': 'Technical Skills',
  'swift': 'Programming/Coding',
  'kotlin': 'Programming/Coding',
  'golang': 'Programming/Coding',
  'rust': 'Programming/Coding',
  'php': 'Programming/Coding',
  'ruby': 'Programming/Coding',
  'scala': 'Programming/Coding',
  'sql': 'Programming/Coding',
  'html': 'Programming/Coding',
  'css': 'Programming/Coding',
  'react': 'Technical Skills',
  'angular': 'Technical Skills',
  'vue': 'Technical Skills',
  'node.js': 'Technical Skills',
  'django': 'Technical Skills',
  'flask': 'Technical Skills',
  'spring': 'Technical Skills',
  // Data & AI
  'machine learning': 'Analytical Thinking',
  'deep learning': 'Analytical Thinking',
  'data analysis': 'Analytical Thinking',
  'data science': 'Analytical Thinking',
  'statistics': 'Mathematics',
  'tensorflow': 'Technical Skills',
  'pytorch': 'Technical Skills',
  'pandas': 'Technical Skills',
  'tableau': 'Technical Skills',
  'power bi': 'Technical Skills',
  'excel': 'Technical Skills',
  'data visualization': 'Analytical Thinking',
  // Design
  'figma': 'Design',
  'adobe': 'Design',
  'photoshop': 'Design',
  'illustrator': 'Design',
  'sketch': 'Design',
  'ui design': 'Design',
  'ux design': 'Design',
  'graphic design': 'Design',
  'canva': 'Design',
  // Soft skills
  'leadership': 'Leadership',
  'team lead': 'Leadership',
  'managed team': 'Leadership',
  'communication': 'Communication',
  'public speaking': 'Public Speaking',
  'presented': 'Public Speaking',
  'presentation': 'Public Speaking',
  'problem solving': 'Problem Solving',
  'critical thinking': 'Critical Thinking',
  'project management': 'Project Management',
  'agile': 'Project Management',
  'scrum': 'Project Management',
  'jira': 'Project Management',
  'teamwork': 'Teamwork',
  'collaboration': 'Teamwork',
  'research': 'Research',
  'writing': 'Writing',
  'content writing': 'Writing',
  'blogging': 'Writing',
  'time management': 'Time Management',
  'attention to detail': 'Attention to Detail',
  'empathy': 'Empathy',
  'creativity': 'Creativity',
  'mathematics': 'Mathematics',
  'calculus': 'Mathematics',
  'algebra': 'Mathematics',
  'analytical': 'Analytical Thinking',
};

const EDUCATION_KEYWORDS = [
  'b.tech', 'btech', 'bachelor of technology',
  'b.e.', 'b.e', 'bachelor of engineering',
  'b.sc', 'bsc', 'bachelor of science',
  'b.com', 'bcom', 'bachelor of commerce',
  'b.a', 'ba', 'bachelor of arts',
  'mba', 'master of business',
  'm.tech', 'mtech', 'master of technology',
  'm.sc', 'msc', 'master of science',
  'phd', 'ph.d', 'doctorate',
  'diploma', 'polytechnic',
  'class 12', '12th', 'class xii', 'hsc', 'intermediate',
  'class 10', '10th', 'class x', 'ssc', 'matriculation',
];

const EXPERIENCE_KEYWORDS = [
  'internship', 'intern', 'worked at', 'work experience',
  'project', 'developed', 'built', 'designed', 'implemented',
  'managed', 'led', 'created', 'researched', 'analyzed',
  'freelance', 'volunteer', 'part-time', 'full-time',
];

function extractResumeData(text) {
  const lower = text.toLowerCase();

  // Extract matched skills (deduplicated by mapped category)
  const skillsMap = new Map();
  for (const [keyword, mappedSkill] of Object.entries(SKILL_KEYWORDS)) {
    if (lower.includes(keyword)) {
      skillsMap.set(mappedSkill, true);
    }
  }
  const skills = [...skillsMap.keys()];

  // Extract education level
  const educationFound = EDUCATION_KEYWORDS.filter(kw => lower.includes(kw));

  // Extract experience signals
  const experienceFound = EXPERIENCE_KEYWORDS.filter(kw => lower.includes(kw));

  // Extract interests from text patterns
  const interests = [];
  if (lower.includes('machine learning') || lower.includes('artificial intelligence') || lower.includes('data science') || lower.includes('programming')) {
    interests.push('Technology & Programming');
  }
  if (lower.includes('statistics') || lower.includes('mathematics') || lower.includes('calculus') || lower.includes('algebra')) {
    interests.push('Mathematics & Statistics');
  }
  if (lower.includes('design') || lower.includes('figma') || lower.includes('photoshop') || lower.includes('illustrator')) {
    interests.push('Art & Design');
  }
  if (lower.includes('business') || lower.includes('marketing') || lower.includes('finance') || lower.includes('economics')) {
    interests.push('Business & Finance');
  }
  if (lower.includes('research') || lower.includes('analysis') || lower.includes('analytical')) {
    interests.push('Research & Analysis');
  }
  if (lower.includes('writing') || lower.includes('content') || lower.includes('blog') || lower.includes('article')) {
    interests.push('Writing & Literature');
  }
  if (lower.includes('health') || lower.includes('medical') || lower.includes('clinical') || lower.includes('patient')) {
    interests.push('Healthcare & Medicine');
  }
  if (lower.includes('biology') || lower.includes('chemistry') || lower.includes('biochemistry') || lower.includes('biotech')) {
    interests.push('Biology & Life Sciences');
  }
  if (lower.includes('environment') || lower.includes('climate') || lower.includes('sustainability') || lower.includes('ecology')) {
    interests.push('Environment & Nature');
  }
  if (lower.includes('law') || lower.includes('legal') || lower.includes('compliance') || lower.includes('regulation')) {
    interests.push('Law & Justice');
  }
  if (lower.includes('teaching') || lower.includes('education') || lower.includes('tutoring') || lower.includes('curriculum')) {
    interests.push('Education & Teaching');
  }
  if (lower.includes('startup') || lower.includes('entrepreneurship') || lower.includes('venture') || lower.includes('founder')) {
    interests.push('Entrepreneurship & Innovation');
  }

  return {
    skills: skills.slice(0, 15),
    interests: [...new Set(interests)].slice(0, 8),
    education: educationFound,
    experience: experienceFound.length,
    summary: `Found ${skills.length} skills, ${interests.length} interest areas, ${experienceFound.length} experience signals`,
  };
}

// ── Route ──────────────────────────────────────────────────────────────────

router.post('/upload', authenticateToken, (req, res, next) => {
  upload.single('resume')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'File upload failed' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      let text = '';
      const mime = req.file.mimetype;

      if (mime === 'application/pdf') {
        const pdfParse = require('pdf-parse');
        const data = await pdfParse(req.file.buffer);
        text = data.text;
      } else {
        const mammoth = require('mammoth');
        const result = await mammoth.extractRawText({ buffer: req.file.buffer });
        text = result.value;
      }

      if (!text || text.trim().length < 50) {
        return res.status(400).json({ message: 'Could not extract text from resume. Please ensure the file is not scanned or image-only.' });
      }

      const extracted = extractResumeData(text);
      res.json({ success: true, ...extracted });
    } catch (parseErr) {
      console.error('Resume parse error:', parseErr);
      res.status(500).json({ message: 'Failed to parse resume. Please try a different file.' });
    }
  });
});

module.exports = router;
