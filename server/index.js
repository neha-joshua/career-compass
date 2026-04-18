require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./database/db');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const assessmentRoutes = require('./routes/assessment');
const recommendationRoutes = require('./routes/recommendations');
const careerRoutes = require('./routes/careers');
const bookmarkRoutes = require('./routes/bookmarks');
const adminRoutes = require('./routes/admin');
const resumeRoutes = require('./routes/resume');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'], credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/resume', resumeRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Start server after DB is ready
async function start() {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`\n🧭 CareerCompass Server → http://localhost:${PORT}`);
      console.log(`🔑 Admin login: admin@careercompass.com / admin123\n`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
