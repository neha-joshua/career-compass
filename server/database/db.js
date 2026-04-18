const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, 'careercompass.sqlite');
let _sqliteDb = null;

// ─── Wrapper to mimic better-sqlite3 synchronous API ─────────────────────────

class DB {
  run(sql, ...args) {
    const params = args.length === 1 && Array.isArray(args[0]) ? args[0] : args.flat();
    _sqliteDb.run(sql, params);
    const idStmt = _sqliteDb.prepare('SELECT last_insert_rowid() as id');
    idStmt.step();
    const { id } = idStmt.getAsObject();
    idStmt.free();
    this._save();
    return { lastInsertRowid: id };
  }

  exec(sql) {
    _sqliteDb.exec(sql);
    this._save();
  }

  get(sql, ...params) {
    return this._query(sql, params.flat())[0] || null;
  }

  all(sql, ...params) {
    return this._query(sql, params.flat());
  }

  prepare(sql) {
    return new Stmt(this, sql);
  }

  transaction(fn) {
    const self = this;
    return function (...args) {
      _sqliteDb.run('BEGIN');
      try {
        const result = fn(...args);
        _sqliteDb.run('COMMIT');
        self._save();
        return result;
      } catch (e) {
        _sqliteDb.run('ROLLBACK');
        throw e;
      }
    };
  }

  pragma(val) {
    _sqliteDb.run(`PRAGMA ${val}`);
  }

  _query(sql, params = []) {
    const stmt = _sqliteDb.prepare(sql);
    if (params.length) stmt.bind(params);
    const rows = [];
    while (stmt.step()) rows.push(stmt.getAsObject());
    stmt.free();
    return rows;
  }

  _save() {
    const data = _sqliteDb.export();
    fs.writeFileSync(DB_FILE, Buffer.from(data));
  }
}

class Stmt {
  constructor(db, sql) {
    this._db = db;
    this._sql = sql;
  }

  run(...args) {
    const params = args.flat();
    if (params.length === 1 && typeof params[0] === 'object' && !Array.isArray(params[0])) {
      _sqliteDb.run(this._sql, params[0]);
    } else {
      _sqliteDb.run(this._sql, params);
    }
    const idStmt = _sqliteDb.prepare('SELECT last_insert_rowid() as id');
    idStmt.step();
    const { id } = idStmt.getAsObject();
    idStmt.free();
    this._db._save();
    return { lastInsertRowid: id };
  }

  get(...args) {
    return this._db.get(this._sql, ...args);
  }

  all(...args) {
    return this._db.all(this._sql, ...args);
  }
}

const db = new DB();

// ─── Init & Seed ──────────────────────────────────────────────────────────────

