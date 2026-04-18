// Maps career names to relevant Indian entrance exams
// nextDate: ISO date string (YYYY-MM-DD) for the next upcoming exam session
export const examMapper = {
  'Software Engineer': [
    { name: 'JEE Main', difficulty: 'High', conducted: 'NTA', url: 'https://jeemain.nta.ac.in', tip: 'Focus on Maths, Physics & Computer Science', nextDate: '2027-01-22' },
    { name: 'GATE (CS)', difficulty: 'Very High', conducted: 'IITs/IISc', url: 'https://gate2025.iitr.ac.in', tip: 'Required for PSU jobs and M.Tech admissions', nextDate: '2027-02-01' },
    { name: 'CUET', difficulty: 'Moderate', conducted: 'NTA', url: 'https://cuet.samarth.ac.in', tip: 'For central university BCA/B.Tech programs', nextDate: '2026-05-15' },
  ],
  'Data Scientist': [
    { name: 'JEE Main', difficulty: 'High', conducted: 'NTA', url: 'https://jeemain.nta.ac.in', tip: 'Strong Maths foundation is essential', nextDate: '2027-01-22' },
    { name: 'GATE (CS/Stats)', difficulty: 'Very High', conducted: 'IITs/IISc', url: 'https://gate2025.iitr.ac.in', tip: 'Opens doors to IIT M.Tech in Data Science', nextDate: '2027-02-01' },
    { name: 'JAM (Statistics)', difficulty: 'High', conducted: 'IITs', url: 'https://jam.iitd.ac.in', tip: 'For M.Sc. Statistics at IITs', nextDate: '2027-02-09' },
  ],
  'Doctor / Physician': [
    { name: 'NEET UG', difficulty: 'Very High', conducted: 'NTA', url: 'https://neet.nta.nic.in', tip: 'Biology + Chemistry + Physics — mandatory for MBBS', nextDate: '2027-05-03' },
    { name: 'NEET PG', difficulty: 'Very High', conducted: 'NTA', url: 'https://nbe.edu.in', tip: 'Required for MD/MS specialization after MBBS', nextDate: '2026-11-09' },
    { name: 'AIIMS MBBS', difficulty: 'Extremely High', conducted: 'AIIMS', url: 'https://aiimsexams.ac.in', tip: 'Now merged with NEET — top scorers get AIIMS', nextDate: '2027-05-03' },
  ],
  'Civil Engineer': [
    { name: 'JEE Main', difficulty: 'High', conducted: 'NTA', url: 'https://jeemain.nta.ac.in', tip: 'Entry to NITs and top engineering colleges', nextDate: '2027-01-22' },
    { name: 'JEE Advanced', difficulty: 'Extremely High', conducted: 'IITs', url: 'https://jeeadv.ac.in', tip: 'Required for IIT Civil Engineering', nextDate: '2027-05-25' },
    { name: 'GATE (CE)', difficulty: 'Very High', conducted: 'IITs/IISc', url: 'https://gate2025.iitr.ac.in', tip: 'For PSU jobs like RITES, IRCON, CPWD', nextDate: '2027-02-01' },
  ],
  'Mechanical Engineer': [
    { name: 'JEE Main', difficulty: 'High', conducted: 'NTA', url: 'https://jeemain.nta.ac.in', tip: 'Physics & Maths are most important', nextDate: '2027-01-22' },
    { name: 'JEE Advanced', difficulty: 'Extremely High', conducted: 'IITs', url: 'https://jeeadv.ac.in', tip: 'For IIT Mechanical Engineering', nextDate: '2027-05-25' },
    { name: 'GATE (ME)', difficulty: 'Very High', conducted: 'IITs/IISc', url: 'https://gate2025.iitr.ac.in', tip: 'Opens PSU jobs like BHEL, ONGC, IOCL', nextDate: '2027-02-01' },
  ],
  'Chartered Accountant': [
    { name: 'CA Foundation', difficulty: 'Moderate', conducted: 'ICAI', url: 'https://icai.org', tip: 'Entry to CA course — given after Class 12', nextDate: '2026-11-01' },
    { name: 'CA Intermediate', difficulty: 'High', conducted: 'ICAI', url: 'https://icai.org', tip: 'Second level — Accounts, Law, Taxation', nextDate: '2026-11-01' },
    { name: 'CA Final', difficulty: 'Very High', conducted: 'ICAI', url: 'https://icai.org', tip: 'Final exam to become a qualified CA', nextDate: '2026-11-01' },
  ],
  'Business Analyst': [
    { name: 'CAT', difficulty: 'Very High', conducted: 'IIMs', url: 'https://iimcat.ac.in', tip: 'For MBA from IIMs — best route to BA roles', nextDate: '2026-11-23' },
    { name: 'XAT', difficulty: 'High', conducted: 'XLRI', url: 'https://xatonline.in', tip: 'For XLRI and other top B-schools', nextDate: '2027-01-04' },
    { name: 'GMAT', difficulty: 'High', conducted: 'GMAC', url: 'https://mba.com', tip: 'Required for international MBA programs', nextDate: null },
  ],
  'Marketing Manager': [
    { name: 'CAT', difficulty: 'Very High', conducted: 'IIMs', url: 'https://iimcat.ac.in', tip: 'MBA in Marketing from IIMs is the gold standard', nextDate: '2026-11-23' },
    { name: 'SNAP', difficulty: 'Moderate', conducted: 'Symbiosis', url: 'https://snaptest.org', tip: 'For Symbiosis MBA programs', nextDate: '2026-12-14' },
    { name: 'MAT', difficulty: 'Moderate', conducted: 'AIMA', url: 'https://aima.in', tip: 'Accepted by 600+ B-schools across India', nextDate: '2026-08-18' },
  ],
  'Graphic Designer': [
    { name: 'NID DAT', difficulty: 'High', conducted: 'NID', url: 'https://admissions.nid.edu', tip: 'National Institute of Design — premier design school', nextDate: '2026-10-15' },
    { name: 'UCEED', difficulty: 'High', conducted: 'IITs', url: 'https://uceed.iitb.ac.in', tip: 'Entry to B.Des at IIT Bombay, Guwahati, Hyderabad', nextDate: '2027-01-17' },
    { name: 'CEED', difficulty: 'High', conducted: 'IITs', url: 'https://ceed.iitb.ac.in', tip: 'For M.Des programs at IITs', nextDate: '2027-01-17' },
  ],
  'UX/UI Designer': [
    { name: 'NID DAT', difficulty: 'High', conducted: 'NID', url: 'https://admissions.nid.edu', tip: 'Best design school in India for UX/Interaction Design', nextDate: '2026-10-15' },
    { name: 'UCEED', difficulty: 'High', conducted: 'IITs', url: 'https://uceed.iitb.ac.in', tip: 'B.Des at IITs with strong placement in UX roles', nextDate: '2027-01-17' },
    { name: 'NIFT Entrance', difficulty: 'Moderate', conducted: 'NIFT', url: 'https://nift.ac.in', tip: 'Fashion & Communication Design programs', nextDate: '2027-01-11' },
  ],
  'Journalist / Reporter': [
    { name: 'IIMC Entrance', difficulty: 'Moderate', conducted: 'IIMC', url: 'https://iimc.nic.in', tip: 'Indian Institute of Mass Communication — top journalism school', nextDate: '2026-05-18' },
    { name: 'ACJ Entrance', difficulty: 'Moderate', conducted: 'ACJ', url: 'https://acj.in', tip: 'Asian College of Journalism, Chennai', nextDate: '2026-06-01' },
    { name: 'CUET', difficulty: 'Moderate', conducted: 'NTA', url: 'https://cuet.samarth.ac.in', tip: 'For Mass Communication programs at central universities', nextDate: '2026-05-15' },
  ],
  'Lawyer / Advocate': [
    { name: 'CLAT', difficulty: 'High', conducted: 'Consortium of NLUs', url: 'https://consortiumofnlus.ac.in', tip: 'Common Law Admission Test — entry to NLUs', nextDate: '2026-12-01' },
    { name: 'AILET', difficulty: 'High', conducted: 'NLU Delhi', url: 'https://nationallawuniversitydelhi.in', tip: 'For NLU Delhi specifically — very competitive', nextDate: '2026-12-01' },
    { name: 'LSAT India', difficulty: 'Moderate', conducted: 'LSAC', url: 'https://lsatindia.in', tip: 'Accepted by many private law schools', nextDate: '2027-01-18' },
  ],
  'Teacher / Educator': [
    { name: 'CTET', difficulty: 'Moderate', conducted: 'CBSE', url: 'https://ctet.nic.in', tip: 'Central Teacher Eligibility Test — mandatory for govt schools', nextDate: '2026-07-13' },
    { name: 'State TET', difficulty: 'Moderate', conducted: 'State Boards', url: 'https://education.gov.in', tip: 'State-level teacher eligibility tests', nextDate: null },
    { name: 'NET/JRF (Education)', difficulty: 'High', conducted: 'NTA', url: 'https://ugcnet.nta.ac.in', tip: 'For college-level teaching and lectureship', nextDate: '2026-06-16' },
  ],
  'Psychologist': [
    { name: 'CUET PG', difficulty: 'Moderate', conducted: 'NTA', url: 'https://cuet.samarth.ac.in', tip: 'For M.A./M.Sc. Psychology at central universities', nextDate: '2026-05-15' },
    { name: 'NIMHANS Entrance', difficulty: 'High', conducted: 'NIMHANS', url: 'https://nimhans.ac.in', tip: 'Premier institute for clinical psychology', nextDate: '2026-05-01' },
    { name: 'RCI CRR', difficulty: 'High', conducted: 'RCI', url: 'https://rehabcouncil.nic.in', tip: 'Required for rehabilitation psychology practice', nextDate: null },
  ],
  'Architect': [
    { name: 'NATA', difficulty: 'High', conducted: 'COA', url: 'https://nata.in', tip: 'National Aptitude Test in Architecture — mandatory for B.Arch', nextDate: '2026-07-06' },
    { name: 'JEE Paper 2 (B.Arch)', difficulty: 'High', conducted: 'NTA', url: 'https://jeemain.nta.ac.in', tip: 'Required for B.Arch at NITs and SPA schools', nextDate: '2027-01-22' },
    { name: 'GATE (AR)', difficulty: 'Very High', conducted: 'IITs/IISc', url: 'https://gate2025.iitr.ac.in', tip: 'For M.Arch and government architecture jobs', nextDate: '2027-02-01' },
  ],
  'Entrepreneur': [
    { name: 'CAT', difficulty: 'Very High', conducted: 'IIMs', url: 'https://iimcat.ac.in', tip: 'MBA gives strong business foundation & network', nextDate: '2026-11-23' },
    { name: 'Startup India Registration', difficulty: 'Low', conducted: 'DPIIT', url: 'https://startupindia.gov.in', tip: 'Register your startup for government benefits & funding', nextDate: null },
  ],
  'Financial Analyst': [
    { name: 'CFA Level 1', difficulty: 'High', conducted: 'CFA Institute', url: 'https://cfainstitute.org', tip: 'Gold standard for finance careers globally', nextDate: '2026-11-15' },
    { name: 'CAT', difficulty: 'Very High', conducted: 'IIMs', url: 'https://iimcat.ac.in', tip: 'MBA Finance from IIMs leads to top FA roles', nextDate: '2026-11-23' },
    { name: 'NISM Certifications', difficulty: 'Moderate', conducted: 'NISM', url: 'https://nism.ac.in', tip: 'SEBI-mandated certifications for securities market', nextDate: null },
  ],
  'Pharmacist': [
    { name: 'NEET UG', difficulty: 'Very High', conducted: 'NTA', url: 'https://neet.nta.nic.in', tip: 'Required for B.Pharm at government colleges', nextDate: '2027-05-03' },
    { name: 'GPAT', difficulty: 'High', conducted: 'NTA', url: 'https://gpat.nta.nic.in', tip: 'Graduate Pharmacy Aptitude Test — for M.Pharm admissions', nextDate: '2027-02-17' },
    { name: 'NIPER JEE', difficulty: 'High', conducted: 'NIPER', url: 'https://niperjee.gov.in', tip: 'For M.S. Pharm at National Institute of Pharmaceutical Education', nextDate: '2026-06-08' },
  ],
  'Content Creator': [
    { name: 'No formal exam required', difficulty: 'N/A', conducted: '—', url: 'https://creatoracademy.youtube.com', tip: 'Focus on building a portfolio, not exams', nextDate: null },
    { name: 'IIMC Entrance (optional)', difficulty: 'Moderate', conducted: 'IIMC', url: 'https://iimc.nic.in', tip: 'Mass Communication degree can help in credibility', nextDate: '2026-05-18' },
  ],
  'Game Developer': [
    { name: 'JEE Main', difficulty: 'High', conducted: 'NTA', url: 'https://jeemain.nta.ac.in', tip: 'B.Tech CS is the most common path into game dev', nextDate: '2027-01-22' },
    { name: 'UCEED', difficulty: 'High', conducted: 'IITs', url: 'https://uceed.iitb.ac.in', tip: 'B.Des with game design specialization at IITs', nextDate: '2027-01-17' },
    { name: 'MAHE Entrance', difficulty: 'Moderate', conducted: 'Manipal', url: 'https://manipal.edu', tip: 'Manipal offers B.Sc. in Game Design & Development', nextDate: '2026-05-01' },
  ],
  'Environmental Scientist': [
    { name: 'JAM (Environmental Science)', difficulty: 'High', conducted: 'IITs', url: 'https://jam.iitd.ac.in', tip: 'M.Sc. Environmental Science at IITs', nextDate: '2027-02-09' },
    { name: 'GATE (Ecology)', difficulty: 'High', conducted: 'IITs/IISc', url: 'https://gate2025.iitr.ac.in', tip: 'For M.Tech Environmental Engineering', nextDate: '2027-02-01' },
    { name: 'NEST', difficulty: 'High', conducted: 'NISER/UM-DAE CEBS', url: 'https://www.nestexam.in', tip: 'For integrated M.Sc. in Life Sciences', nextDate: '2026-06-01' },
  ],
  'Nurse': [
    { name: 'NEET UG', difficulty: 'Very High', conducted: 'NTA', url: 'https://neet.nta.nic.in', tip: 'Required for B.Sc Nursing at government colleges', nextDate: '2027-05-03' },
    { name: 'AIIMS Nursing Entrance', difficulty: 'High', conducted: 'AIIMS', url: 'https://aiimsexams.ac.in', tip: 'B.Sc Nursing at AIIMS — very prestigious', nextDate: '2026-06-15' },
    { name: 'JIPMER Nursing', difficulty: 'High', conducted: 'JIPMER', url: 'https://jipmer.edu.in', tip: 'B.Sc Nursing at JIPMER Puducherry', nextDate: '2026-05-20' },
  ],
};

export function getExamsForCareer(careerName) {
  return examMapper[careerName] || [];
}

export const difficultyConfig = {
  'Low': { color: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500' },
  'Moderate': { color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  'High': { color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  'Very High': { color: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
  'Extremely High': { color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
  'N/A': { color: 'bg-slate-50 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
};

// Generates a Google Calendar "Add Event" URL for an exam
export function getCalendarUrl(exam) {
  if (!exam.nextDate) return null;
  const dateStr = exam.nextDate.replace(/-/g, ''); // YYYYMMDD
  const title = encodeURIComponent(exam.name + ' Exam');
  const details = encodeURIComponent(`Conducted by: ${exam.conducted}\nTip: ${exam.tip}\nOfficial site: ${exam.url}`);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}/${dateStr}&details=${details}`;
}

// Returns days from today to the exam date (negative = past)
export function getDaysUntil(dateStr) {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}
