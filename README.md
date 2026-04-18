# CareerCompass — Smart Career Path Recommendation System

> A full-stack web application that helps Indian students discover the right career path based on their interests, skills, and academic background. Built for academic presentation with production-quality features.

---

## Live Features at a Glance

| Feature | Status |
|---|---|
| User Authentication (JWT) | ✅ Done |
| Career Assessment Questionnaire | ✅ Done |
| Weighted Scoring Algorithm | ✅ Done |
| Personalized Recommendations | ✅ Done |
| Skills Gap Analysis | ✅ Done |
| PDF Career Report Generator | ✅ Done |
| Side-by-Side Career Comparison | ✅ Done |
| Entrance Exam Mapper (India) | ✅ Done |
| Assessment Progress Tracker | ✅ Done |
| Bookmarks / Saved Careers | ✅ Done |
| Career Explorer with Search | ✅ Done |
| Admin Analytics Panel | ✅ Done |

---

## Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React 18 + Vite | UI framework + build tool |
| Tailwind CSS 3 | Utility-first styling |
| React Router v6 | Client-side routing |
| Framer Motion | Animations |
| Recharts | Progress tracker line chart |
| @phosphor-icons/react | Icon library |
| jsPDF + html2canvas | PDF report generation |
| Axios | HTTP client |

### Backend
| Tool | Purpose |
|---|---|
| Node.js + Express | REST API server |
| sql.js (SQLite WASM) | Embedded database — no setup needed |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| CORS + dotenv | Security + config |

---

## Project Structure

```
software project/
├── client/                         # React frontend
│   └── src/
│       ├── pages/
│       │   ├── Landing.jsx         # Home / marketing page
│       │   ├── Login.jsx           # Auth
│       │   ├── Register.jsx        # Auth
│       │   ├── Dashboard.jsx       # Overview + progress tracker
│       │   ├── Assessment.jsx      # 4-step quiz wizard
│       │   ├── Recommendations.jsx # Ranked career matches + PDF download
│       │   ├── CareerDetail.jsx    # Career info + gap analysis + exams
│       │   ├── Compare.jsx         # Side-by-side career comparison
│       │   ├── Explore.jsx         # Browse all careers with filters
│       │   ├── Bookmarks.jsx       # Saved careers
│       │   ├── Profile.jsx         # Edit profile
│       │   └── Admin.jsx           # Admin panel (analytics + CRUD)
│       ├── components/
│       │   ├── Navbar.jsx          # Floating glass pill nav
│       │   ├── CareerCard.jsx      # Career card with compare + bookmark
│       │   └── ReportTemplate.jsx  # Hidden PDF render target
│       ├── context/
│       │   ├── AuthContext.jsx     # Global auth state
│       │   └── CompareContext.jsx  # Compare list state (max 3)
│       ├── data/
│       │   └── examMapper.js       # India entrance exam mappings
│       └── services/
│           └── api.js              # Axios instance with auth interceptor
│
└── server/                         # Express backend
    ├── index.js                    # Server entry point
    ├── database/
    │   └── db.js                   # sql.js wrapper + DB init + 22 career seeds
    ├── middleware/
    │   └── auth.js                 # JWT + admin middleware
    └── routes/
        ├── auth.js                 # Register, login, /me
        ├── users.js                # Profile get/update
        ├── assessment.js           # Submit, latest, history
        ├── recommendations.js      # Personalized matches with gap data
        ├── careers.js              # Browse + search careers
        ├── bookmarks.js            # Save/remove careers
        └── admin.js                # Analytics, user & career management
```

---

## How to Run

### Prerequisites
- Node.js 18+
- npm