async function initDB() {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE)) {
    _sqliteDb = new SQL.Database(fs.readFileSync(DB_FILE));
  } else {
    _sqliteDb = new SQL.Database();
  }

  // Create tables
  _sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'student',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE,
      stream TEXT,
      grade_10 REAL,
      grade_12 REAL,
      current_grade REAL,
      current_education TEXT,
      bio TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS careers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      field TEXT,
      icon TEXT,
      salary_range TEXT,
      growth_outlook TEXT,
      required_stream TEXT DEFAULT '[]',
      min_grade REAL DEFAULT 60,
      related_interests TEXT DEFAULT '[]',
      related_skills TEXT DEFAULT '[]',
      resources TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS assessments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      interests TEXT DEFAULT '[]',
      skills TEXT DEFAULT '[]',
      grade_10 REAL,
      grade_12 REAL,
      current_grade REAL,
      stream TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS recommendations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      career_id INTEGER,
      score REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (career_id) REFERENCES careers(id)
    );

    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      career_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, career_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (career_id) REFERENCES careers(id)
    );
  `);

  // Add new columns if they don't exist (safe migrations)
  const migrations = [
    "ALTER TABLE assessments ADD COLUMN location TEXT",
    "ALTER TABLE assessments ADD COLUMN resume_skills TEXT DEFAULT '[]'",
    "ALTER TABLE assessments ADD COLUMN time_spent INTEGER DEFAULT 0",
  ];
  for (const m of migrations) {
    try { _sqliteDb.exec(m); } catch (e) { /* column already exists */ }
  }

  db._save();
  seedData();
  console.log('✅ Database initialized');
}

function getDB() {
  return db;
}

function seedData() {
  // Admin user
  const adminExists = db.get('SELECT id FROM users WHERE email = ?', 'admin@careercompass.com');
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      'Admin', 'admin@careercompass.com', hashedPassword, 'admin');
    console.log('👤 Admin seeded: admin@careercompass.com / admin123');
  }

  const insertStmt = `INSERT INTO careers (name, description, field, icon, salary_range, growth_outlook, required_stream, min_grade, related_interests, related_skills, resources)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const careers = [
    // ── Technology ────────────────────────────────────────────────────────────
    {
      name: 'Software Engineer',
      description: 'Design, develop, and maintain software systems and applications. Software engineers work across industries building everything from mobile apps to enterprise systems and AI platforms.',
      field: 'Technology', icon: '💻',
      salary_range: '₹6L – ₹40L per year', growth_outlook: 'Excellent',
      required_stream: JSON.stringify(['Science', 'Any']), min_grade: 65,
      related_interests: JSON.stringify(['Technology & Programming', 'Mathematics & Statistics', 'Research & Analysis']),
      related_skills: JSON.stringify(['Programming/Coding', 'Problem Solving', 'Critical Thinking', 'Analytical Thinking']),
      resources: JSON.stringify([{ title: 'CS50 – Harvard Free Course', url: 'https://cs50.harvard.edu' }, { title: 'LeetCode for DSA', url: 'https://leetcode.com' }, { title: 'freeCodeCamp', url: 'https://freecodecamp.org' }])
    },
    {
      name: 'Data Scientist',
      description: 'Analyze large datasets to extract insights, build predictive models, and help organizations make data-driven decisions using statistics and machine learning.',
      field: 'Technology', icon: '📊',
      salary_range: '₹8L – ₹50L per year', growth_outlook: 'Excellent',
      required_stream: JSON.stringify(['Science']), min_grade: 70,
      related_interests: JSON.stringify(['Technology & Programming', 'Mathematics & Statistics', 'Research & Analysis']),
      related_skills: JSON.stringify(['Mathematics', 'Analytical Thinking', 'Programming/Coding', 'Research', 'Critical Thinking']),
      resources: JSON.stringify([{ title: 'Kaggle – Free Data Science Courses', url: 'https://kaggle.com' }, { title: 'Coursera Data Science', url: 'https://coursera.org' }])
    },
    {
      name: 'Machine Learning Engineer',
      description: 'Build and deploy machine learning models and AI systems at scale. ML engineers bridge data science and software engineering, creating intelligent products used by millions.',
      field: 'Technology', icon: '🤖',
      salary_range: '₹12L – ₹60L per year', growth_outlook: 'Excellent',
      required_stream: JSON.stringify(['Science']), min_grade: 72,
      related_interests: JSON.stringify(['Technology & Programming', 'Mathematics & Statistics', 'Research & Analysis']),
      related_skills: JSON.stringify(['Programming/Coding', 'Mathematics', 'Analytical Thinking', 'Problem Solving', 'Research']),
      resources: JSON.stringify([{ title: 'Fast.ai Deep Learning', url: 'https://fast.ai' }, { title: 'Google ML Crash Course', url: 'https://developers.google.com/machine-learning/crash-course' }])
    },
    {
      name: 'AI Ethics Specialist',
      description: 'Ensure artificial intelligence systems are developed and deployed responsibly, fairly, and transparently. Shape policy, conduct bias audits, and advocate for ethical AI frameworks.',
      field: 'Technology', icon: '⚖️🤖',
      salary_range: '₹10L – ₹45L per year', growth_outlook: 'Excellent',
      required_stream: JSON.stringify(['Science', 'Arts', 'Any']), min_grade: 65,
      related_interests: JSON.stringify(['Technology & Programming', 'Law & Justice', 'Research & Analysis', 'Social Work & Community']),
      related_skills: JSON.stringify(['Critical Thinking', 'Research', 'Communication', 'Analytical Thinking', 'Writing']),
      resources: JSON.stringify([{ title: 'AI Ethics – MIT Course', url: 'https://ocw.mit.edu' }, { title: 'Partnership on AI', url: 'https://partnershiponai.org' }])
    },
    {
      name: 'Data Visualization Engineer',
      description: 'Transform complex data into compelling, interactive visual stories. Design dashboards, infographics, and data products that make insights accessible to decision-makers.',
      field: 'Technology', icon: '📈',
      salary_range: '₹8L – ₹40L per year', growth_outlook: 'Excellent',
      required_stream: JSON.stringify(['Science', 'Any']), min_grade: 65,
      related_interests: JSON.stringify(['Technology & Programming', 'Art & Design', 'Mathematics & Statistics', 'Research & Analysis']),
      related_skills: JSON.stringify(['Programming/Coding', 'Design', 'Analytical Thinking', 'Creativity', 'Attention to Detail']),
      resources: JSON.stringify([{ title: 'D3.js Data Visualization', url: 'https://d3js.org' }, { title: 'Tableau Public Learning', url: 'https://public.tableau.com' }])
    },
    {
      name: 'UX Researcher',
      description: 'Study how users interact with products and systems. Conduct usability tests, interviews, and surveys to generate insights that drive product decisions and improve user experiences.',
      field: 'Technology', icon: '🔬',
      salary_range: '₹7L – ₹35L per year', growth_outlook: 'Excellent',
      required_stream: JSON.stringify(['Arts', 'Science', 'Any']), min_grade: 60,
      related_interests: JSON.stringify(['Research & Analysis', 'Technology & Programming', 'Social Work & Community', 'Art & Design']),
      related_skills: JSON.stringify(['Research', 'Empathy', 'Communication', 'Analytical Thinking', 'Critical Thinking']),
      resources: JSON.stringify([{ title: 'Nielsen Norman Group UX', url: 'https://nngroup.com' }, { title: 'Google UX Design Certificate', url: 'https://grow.google' }])
    },
    {
      name: 'Digital Forensics Analyst',
      description: 'Investigate cybercrime by recovering, analyzing, and preserving digital evidence from computers, networks, and devices. Work with law enforcement and corporate security teams.',
      field: 'Technology', icon: '🔍',
      salary_range: '₹6L – ₹30L per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Science']), min_grade: 65,
      related_interests: JSON.stringify(['Technology & Programming', 'Law & Justice', 'Research & Analysis']),
      related_skills: JSON.stringify(['Analytical Thinking', 'Attention to Detail', 'Critical Thinking', 'Technical Skills', 'Research']),
      resources: JSON.stringify([{ title: 'EC-Council Digital Forensics', url: 'https://eccouncil.org' }, { title: 'Cybrary Digital Forensics', url: 'https://cybrary.it' }])
    },
    {
      name: 'Cybersecurity Analyst',
      description: 'Protect organizations from digital threats by monitoring networks, investigating security incidents, implementing defenses, and conducting penetration testing to find vulnerabilities.',
      field: 'Technology', icon: '🛡️',
      salary_range: '₹7L – ₹45L per year', growth_outlook: 'Excellent',
      required_stream: JSON.stringify(['Science']), min_grade: 65,
      related_interests: JSON.stringify(['Technology & Programming', 'Research & Analysis', 'Law & Justice']),
      related_skills: JSON.stringify(['Technical Skills', 'Analytical Thinking', 'Problem Solving', 'Attention to Detail', 'Critical Thinking']),
      resources: JSON.stringify([{ title: 'CompTIA Security+ Certification', url: 'https://comptia.org' }, { title: 'TryHackMe Learning Platform', url: 'https://tryhackme.com' }])
    },
    {
      name: 'Cloud Architect',
      description: 'Design and oversee cloud computing strategies for organizations, selecting services, designing infrastructure, and ensuring scalability, security, and cost-efficiency on platforms like AWS, Azure, GCP.',
      field: 'Technology', icon: '☁️',
      salary_range: '₹15L – ₹70L per year', growth_outlook: 'Excellent',
      required_stream: JSON.stringify(['Science']), min_grade: 68,
      related_interests: JSON.stringify(['Technology & Programming', 'Mathematics & Statistics', 'Research & Analysis']),
      related_skills: JSON.stringify(['Technical Skills', 'Problem Solving', 'Analytical Thinking', 'Project Management', 'Critical Thinking']),
      resources: JSON.stringify([{ title: 'AWS Certified Solutions Architect', url: 'https://aws.amazon.com/certification' }, { title: 'Google Cloud Training', url: 'https://cloud.google.com/training' }])
    },
    {
      name: 'DevOps Engineer',
      description: 'Bridge development and operations by automating deployment pipelines, managing infrastructure as code, and ensuring reliable, fast delivery of software products using CI/CD practices.',
      field: 'Technology', icon: '⚙️🔄',
      salary_range: '₹8L – ₹45L per year', growth_outlook: 'Excellent',
      required_stream: JSON.stringify(['Science', 'Any']), min_grade: 65,
      related_interests: JSON.stringify(['Technology & Programming', 'Mathematics & Statistics', 'Research & Analysis']),
      related_skills: JSON.stringify(['Technical Skills', 'Problem Solving', 'Analytical Thinking', 'Attention to Detail', 'Teamwork']),
      resources: JSON.stringify([{ title: 'Docker & Kubernetes Learning', url: 'https://kubernetes.io/training' }, { title: 'DevOps Roadmap', url: 'https://roadmap.sh/devops' }])
    },
    {
      name: 'Blockchain Developer',
      description: 'Build decentralized applications, smart contracts, and blockchain solutions for finance, supply chain, healthcare, and more using technologies like Ethereum, Solidity, and Web3.',
      field: 'Technology', icon: '🔗',
      salary_range: '₹10L – ₹60L per year', growth_outlook: 'Excellent',
      required_stream: JSON.stringify(['Science']), min_grade: 68,
      related_interests: JSON.stringify(['Technology & Programming', 'Business & Finance', 'Mathematics & Statistics']),
      related_skills: JSON.stringify(['Programming/Coding', 'Problem Solving', 'Analytical Thinking', 'Critical Thinking', 'Mathematics']),
      resources: JSON.stringify([{ title: 'Ethereum Developer Documentation', url: 'https://ethereum.org/developers' }, { title: 'Coursera Blockchain Specialization', url: 'https://coursera.org' }])
    },
    {
      name: 'Quantum Computing Researcher',
      description: 'Research and develop quantum algorithms, hardware, and applications to solve problems beyond the reach of classical computers in cryptography, drug discovery, and optimization.',
      field: 'Technology', icon: '⚛️',
      salary_range: '₹15L – ₹80L per year', growth_outlook: 'Excellent',
      required_stream: JSON.stringify(['Science']), min_grade: 80,
      related_interests: JSON.stringify(['Mathematics & Statistics', 'Physics & Chemistry', 'Technology & Programming', 'Research & Analysis']),
      related_skills: JSON.stringify(['Mathematics', 'Research', 'Analytical Thinking', 'Critical Thinking', 'Problem Solving']),
      resources: JSON.stringify([{ title: 'IBM Qiskit Learning', url: 'https://qiskit.org/learn' }, { title: 'Microsoft Quantum Development', url: 'https://azure.microsoft.com/quantum' }])
    },
    {
      name: 'UX/UI Designer',
      description: 'Design intuitive and beautiful user interfaces for websites and apps, focusing on user experience, usability, and visual design to create products people love.',
      field: 'Technology', icon: '🖌️',
      salary_range: '₹5L – ₹35L per year', growth_outlook: 'Excellent',
      required_stream: JSON.stringify(['Arts', 'Science', 'Any']), min_grade: 55,
      related_interests: JSON.stringify(['Art & Design', 'Technology & Programming', 'Media & Communication']),
      related_skills: JSON.stringify(['Creativity', 'Design', 'Empathy', 'Research', 'Communication', 'Critical Thinking']),
      resources: JSON.stringify([{ title: 'Google UX Design Certificate', url: 'https://grow.google' }, { title: 'Figma Community', url: 'https://figma.com/community' }])
    },
    {
      name: 'Game Developer',
      description: 'Design and develop video games, from concept and story to programming, graphics, and gameplay mechanics. Game developers work in studios or independently.',
      field: 'Technology', icon: '🎮',
      salary_range: '₹4L – ₹30L per year', growth_outlook: 'Excellent',
      required_stream: JSON.stringify(['Science', 'Any']), min_grade: 60,
      related_interests: JSON.stringify(['Technology & Programming', 'Art & Design', 'Mathematics & Statistics']),
      related_skills: JSON.stringify(['Programming/Coding', 'Creativity', 'Problem Solving', 'Design', 'Teamwork']),
      resources: JSON.stringify([{ title: 'Unity Learn', url: 'https://learn.unity.com' }, { title: 'Unreal Engine Learning', url: 'https://unrealengine.com/en-US/learn' }])
    },
    {
      name: 'Product Manager',
      description: 'Lead product vision, strategy, and execution by collaborating with engineering, design, and business teams. Define what gets built and why, ensuring products create real user value.',
      field: 'Technology', icon: '🗺️',
      salary_range: '₹10L – ₹55L per year', growth_outlook: 'Excellent',
      required_stream: JSON.stringify(['Commerce', 'Science', 'Any']), min_grade: 62,
      related_interests: JSON.stringify(['Technology & Programming', 'Business & Finance', 'Research & Analysis', 'Entrepreneurship & Innovation']),
      related_skills: JSON.stringify(['Leadership', 'Communication', 'Analytical Thinking', 'Problem Solving', 'Project Management']),
      resources: JSON.stringify([{ title: 'Product School PM Course', url: 'https://productschool.com' }, { title: 'Reforge PM Programs', url: 'https://reforge.com' }])
    },
    {
      name: 'EdTech Developer',
      description: 'Build educational technology platforms, e-learning systems, and digital learning tools that transform how students and professionals acquire knowledge and skills globally.',
      field: 'Technology', icon: '📱📚',
      salary_range: '₹6L – ₹35L per year', growth_outlook: 'Excellent',
      required_stream: JSON.stringify(['Science', 'Any']), min_grade: 60,
      related_interests: JSON.stringify(['Technology & Programming', 'Education & Teaching', 'Research & Analysis']),
      related_skills: JSON.stringify(['Programming/Coding', 'Creativity', 'Communication', 'Problem Solving', 'Design']),
      resources: JSON.stringify([{ title: 'edX EdTech Courses', url: 'https://edx.org' }, { title: 'Khan Academy Platform', url: 'https://khanacademy.org' }])
    },

    // ── Healthcare ────────────────────────────────────────────────────────────
    {
      name: 'Doctor / Physician',
      description: 'Diagnose and treat illnesses, injuries, and medical conditions. Physicians work in hospitals, clinics, and research institutions to improve patient health outcomes.',
      field: 'Healthcare', icon: '🏥',
      salary_range: '₹10L – ₹60L per year', growth_outlook: 'Excellent',
      required_stream: JSON.stringify(['Science']), min_grade: 80,
      related_interests: JSON.stringify(['Healthcare & Medicine', 'Biology & Life Sciences', 'Research & Analysis']),
      related_skills: JSON.stringify(['Critical Thinking', 'Empathy', 'Problem Solving', 'Attention to Detail', 'Communication']),
      resources: JSON.stringify([{ title: 'NEET Preparation Guide', url: 'https://nta.ac.in' }, { title: 'Osmosis Medical Education', url: 'https://osmosis.org' }])
    },
    {
      name: 'Psychologist',
      description: 'Study human behavior and mental processes, diagnose and treat psychological disorders, provide counseling, and conduct research to improve mental health outcomes.',
      field: 'Healthcare', icon: '🧠',
      salary_range: '₹4L – ₹25L per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Science', 'Arts']), min_grade: 60,
      related_interests: JSON.stringify(['Healthcare & Medicine', 'Social Work & Community', 'Research & Analysis', 'Education & Teaching']),
      related_skills: JSON.stringify(['Empathy', 'Communication', 'Research', 'Critical Thinking', 'Analytical Thinking']),
      resources: JSON.stringify([{ title: 'APA Psychology Resources', url: 'https://apa.org' }, { title: 'Coursera Psychology', url: 'https://coursera.org' }])
    },
    {
      name: 'Pharmacist',
      description: 'Dispense medications, advise patients and healthcare providers on drug therapies, ensure safe medication use, and contribute to pharmaceutical research.',
      field: 'Healthcare', icon: '💊',
      salary_range: '₹4L – ₹20L per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Science']), min_grade: 65,
      related_interests: JSON.stringify(['Healthcare & Medicine', 'Biology & Life Sciences', 'Physics & Chemistry', 'Research & Analysis']),
      related_skills: JSON.stringify(['Attention to Detail', 'Critical Thinking', 'Communication', 'Empathy', 'Technical Skills']),
      resources: JSON.stringify([{ title: 'Pharmacy Council of India', url: 'https://pci.nic.in' }, { title: 'PharmD Resources', url: 'https://coursera.org' }])
    },
    {
      name: 'Nurse',
      description: 'Provide direct patient care, administer medications, assist in procedures, educate patients, and collaborate with healthcare teams across hospitals and clinics.',
      field: 'Healthcare', icon: '🩺',
      salary_range: '₹3L – ₹15L per year', growth_outlook: 'Excellent',
      required_stream: JSON.stringify(['Science']), min_grade: 55,
      related_interests: JSON.stringify(['Healthcare & Medicine', 'Social Work & Community', 'Biology & Life Sciences']),
      related_skills: JSON.stringify(['Empathy', 'Communication', 'Attention to Detail', 'Teamwork', 'Critical Thinking']),
      resources: JSON.stringify([{ title: 'Indian Nursing Council', url: 'https://indiannursingcouncil.org' }, { title: 'NORCET Preparation', url: 'https://aiims.edu' }])
    },
    {
      name: 'Nutritionist / Dietitian',
      description: 'Assess, diagnose, and treat dietary and nutrition problems in individuals and communities. Design personalized nutrition plans, work in hospitals, sports teams, wellness centers, and corporate health programs.',
      field: 'Healthcare', icon: '🥗',
      salary_range: '₹3L – ₹18L per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Science']), min_grade: 58,
      related_interests: JSON.stringify(['Healthcare & Medicine', 'Biology & Life Sciences', 'Sports & Fitness', 'Social Work & Community']),
      related_skills: JSON.stringify(['Empathy', 'Communication', 'Research', 'Analytical Thinking', 'Attention to Detail']),
      resources: JSON.stringify([{ title: 'Academy of Nutrition & Dietetics', url: 'https://eatright.org' }, { title: 'Coursera Nutrition Science', url: 'https://coursera.org' }])
    },
    {
      name: 'Speech Therapist',
      description: 'Diagnose and treat speech, language, voice, and swallowing disorders in children and adults. Work in schools, hospitals, rehabilitation centers, and private clinics.',
      field: 'Healthcare', icon: '🗣️',
      salary_range: '₹4L – ₹20L per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Science', 'Arts']), min_grade: 58,
      related_interests: JSON.stringify(['Healthcare & Medicine', 'Education & Teaching', 'Social Work & Community']),
      related_skills: JSON.stringify(['Empathy', 'Communication', 'Patience', 'Analytical Thinking', 'Attention to Detail']),
      resources: JSON.stringify([{ title: 'ASHA Speech-Language Pathology', url: 'https://asha.org' }, { title: 'Rehabilitation Council of India', url: 'https://rehabcouncil.nic.in' }])
    },
    {
      name: 'Occupational Therapist',
      description: 'Help people of all ages recover, develop, or maintain daily living and work skills. Work with patients with physical, cognitive, or mental health challenges to improve quality of life.',
      field: 'Healthcare', icon: '🤲',
      salary_range: '₹3L – ₹18L per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Science']), min_grade: 58,
      related_interests: JSON.stringify(['Healthcare & Medicine', 'Social Work & Community', 'Education & Teaching']),
      related_skills: JSON.stringify(['Empathy', 'Problem Solving', 'Communication', 'Creativity', 'Attention to Detail']),
      resources: JSON.stringify([{ title: 'WFOT Occupational Therapy', url: 'https://wfot.org' }, { title: 'All India OT Association', url: 'https://aiota.org' }])
    },
    {
      name: 'Veterinarian',
      description: 'Diagnose and treat diseases and injuries in animals, both domestic and wild. Work in private clinics, zoos, research labs, farms, and wildlife conservation.',
      field: 'Healthcare', icon: '🐾',
      salary_range: '₹5L – ₹25L per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Science']), min_grade: 72,
      related_interests: JSON.stringify(['Biology & Life Sciences', 'Healthcare & Medicine', 'Environment & Nature']),
      related_skills: JSON.stringify(['Empathy', 'Problem Solving', 'Attention to Detail', 'Critical Thinking', 'Communication']),
      resources: JSON.stringify([{ title: 'Veterinary Council of India', url: 'https://vci.nic.in' }, { title: 'ICAR Veterinary Science', url: 'https://icar.org.in' }])
    },
    {
      name: 'Healthcare Administrator',
      description: 'Manage and coordinate healthcare services in hospitals, clinics, or health systems. Oversee operations, staff, budgets, and ensure compliance with healthcare regulations.',
      field: 'Healthcare', icon: '🏨',
      salary_range: '₹5L – ₹30L per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Commerce', 'Science', 'Any']), min_grade: 60,
      related_interests: JSON.stringify(['Healthcare & Medicine', 'Business & Finance', 'Social Work & Community']),
      related_skills: JSON.stringify(['Leadership', 'Project Management', 'Communication', 'Analytical Thinking', 'Attention to Detail']),
      resources: JSON.stringify([{ title: 'ACHE Healthcare Administration', url: 'https://ache.org' }, { title: 'Coursera Health Management', url: 'https://coursera.org' }])
    },

    // ── Engineering ───────────────────────────────────────────────────────────
    {
      name: 'Civil Engineer',
      description: 'Plan, design, and oversee construction of infrastructure projects such as roads, bridges, dams, and buildings. Civil engineers shape the physical environment.',
      field: 'Engineering', icon: '🏗️',
      salary_range: '₹5L – ₹25L per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Science']), min_grade: 65,
      related_interests: JSON.stringify(['Architecture & Construction', 'Mathematics & Statistics', 'Environment & Nature']),
      related_skills: JSON.stringify(['Mathematics', 'Problem Solving', 'Analytical Thinking', 'Project Management', 'Attention to Detail']),
      resources: JSON.stringify([{ title: 'GATE Civil Engineering', url: 'https://gate.iitk.ac.in' }, { title: 'Coursera Civil Engineering', url: 'https://coursera.org' }])
    },
    {
      name: 'Mechanical Engineer',
      description: 'Design and develop mechanical systems, machines, engines, and tools. Mechanical engineers work in automotive, aerospace, manufacturing, and energy sectors.',
      field: 'Engineering', icon: '⚙️',
      salary_range: '₹5L – ₹30L per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Science']), min_grade: 65,
      related_interests: JSON.stringify(['Mathematics & Statistics', 'Physics & Chemistry', 'Architecture & Construction']),
      related_skills: JSON.stringify(['Mathematics', 'Problem Solving', 'Critical Thinking', 'Technical Skills', 'Attention to Detail']),
      resources: JSON.stringify([{ title: 'MIT OpenCourseWare – ME', url: 'https://ocw.mit.edu' }, { title: 'GATE Mechanical', url: 'https://gate.iitk.ac.in' }])
    },
    {
      name: 'Robotics Engineer',
      description: 'Design, build, and program robots and automated systems for manufacturing, medicine, space exploration, agriculture, and defense. Combine mechanical, electrical, and software engineering.',
      field: 'Engineering', icon: '🦾',
      salary_range: '₹8L – ₹50L per year', growth_outlook: 'Excellent',
      required_stream: JSON.stringify(['Science']), min_grade: 72,
      related_interests: JSON.stringify(['Mathematics & Statistics', 'Physics & Chemistry', 'Technology & Programming', 'Research & Analysis']),
      related_skills: JSON.stringify(['Mathematics', 'Programming/Coding', 'Technical Skills', 'Problem Solving', 'Analytical Thinking']),
      resources: JSON.stringify([{ title: 'ROS (Robot Operating System)', url: 'https://ros.org' }, { title: 'MIT Robotics Courses', url: 'https://ocw.mit.edu' }])
    },
    {
      name: 'Nanotechnology Engineer',
      description: 'Research and develop materials, devices, and systems at the nanoscale (1-100 nanometers) for applications in medicine, electronics, energy, and environmental science.',
      field: 'Engineering', icon: '🔬⚙️',
      salary_range: '₹7L – ₹40L per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Science']), min_grade: 75,
      related_interests: JSON.stringify(['Physics & Chemistry', 'Biology & Life Sciences', 'Mathematics & Statistics', 'Research & Analysis']),
      related_skills: JSON.stringify(['Research', 'Analytical Thinking', 'Attention to Detail', 'Critical Thinking', 'Technical Skills']),
      resources: JSON.stringify([{ title: 'Coursera Nanotechnology', url: 'https://coursera.org' }, { title: 'NNI Nanotechnology Resources', url: 'https://nano.gov' }])
    },

    // ── Finance ───────────────────────────────────────────────────────────────
    {
      name: 'Chartered Accountant',
      description: 'Manage financial records, conduct audits, prepare tax returns, and provide financial advice to businesses and individuals. CAs are essential to every organization.',
      field: 'Finance', icon: '📈',
      salary_range: '₹7L – ₹40L per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Commerce']), min_grade: 60,
      related_interests: JSON.stringify(['Business & Finance', 'Mathematics & Statistics', 'Research & Analysis']),
      related_skills: JSON.stringify(['Mathematics', 'Analytical Thinking', 'Attention to Detail', 'Critical Thinking', 'Time Management']),
      resources: JSON.stringify([{ title: 'ICAI Official CA Course', url: 'https://icai.org' }, { title: 'Unacademy CA Foundation', url: 'https://unacademy.com' }])
    },
    {
      name: 'Financial Analyst',
      description: 'Analyze financial data, market trends, and economic conditions to help businesses and individuals make sound investment decisions and financial plans.',
      field: 'Finance', icon: '💹',
      salary_range: '₹6L – ₹40L per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Commerce', 'Science']), min_grade: 65,
      related_interests: JSON.stringify(['Business & Finance', 'Mathematics & Statistics', 'Research & Analysis']),
      related_skills: JSON.stringify(['Mathematics', 'Analytical Thinking', 'Research', 'Critical Thinking', 'Attention to Detail']),
      resources: JSON.stringify([{ title: 'CFA Institute', url: 'https://cfainstitute.org' }, { title: 'Investopedia Financial Modeling', url: 'https://investopedia.com' }])
    },
    {
      name: 'Investment Banker',
      description: 'Help companies raise capital, execute mergers and acquisitions, and provide strategic financial advisory services. Work in high-stakes environments with top corporations and governments.',
      field: 'Finance', icon: '🏦',
      salary_range: '₹12L – ₹80L per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Commerce', 'Science']), min_grade: 75,
      related_interests: JSON.stringify(['Business & Finance', 'Mathematics & Statistics', 'Research & Analysis', 'Entrepreneurship & Innovation']),
      related_skills: JSON.stringify(['Analytical Thinking', 'Mathematics', 'Communication', 'Leadership', 'Attention to Detail']),
      resources: JSON.stringify([{ title: 'Wall Street Prep Investment Banking', url: 'https://wallstreetprep.com' }, { title: 'CFA Institute', url: 'https://cfainstitute.org' }])
    },
    {
      name: 'Actuary',
      description: 'Use mathematics, statistics, and financial theory to assess risk and uncertainty in insurance, pensions, and finance. Actuaries help organizations plan for uncertain future events.',
      field: 'Finance', icon: '📐',
      salary_range: '₹8L – ₹50L per year', growth_outlook: 'Excellent',
      required_stream: JSON.stringify(['Commerce', 'Science']), min_grade: 75,
      related_interests: JSON.stringify(['Mathematics & Statistics', 'Business & Finance', 'Research & Analysis']),
      related_skills: JSON.stringify(['Mathematics', 'Analytical Thinking', 'Critical Thinking', 'Attention to Detail', 'Research']),
      resources: JSON.stringify([{ title: 'Institute of Actuaries of India', url: 'https://actuariesindia.org' }, { title: 'SOA Actuarial Exam Prep', url: 'https://soa.org' }])
    },

    // ── Business ──────────────────────────────────────────────────────────────
    {
      name: 'Business Analyst',
      description: 'Bridge the gap between business needs and technology solutions. Business analysts assess processes, gather requirements, and drive organizational improvements.',
      field: 'Business', icon: '📋',
      salary_range: '₹6L – ₹30L per year', growth_outlook: 'Excellent',
      required_stream: JSON.stringify(['Commerce', 'Science', 'Any']), min_grade: 60,
      related_interests: JSON.stringify(['Business & Finance', 'Technology & Programming', 'Research & Analysis']),
      related_skills: JSON.stringify(['Analytical Thinking', 'Communication', 'Problem Solving', 'Research', 'Project Management']),
      resources: JSON.stringify([{ title: 'IIBA Business Analysis', url: 'https://iiba.org' }, { title: 'Coursera Business Analysis', url: 'https://coursera.org' }])
    },
    {
      name: 'Marketing Manager',
      description: 'Develop and execute marketing strategies to promote products and services. Manage campaigns, analyze market trends, and drive brand growth across digital and traditional channels.',
      field: 'Business', icon: '📣',
      salary_range: '₹5L – ₹35L per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Commerce', 'Arts', 'Any']), min_grade: 55,
      related_interests: JSON.stringify(['Business & Finance', 'Media & Communication', 'Art & Design', 'Entrepreneurship & Innovation']),
      related_skills: JSON.stringify(['Communication', 'Creativity', 'Leadership', 'Analytical Thinking', 'Public Speaking']),
      resources: JSON.stringify([{ title: 'Google Digital Marketing Certificate', url: 'https://grow.google' }, { title: 'HubSpot Marketing Courses', url: 'https://academy.hubspot.com' }])
    },
    {
      name: 'Entrepreneur',
      description: 'Build and grow your own business, identifying market opportunities, assembling teams, managing resources, and driving innovation to create value in the marketplace.',
      field: 'Business', icon: '🚀',
      salary_range: 'Variable – Unlimited potential', growth_outlook: 'Excellent',
      required_stream: JSON.stringify(['Any']), min_grade: 50,
      related_interests: JSON.stringify(['Entrepreneurship & Innovation', 'Business & Finance', 'Technology & Programming', 'Media & Communication']),
      related_skills: JSON.stringify(['Leadership', 'Creativity', 'Communication', 'Problem Solving', 'Project Management', 'Critical Thinking']),
      resources: JSON.stringify([{ title: 'Startup India', url: 'https://startupindia.gov.in' }, { title: 'Y Combinator Startup School', url: 'https://startupschool.org' }])
    },
    {
      name: 'Supply Chain Manager',
      description: 'Oversee the entire supply chain from procurement to delivery, optimizing logistics, vendor relationships, inventory, and operations to reduce costs and improve efficiency.',
      field: 'Business', icon: '🔄',
      salary_range: '₹6L – ₹35L per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Commerce', 'Science', 'Any']), min_grade: 60,
      related_interests: JSON.stringify(['Business & Finance', 'Research & Analysis', 'Mathematics & Statistics']),
      related_skills: JSON.stringify(['Analytical Thinking', 'Project Management', 'Problem Solving', 'Communication', 'Attention to Detail']),
      resources: JSON.stringify([{ title: 'APICS CSCP Certification', url: 'https://ascm.org' }, { title: 'Coursera Supply Chain', url: 'https://coursera.org' }])
    },
    {
      name: 'Human Resources Manager',
      description: 'Oversee recruitment, employee relations, performance management, training, and organizational culture. Help build and maintain high-performing teams aligned with company goals.',
      field: 'Business', icon: '👥',
      salary_range: '₹5L – ₹30L per year', growth_outlook: 'Stable',
      required_stream: JSON.stringify(['Commerce', 'Arts', 'Any']), min_grade: 55,
      related_interests: JSON.stringify(['Business & Finance', 'Social Work & Community', 'Education & Teaching']),
      related_skills: JSON.stringify(['Communication', 'Empathy', 'Leadership', 'Analytical Thinking', 'Teamwork']),
      resources: JSON.stringify([{ title: 'SHRM HR Certification', url: 'https://shrm.org' }, { title: 'Coursera HR Management', url: 'https://coursera.org' }])
    },
    {
      name: 'Public Relations Manager',
      description: 'Manage the public image of organizations, handle media relations, write press releases, coordinate crisis communications, and build brand reputation through strategic communications.',
      field: 'Business', icon: '📢',
      salary_range: '₹4L – ₹25L per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Arts', 'Commerce', 'Any']), min_grade: 55,
      related_interests: JSON.stringify(['Media & Communication', 'Writing & Literature', 'Business & Finance']),
      related_skills: JSON.stringify(['Communication', 'Writing', 'Public Speaking', 'Creativity', 'Leadership']),
      resources: JSON.stringify([{ title: 'PRSA Public Relations', url: 'https://prsa.org' }, { title: 'Coursera Communication', url: 'https://coursera.org' }])
    },
    {
      name: 'E-Commerce Specialist',
      description: 'Build and grow online retail businesses, managing product listings, digital marketing, logistics, customer experience, and analytics to maximize revenue across platforms.',
      field: 'Business', icon: '🛒',
      salary_range: '₹4L – ₹25L per year', growth_outlook: 'Excellent',
      required_stream: JSON.stringify(['Commerce', 'Any']), min_grade: 55,
      related_interests: JSON.stringify(['Business & Finance', 'Technology & Programming', 'Entrepreneurship & Innovation']),
      related_skills: JSON.stringify(['Analytical Thinking', 'Communication', 'Technical Skills', 'Creativity', 'Attention to Detail']),
      resources: JSON.stringify([{ title: 'Amazon Seller University', url: 'https://sellercentral.amazon.in' }, { title: 'Shopify Academy', url: 'https://shopify.com/learn' }])
    },
    {
      name: 'Operations Research Analyst',
      description: 'Apply advanced analytical methods to help organizations improve decision-making, solve complex problems, and optimize operations using mathematics, statistics, and modeling.',
      field: 'Business', icon: '📐📊',
      salary_range: '₹7L – ₹40L per year', growth_outlook: 'Excellent',
      required_stream: JSON.stringify(['Science', 'Commerce']), min_grade: 70,
      related_interests: JSON.stringify(['Mathematics & Statistics', 'Business & Finance', 'Research & Analysis', 'Technology & Programming']),
      related_skills: JSON.stringify(['Mathematics', 'Analytical Thinking', 'Problem Solving', 'Critical Thinking', 'Research']),
      resources: JSON.stringify([{ title: 'INFORMS Operations Research', url: 'https://informs.org' }, { title: 'Coursera Data Analytics', url: 'https://coursera.org' }])
    },

    // ── Science ───────────────────────────────────────────────────────────────
    {
      name: 'Bioinformatics Analyst',
      description: 'Combine biology, computer science, and statistics to analyze biological data — from genomics to protein structures — driving discoveries in medicine, agriculture, and biotechnology.',
      field: 'Science', icon: '🧬',
      salary_range: '₹6L – ₹35L per year', growth_outlook: 'Excellent',
      required_stream: JSON.stringify(['Science']), min_grade: 72,
      related_interests: JSON.stringify(['Biology & Life Sciences', 'Technology & Programming', 'Mathematics & Statistics', 'Research & Analysis']),
      related_skills: JSON.stringify(['Programming/Coding', 'Research', 'Analytical Thinking', 'Mathematics', 'Critical Thinking']),
      resources: JSON.stringify([{ title: 'Bioinformatics Algorithms – Coursera', url: 'https://coursera.org' }, { title: 'NCBI Bioinformatics Resources', url: 'https://ncbi.nlm.nih.gov' }])
    },
    {
      name: 'Climate Data Scientist',
      description: 'Analyze climate data, develop models, and generate insights about climate change, weather patterns, and environmental impact to inform policy, industry, and conservation decisions.',
      field: 'Science', icon: '🌡️',
      salary_range: '₹7L – ₹40L per year', growth_outlook: 'Excellent',
      required_stream: JSON.stringify(['Science']), min_grade: 70,
      related_interests: JSON.stringify(['Environment & Nature', 'Mathematics & Statistics', 'Research & Analysis', 'Technology & Programming']),
      related_skills: JSON.stringify(['Analytical Thinking', 'Research', 'Programming/Coding', 'Mathematics', 'Critical Thinking']),
      resources: JSON.stringify([{ title: 'NASA Climate Resources', url: 'https://climate.nasa.gov' }, { title: 'Coursera Climate Science', url: 'https://coursera.org' }])
    },
    {
      name: 'Environmental Scientist',
      description: 'Study the environment and find solutions to problems including pollution, climate change, and natural resource depletion. Work with governments, NGOs, and corporations.',
      field: 'Science', icon: '🌿',
      salary_range: '₹4L – ₹20L per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Science']), min_grade: 60,
      related_interests: JSON.stringify(['Environment & Nature', 'Biology & Life Sciences', 'Research & Analysis', 'Social Work & Community']),
      related_skills: JSON.stringify(['Research', 'Analytical Thinking', 'Critical Thinking', 'Writing', 'Problem Solving']),
      resources: JSON.stringify([{ title: 'IUCN Environmental Resources', url: 'https://iucn.org' }, { title: 'Coursera Environmental Science', url: 'https://coursera.org' }])
    },
    {
      name: 'Marine Biologist',
      description: 'Study marine organisms and ecosystems, from deep-sea creatures to coral reefs. Conduct research to understand ocean biology, biodiversity, and the impact of climate change on marine life.',
      field: 'Science', icon: '🐠',
      salary_range: '₹4L – ₹22L per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Science']), min_grade: 65,
      related_interests: JSON.stringify(['Biology & Life Sciences', 'Environment & Nature', 'Research & Analysis']),
      related_skills: JSON.stringify(['Research', 'Analytical Thinking', 'Attention to Detail', 'Critical Thinking', 'Writing']),
      resources: JSON.stringify([{ title: 'Society for Marine Mammalogy', url: 'https://marinemammalscience.org' }, { title: 'NOAA Ocean Sciences', url: 'https://noaa.gov' }])
    },
    {
      name: 'Astrophysicist',
      description: 'Explore the universe by studying stars, galaxies, black holes, and cosmic phenomena. Combine physics, mathematics, and data analysis to understand the origins and evolution of the cosmos.',
      field: 'Science', icon: '🌌',
      salary_range: '₹6L – ₹35L per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Science']), min_grade: 80,
      related_interests: JSON.stringify(['Physics & Chemistry', 'Mathematics & Statistics', 'Research & Analysis']),
      related_skills: JSON.stringify(['Mathematics', 'Research', 'Analytical Thinking', 'Critical Thinking', 'Problem Solving']),
      resources: JSON.stringify([{ title: 'NASA Science Resources', url: 'https://science.nasa.gov' }, { title: 'ISRO Opportunities', url: 'https://isro.gov.in' }])
    },
    {
      name: 'Sports Scientist',
      description: 'Apply scientific principles to improve athletic performance, prevent injuries, and enhance recovery. Work with professional sports teams, national sports bodies, and individual athletes.',
      field: 'Science', icon: '🏃',
      salary_range: '₹4L – ₹25L per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Science']), min_grade: 60,
      related_interests: JSON.stringify(['Sports & Fitness', 'Biology & Life Sciences', 'Healthcare & Medicine', 'Research & Analysis']),
      related_skills: JSON.stringify(['Analytical Thinking', 'Research', 'Communication', 'Attention to Detail', 'Empathy']),
      resources: JSON.stringify([{ title: 'NSCA Strength & Conditioning', url: 'https://nsca.com' }, { title: 'Sports Science Degrees', url: 'https://coursera.org' }])
    },

    // ── Creative Arts ─────────────────────────────────────────────────────────
    {
      name: 'Graphic Designer',
      description: 'Create visual content for brands, publications, websites, and advertising. Graphic designers combine artistic skills with digital tools to communicate messages visually.',
      field: 'Creative Arts', icon: '🎨',
      salary_range: '₹3L – ₹20L per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Arts', 'Any']), min_grade: 50,
      related_interests: JSON.stringify(['Art & Design', 'Media & Communication', 'Technology & Programming']),
      related_skills: JSON.stringify(['Creativity', 'Design', 'Attention to Detail', 'Technical Skills', 'Communication']),
      resources: JSON.stringify([{ title: 'Adobe Creative Cloud Tutorials', url: 'https://helpx.adobe.com' }, { title: 'Canva Design School', url: 'https://designschool.canva.com' }])
    },
    {
      name: 'Film Director',
      description: 'Lead the creative vision of films, web series, and documentaries by directing actors, coordinating with production teams, and shaping the visual narrative to bring stories to life.',
      field: 'Creative Arts', icon: '🎬',
      salary_range: '₹3L – ₹1Cr+ per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Arts', 'Any']), min_grade: 50,
      related_interests: JSON.stringify(['Art & Design', 'Writing & Literature', 'Media & Communication', 'Entrepreneurship & Innovation']),
      related_skills: JSON.stringify(['Creativity', 'Leadership', 'Communication', 'Critical Thinking', 'Project Management']),
      resources: JSON.stringify([{ title: 'FTII Pune Film School', url: 'https://ftii.ac.in' }, { title: 'MasterClass Filmmaking', url: 'https://masterclass.com' }])
    },
    {
      name: 'Music Producer',
      description: 'Oversee the creation of music recordings, from conceptualization to final production. Work with artists, record labels, and studios to craft the sound, arrangement, and quality of music.',
      field: 'Creative Arts', icon: '🎧',
      salary_range: '₹2L – ₹50L+ per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Arts', 'Any']), min_grade: 45,
      related_interests: JSON.stringify(['Music & Performing Arts', 'Art & Design', 'Technology & Programming']),
      related_skills: JSON.stringify(['Creativity', 'Technical Skills', 'Attention to Detail', 'Communication', 'Teamwork']),
      resources: JSON.stringify([{ title: 'Berklee Online Music Production', url: 'https://online.berklee.edu' }, { title: 'Coursera Music Production', url: 'https://coursera.org' }])
    },
    {
      name: 'Fashion Designer',
      description: 'Create original clothing, accessories, and footwear by combining artistic vision with knowledge of materials, trends, and garment construction for retail, haute couture, or film/TV.',
      field: 'Creative Arts', icon: '👗',
      salary_range: '₹3L – ₹30L per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Arts', 'Any']), min_grade: 50,
      related_interests: JSON.stringify(['Art & Design', 'Entrepreneurship & Innovation', 'Media & Communication']),
      related_skills: JSON.stringify(['Creativity', 'Design', 'Attention to Detail', 'Communication', 'Technical Skills']),
      resources: JSON.stringify([{ title: 'NIFT Fashion Design Programs', url: 'https://nift.ac.in' }, { title: 'Parsons School of Design', url: 'https://newschool.edu/parsons' }])
    },
    {
      name: 'Interior Designer',
      description: 'Plan and design interior spaces to be functional, safe, and beautiful. Work on residential, commercial, and hospitality projects, selecting furniture, materials, colors, and layouts.',
      field: 'Creative Arts', icon: '🛋️',
      salary_range: '₹3L – ₹25L per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Arts', 'Science', 'Any']), min_grade: 55,
      related_interests: JSON.stringify(['Art & Design', 'Architecture & Construction', 'Entrepreneurship & Innovation']),
      related_skills: JSON.stringify(['Creativity', 'Design', 'Attention to Detail', 'Communication', 'Project Management']),
      resources: JSON.stringify([{ title: 'CIDA Interior Design Standards', url: 'https://accredit-id.org' }, { title: 'Coursera Interior Design', url: 'https://coursera.org' }])
    },

    // ── Media ─────────────────────────────────────────────────────────────────
    {
      name: 'Journalist / Reporter',
      description: 'Investigate and report on news stories across print, digital, and broadcast media. Journalists research, interview sources, and write compelling stories that inform the public.',
      field: 'Media', icon: '📰',
      salary_range: '₹3L – ₹20L per year', growth_outlook: 'Moderate',
      required_stream: JSON.stringify(['Arts', 'Any']), min_grade: 55,
      related_interests: JSON.stringify(['Writing & Literature', 'Media & Communication', 'Social Work & Community', 'Research & Analysis']),
      related_skills: JSON.stringify(['Writing', 'Communication', 'Research', 'Critical Thinking', 'Public Speaking']),
      resources: JSON.stringify([{ title: 'Reuters Journalism Training', url: 'https://reutersinstitute.politics.ox.ac.uk' }, { title: 'Coursera Journalism', url: 'https://coursera.org' }])
    },
    {
      name: 'Content Creator',
      description: 'Create engaging content across social media, YouTube, blogs, and podcasts. Content creators build audiences, work with brands, and monetize their creativity and expertise.',
      field: 'Media', icon: '📸',
      salary_range: '₹2L – ₹50L+ per year', growth_outlook: 'Excellent',
      required_stream: JSON.stringify(['Any']), min_grade: 45,
      related_interests: JSON.stringify(['Media & Communication', 'Art & Design', 'Writing & Literature', 'Entrepreneurship & Innovation']),
      related_skills: JSON.stringify(['Creativity', 'Communication', 'Writing', 'Technical Skills', 'Project Management']),
      resources: JSON.stringify([{ title: 'YouTube Creator Academy', url: 'https://creatoracademy.youtube.com' }, { title: 'HubSpot Content Marketing', url: 'https://academy.hubspot.com' }])
    },
    {
      name: 'Social Media Manager',
      description: 'Develop and execute social media strategies for brands, create engaging content, grow communities, analyze performance metrics, and manage influencer partnerships across platforms.',
      field: 'Media', icon: '📱',
      salary_range: '₹3L – ₹22L per year', growth_outlook: 'Excellent',
      required_stream: JSON.stringify(['Arts', 'Commerce', 'Any']), min_grade: 50,
      related_interests: JSON.stringify(['Media & Communication', 'Business & Finance', 'Art & Design', 'Writing & Literature']),
      related_skills: JSON.stringify(['Communication', 'Creativity', 'Analytical Thinking', 'Writing', 'Time Management']),
      resources: JSON.stringify([{ title: 'Meta Blueprint Social Media', url: 'https://facebookblueprint.com' }, { title: 'HubSpot Social Media Certification', url: 'https://academy.hubspot.com' }])
    },

    // ── Law ───────────────────────────────────────────────────────────────────
    {
      name: 'Lawyer / Advocate',
      description: 'Represent clients in legal proceedings, provide legal advice, draft legal documents, and interpret laws. Lawyers work in criminal, corporate, civil, and family law specializations.',
      field: 'Law', icon: '⚖️',
      salary_range: '₹5L – ₹60L per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Arts', 'Commerce', 'Any']), min_grade: 65,
      related_interests: JSON.stringify(['Law & Justice', 'Writing & Literature', 'Social Work & Community', 'Research & Analysis']),
      related_skills: JSON.stringify(['Critical Thinking', 'Communication', 'Research', 'Writing', 'Public Speaking', 'Analytical Thinking']),
      resources: JSON.stringify([{ title: 'Bar Council of India', url: 'https://barcouncilofindia.org' }, { title: 'CLAT Preparation', url: 'https://consortiumofnlus.ac.in' }])
    },

    // ── Education ─────────────────────────────────────────────────────────────
    {
      name: 'Teacher / Educator',
      description: 'Educate and inspire students across all age groups and subjects. Teachers design curriculum, deliver lessons, assess student progress, and play a pivotal role in shaping future generations.',
      field: 'Education', icon: '👩‍🏫',
      salary_range: '₹3L – ₹15L per year', growth_outlook: 'Stable',
      required_stream: JSON.stringify(['Any']), min_grade: 55,
      related_interests: JSON.stringify(['Education & Teaching', 'Social Work & Community', 'Research & Analysis']),
      related_skills: JSON.stringify(['Communication', 'Empathy', 'Leadership', 'Public Speaking', 'Creativity']),
      resources: JSON.stringify([{ title: 'DIKSHA – Teachers Platform', url: 'https://diksha.gov.in' }, { title: 'Coursera Teaching Skills', url: 'https://coursera.org' }])
    },
    {
      name: 'Political Scientist',
      description: 'Study political systems, institutions, behavior, and policy. Conduct research, advise governments and NGOs, and analyze elections, public opinion, and international relations.',
      field: 'Education', icon: '🏛️📜',
      salary_range: '₹4L – ₹25L per year', growth_outlook: 'Moderate',
      required_stream: JSON.stringify(['Arts', 'Any']), min_grade: 60,
      related_interests: JSON.stringify(['Law & Justice', 'Social Work & Community', 'Research & Analysis', 'Writing & Literature']),
      related_skills: JSON.stringify(['Research', 'Writing', 'Analytical Thinking', 'Communication', 'Critical Thinking']),
      resources: JSON.stringify([{ title: 'UPSC Preparation Resources', url: 'https://upsc.gov.in' }, { title: 'Coursera Political Science', url: 'https://coursera.org' }])
    },
    {
      name: 'Economist',
      description: 'Study how societies use resources, analyze economic data, develop theories, and advise governments and businesses on economic policy, trade, taxation, and market dynamics.',
      field: 'Education', icon: '📊💡',
      salary_range: '₹6L – ₹40L per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Commerce', 'Science', 'Arts']), min_grade: 68,
      related_interests: JSON.stringify(['Business & Finance', 'Mathematics & Statistics', 'Research & Analysis', 'Social Work & Community']),
      related_skills: JSON.stringify(['Mathematics', 'Analytical Thinking', 'Research', 'Critical Thinking', 'Writing']),
      resources: JSON.stringify([{ title: 'IMF Economic Research', url: 'https://imf.org/research' }, { title: 'Coursera Economics', url: 'https://coursera.org' }])
    },

    // ── Architecture ──────────────────────────────────────────────────────────
    {
      name: 'Architect',
      description: 'Design buildings and structures, balancing aesthetic vision with structural integrity, safety codes, and client needs. Architects create everything from homes to iconic landmarks.',
      field: 'Architecture', icon: '🏛️',
      salary_range: '₹4L – ₹30L per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Science', 'Arts']), min_grade: 65,
      related_interests: JSON.stringify(['Architecture & Construction', 'Art & Design', 'Environment & Nature', 'Mathematics & Statistics']),
      related_skills: JSON.stringify(['Creativity', 'Design', 'Mathematics', 'Attention to Detail', 'Project Management']),
      resources: JSON.stringify([{ title: 'NATA Exam Preparation', url: 'https://nata.in' }, { title: 'ArchDaily – Architecture Resources', url: 'https://archdaily.com' }])
    },
    {
      name: 'Urban Planner',
      description: 'Develop plans and programs for land use in cities, towns, and regions. Urban planners work to create sustainable, functional communities by designing infrastructure, zoning, and public spaces.',
      field: 'Architecture', icon: '🏙️',
      salary_range: '₹5L – ₹28L per year', growth_outlook: 'Good',
      required_stream: JSON.stringify(['Science', 'Arts']), min_grade: 62,
      related_interests: JSON.stringify(['Architecture & Construction', 'Environment & Nature', 'Social Work & Community', 'Research & Analysis']),
      related_skills: JSON.stringify(['Analytical Thinking', 'Project Management', 'Communication', 'Creativity', 'Research']),
      resources: JSON.stringify([{ title: 'Institute of Town Planners India', url: 'https://itpi.org.in' }, { title: 'APA Urban Planning Resources', url: 'https://planning.org' }])
    },
  ];

  // Insert careers by name (skip if already exists)
  for (const c of careers) {
    const existing = db.get('SELECT id FROM careers WHERE name = ?', c.name);
    if (!existing) {
      db.run(insertStmt, c.name, c.description, c.field, c.icon, c.salary_range, c.growth_outlook,
        c.required_stream, c.min_grade, c.related_interests, c.related_skills, c.resources);
    }
  }

  const total = db.get('SELECT COUNT(*) as count FROM careers');
  console.log(`🌱 Careers in database: ${total.count}`);
}

module.exports = { getDB, initDB };