### Step 1 — Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd client
npm install
```

### Step 2 — Start backend

```bash
cd server
node index.js
```

Server starts at **http://localhost:5000**

### Step 3 — Start frontend

```bash
cd client
npm run dev
```

App opens at **http://localhost:5173**

---

## Default Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@careercompass.com | admin123 |
| Student | Register your own | — |

---

## Core Features (Detailed)

### Career Assessment — 4-Step Wizard
Students fill out a structured questionnaire:
1. **Academic Background** — stream (Science/Commerce/Arts), Class 10, Class 12, current grade
2. **Interests** — select from 20+ interest areas (Technology, Medicine, Creative Arts, etc.)
3. **Skills** — select from 30+ skills (Programming, Communication, Research, etc.)
4. **Review** — confirm before submission

### Weighted Scoring Algorithm
Each career is scored out of 100 points:
- **Stream match** — 20 points (full match = 20, partial = 5)
- **Grade threshold** — 20 points (proportional to min grade required)
- **Interest overlap** — 35 points (proportion of matching interests)
- **Skill overlap** — 25 points (proportion of matching skills)

Top 10 career matches are saved per assessment.

### Skills Gap Analysis
For the top career match (and visible on every career detail page):
- Shows which skills the student **already has** (green)
- Shows which skills they **still need** (red)
- Progress bar: matched skills / total required skills
- Potential score shown if all missing skills were added

### PDF Career Report
On the Recommendations page, "Download Report" generates a styled PDF containing:
- Student name, stream, grades
- Top 5 career matches with percentage scores and salary ranges
- Skills gap table for the #1 career (have vs. need)
- Generated date

### Side-by-Side Career Comparison
- Click the ⚖ icon on any career card to add it to compare (max 3)
- A floating bar appears at the bottom of the screen
- `/compare` page shows a full table: match score, salary, growth outlook, min grade, stream, skills overlap matrix
- "Best Match" badge and growth star highlight the strongest option

### Entrance Exam Mapper
Every career detail page shows the relevant Indian entrance exams:
- Exam name (JEE Main, JEE Advanced, NEET UG, NEET PG, CAT, CLAT, AILET, GATE, NDA, NID DAT, UCEED, NATA, CA Foundation, etc.)
- Difficulty level with color coding (Low → Extremely High)
- Conducting body
- Preparation tip

### Assessment Progress Tracker
Dashboard shows a line chart (recharts) plotting the student's top career match score across every assessment they've taken. If the score improved, a green delta badge shows "↑8% since last". Also shows the top 5 careers from the latest assessment.

### Admin Panel (`/admin`)
Accessible only to admin accounts:
- **Overview tab** — total users, assessments, recommendations; pie chart by stream; bar chart by career field
- **Users tab** — full user list with roles
- **Careers tab** — add, edit, delete careers with full detail modal

---

## Database

Uses **sql.js** — a pure WebAssembly port of SQLite. No installation, no native compilation, no external database server required. The database is stored as a file (`server/database/careercompass.db`) and auto-created with seed data on first run.

### Tables
- `users` — id, name, email, password_hash, role, created_at
- `profiles` — user_id, stream, grade_10, grade_12, current_grade
- `assessments` — user_id, interests[], skills[], grades, stream, created_at
- `careers` — 22 pre-seeded careers with full data
- `recommendations` — user_id, career_id, score
- `bookmarks` — user_id, career_id

### Seeded Careers (22 total)
Software Engineer, Doctor, Chartered Accountant, Lawyer, Data Scientist, Graphic Designer, Civil Engineer, Teacher/Professor, Journalist, Architect, Investment Banker, Psychologist, UX Designer, Mechanical Engineer, Pharmacist, Film Director, Fashion Designer, Environmental Scientist, Cybersecurity Analyst, Digital Marketer, Biotechnologist, Chef/Culinary Artist

---

## What Makes This Different

Compared to typical student projects and even commercial Indian career guidance platforms:

1. **PDF report generation** — personalized downloadable document (no other student project does this)
2. **Skills gap analysis** — not just "you match" but "here's exactly what you're missing"
3. **Real-time career comparison** — side-by-side table with skills overlap matrix
4. **Entrance exam mapper** — JEE/NEET/CAT/CLAT etc. mapped directly to each career inline
5. **Longitudinal progress tracking** — scores improve over multiple assessments, shown as a chart
6. **Embedded database** — works out of the box with zero external dependencies
7. **Agency-grade UI** — not a Bootstrap template; custom design system with animations

---

## Changelog

### v1.0 — Core System
- User registration, login, JWT auth
- Career assessment wizard (interests, skills, grades, stream)
- Weighted scoring algorithm → top 10 recommendations
- Dashboard, Recommendations, Explore, Bookmarks pages
- Admin panel with analytics

### v1.1 — Extraordinary Features
- Added **Skills Gap Analysis** on recommendations and career detail pages
- Added **PDF Career Report Generator** with jsPDF + html2canvas
- Added **Side-by-Side Career Comparison** (CompareContext + floating bar + Compare page)
- Added **Entrance Exam Mapper** (22 careers → Indian exams with difficulty levels)
- Added **Assessment Progress Tracker** (LineChart on Dashboard, /assessment/history endpoint)
- Added gap mini-indicator on every CareerCard

---
## Author
Neha Joshua

*Built with React + Express + SQLite · Designed for academic presentation*


