import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Brain, ArrowRight, BookOpen, Certificate, CheckCircle, XCircle, TrendUp, Sparkle } from '@phosphor-icons/react';

const COURSE_MAP = {
  'Programming/Coding': [
    { title: 'CS50 – Intro to Computer Science', url: 'https://cs50.harvard.edu', provider: 'Harvard (Free)' },
    { title: 'freeCodeCamp Full Curriculum', url: 'https://freecodecamp.org', provider: 'freeCodeCamp (Free)' },
    { title: 'The Odin Project', url: 'https://theodinproject.com', provider: 'Open Source (Free)' },
  ],
  'Analytical Thinking': [
    { title: 'Critical Thinking & Problem Solving', url: 'https://coursera.org', provider: 'Coursera' },
    { title: 'Data Analysis with Python', url: 'https://coursera.org', provider: 'IBM / Coursera' },
  ],
  'Mathematics': [
    { title: 'Khan Academy Mathematics', url: 'https://khanacademy.org', provider: 'Khan Academy (Free)' },
    { title: 'MIT 18.01 Single Variable Calculus', url: 'https://ocw.mit.edu', provider: 'MIT OCW (Free)' },
  ],
  'Design': [
    { title: 'Google UX Design Certificate', url: 'https://grow.google', provider: 'Google (Coursera)' },
    { title: 'Adobe Creative Cloud Tutorials', url: 'https://helpx.adobe.com', provider: 'Adobe (Free)' },
  ],
  'Communication': [
    { title: 'Business Communication Skills', url: 'https://coursera.org', provider: 'Coursera' },
    { title: 'Effective Communication', url: 'https://edx.org', provider: 'edX' },
  ],
  'Leadership': [
    { title: 'Leadership & Management Specialization', url: 'https://coursera.org', provider: 'Coursera' },
    { title: 'Leading with Emotional Intelligence', url: 'https://linkedin.com/learning', provider: 'LinkedIn Learning' },
  ],
  'Research': [
    { title: 'Research Methods & Design', url: 'https://coursera.org', provider: 'Coursera' },
    { title: 'Academic Writing & Research', url: 'https://edx.org', provider: 'edX' },
  ],
  'Project Management': [
    { title: 'Google Project Management Certificate', url: 'https://grow.google', provider: 'Google (Coursera)' },
    { title: 'PMP Certification Prep', url: 'https://pmi.org', provider: 'PMI' },
  ],
  'Technical Skills': [
    { title: 'AWS Cloud Practitioner', url: 'https://aws.amazon.com/certification', provider: 'Amazon Web Services' },
    { title: 'Microsoft Learn Platform', url: 'https://learn.microsoft.com', provider: 'Microsoft (Free)' },
  ],
  'Writing': [
    { title: 'Academic & Business Writing', url: 'https://coursera.org', provider: 'Coursera' },
    { title: 'Content Strategy Certificate', url: 'https://hubspot.com/training', provider: 'HubSpot Academy (Free)' },
  ],
  'Empathy': [
    { title: 'Emotional Intelligence at Work', url: 'https://coursera.org', provider: 'Coursera' },
    { title: 'Human-Centered Design', url: 'https://plusacumen.org', provider: '+Acumen (Free)' },
  ],
  'Critical Thinking': [
    { title: 'Think Again: How to Reason & Argue', url: 'https://coursera.org', provider: 'Duke / Coursera (Free)' },
    { title: 'Logical and Critical Thinking', url: 'https://futurelearn.com', provider: 'FutureLearn' },
  ],
  'Creativity': [
    { title: 'Creative Problem Solving', url: 'https://coursera.org', provider: 'Coursera' },
    { title: 'Design Thinking', url: 'https://ideo.com/U', provider: 'IDEO U' },
  ],
  'Attention to Detail': [
    { title: 'Quality Management & Control', url: 'https://coursera.org', provider: 'Coursera' },
    { title: 'Six Sigma Yellow Belt', url: 'https://asq.org', provider: 'ASQ' },
  ],
  'Public Speaking': [
    { title: 'Public Speaking Skills', url: 'https://coursera.org', provider: 'Coursera' },
    { title: 'Toastmasters International', url: 'https://toastmasters.org', provider: 'Toastmasters' },
  ],
  'Teamwork': [
    { title: 'Teamwork Skills: Communicating Effectively in Groups', url: 'https://coursera.org', provider: 'Coursera' },
    { title: 'Collaboration Skills', url: 'https://linkedin.com/learning', provider: 'LinkedIn Learning' },
  ],
  'Time Management': [
    { title: 'Work Smarter, Not Harder: Time Management', url: 'https://coursera.org', provider: 'Coursera' },
    { title: 'Productivity & Time Management', url: 'https://udemy.com', provider: 'Udemy' },
  ],
  'Problem Solving': [
    { title: 'Problem Solving Techniques', url: 'https://coursera.org', provider: 'Coursera' },
    { title: 'Computational Thinking', url: 'https://edx.org', provider: 'edX' },
  ],
};

const PIE_COLORS = ['#16a34a', '#f87171'];
const BAR_COLOR = '#16a34a';
const BAR_MISSING = '#fca5a5';

export default function SkillGap() {
  const [recommendations, setRecommendations] = useState([]);
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/recommendations'),
      api.get('/assessment/latest').catch(() => ({ data: null })),
    ]).then(([recRes, assRes]) => {
      setRecommendations(recRes.data || []);
      setAssessment(assRes.data);
      if (recRes.data?.length > 0) setSelected(recRes.data[0]);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-16">
        <div className="w-12 h-12 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 pt-16">
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <div className="w-20 h-20 bg-brand-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Brain size={40} weight="duotone" className="text-brand-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">No Skill Gap Data Yet</h2>
          <p className="text-slate-500 mb-8">Complete a career assessment to get your personalized skill gap analysis.</p>
          <Link to="/assessment" className="btn-primary inline-flex">
            Take Assessment <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  const top5 = recommendations.slice(0, 5);
  const userSkills = assessment ? [...(assessment.skills || []), ...(assessment.resume_skills || [])] : [];

  // Data for overall skills pie
  const allCareerSkills = new Set();
  recommendations.slice(0, 10).forEach(r => r.career.related_skills?.forEach(s => allCareerSkills.add(s)));
  const ownedCount = [...allCareerSkills].filter(s => userSkills.includes(s)).length;
  const missingCount = allCareerSkills.size - ownedCount;
  const pieData = [
    { name: 'Skills You Have', value: ownedCount },
    { name: 'Skills to Develop', value: missingCount },
  ];

  // Bar chart: top 5 careers by score
  const barData = top5.map(r => ({
    name: r.career.name.length > 18 ? r.career.name.slice(0, 16) + '…' : r.career.name,
    icon: r.career.icon,
    score: r.score,
    potential: r.gap?.potentialScore || r.score,
  }));

  // Radar chart for selected career
  const selectedGap = selected?.gap;
  const selectedCareerSkills = selected?.career?.related_skills || [];
  const radarData = selectedCareerSkills.map(skill => ({
    skill: skill.length > 16 ? skill.slice(0, 14) + '…' : skill,
    fullSkill: skill,
    you: userSkills.includes(skill) ? 100 : 0,
    required: 100,
  }));

  const courses = selectedCareerSkills
    .filter(s => !userSkills.includes(s))
    .flatMap(s => (COURSE_MAP[s] || []).slice(0, 2))
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50/30 via-slate-50 to-teal-50/20 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-100 text-brand-700 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-3">
            <Sparkle weight="fill" size={12} /> Skill Gap Analysis
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Your Skill Gap Dashboard</h1>
          <p className="text-slate-500">Identify what you have, what you need, and how to bridge the gap.</p>
        </div>

        {/* Overview row */}
        <div className="grid sm:grid-cols-3 gap-5 mb-10">
          {[
            { label: 'Skills You Have', value: ownedCount, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Skills to Develop', value: missingCount, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
            { label: 'Careers Analyzed', value: recommendations.length, icon: TrendUp, color: 'text-brand-600', bg: 'bg-brand-50' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6 flex items-center gap-4">
              <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon size={24} weight="duotone" className={color} />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{value}</div>
                <div className="text-sm text-slate-500 font-medium">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          {/* Pie chart */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
            <h2 className="text-base font-bold text-slate-900 mb-1">Overall Skill Coverage</h2>
            <p className="text-xs text-slate-400 mb-6">Across your top 10 recommended careers</p>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar chart: current vs potential score */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
            <h2 className="text-base font-bold text-slate-900 mb-1">Score vs Potential</h2>
            <p className="text-xs text-slate-400 mb-6">Current match vs score if you gain missing skills</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} unit="%" />
                <Tooltip formatter={(v) => `${v}%`} />
                <Bar dataKey="score" name="Current Score" fill={BAR_COLOR} radius={[4, 4, 0, 0]} />
                <Bar dataKey="potential" name="Potential Score" fill="#86efac" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Career selector + deep analysis */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Career list */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-900 text-sm">Select a Career</h2>
                <p className="text-xs text-slate-400 mt-0.5">View detailed skill gap for each career</p>
              </div>
              <div className="divide-y divide-slate-50">
                {top5.map(rec => (
                  <button
                    key={rec.id}
                    onClick={() => setSelected(rec)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      selected?.id === rec.id ? 'bg-brand-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-2xl">{rec.career.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${selected?.id === rec.id ? 'text-brand-700' : 'text-slate-800'}`}>
                        {rec.career.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-500 rounded-full" style={{ width: `${rec.score}%` }} />
                        </div>
                        <span className="text-xs text-slate-500 font-semibold">{rec.score}%</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Deep analysis */}
          <div className="lg:col-span-2 space-y-5">
            {selected && (
              <>
                {/* Career header */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <span className="text-4xl">{selected.career.icon}</span>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-slate-900">{selected.career.name}</h2>
                      <p className="text-sm text-slate-500">{selected.career.field}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-extrabold text-brand-600">{selected.score}%</div>
                      <div className="text-xs text-slate-400">match</div>
                    </div>
                  </div>

                  {/* Skills breakdown */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50 rounded-xl">
                      <h3 className="text-xs font-bold text-emerald-700 mb-3 flex items-center gap-1.5">
                        <CheckCircle size={14} weight="fill" /> You Have ({selected.gap?.matchedSkills?.length || 0})
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {(selected.gap?.matchedSkills || []).map(s => (
                          <span key={s} className="px-2.5 py-1 bg-white text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200">{s}</span>
                        ))}
                        {(selected.gap?.matchedSkills || []).length === 0 && <span className="text-xs text-emerald-600">None yet — keep building!</span>}
                      </div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-xl">
                      <h3 className="text-xs font-bold text-red-600 mb-3 flex items-center gap-1.5">
                        <XCircle size={14} weight="fill" /> To Develop ({selected.gap?.missingSkills?.length || 0})
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {(selected.gap?.missingSkills || []).map(s => (
                          <span key={s} className="px-2.5 py-1 bg-white text-red-600 text-xs font-semibold rounded-lg border border-red-200">{s}</span>
                        ))}
                        {(selected.gap?.missingSkills || []).length === 0 && <span className="text-xs text-emerald-600">All skills matched! 🎉</span>}
                      </div>
                    </div>
                  </div>

                  {selected.gap?.potentialScore > selected.score && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3">
                      <TrendUp size={18} className="text-amber-600 flex-shrink-0" />
                      <p className="text-xs text-amber-700 font-semibold">
                        Develop missing skills → reach <span className="text-amber-800 font-bold">{selected.gap.potentialScore}%</span> match score (currently {selected.score}%)
                      </p>
                    </div>
                  )}
                </div>

                {/* Radar chart */}
                {radarData.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
                    <h3 className="font-bold text-slate-900 mb-1 text-sm">Skills Radar</h3>
                    <p className="text-xs text-slate-400 mb-4">Your skills vs career requirements</p>
                    <ResponsiveContainer width="100%" height={240}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: '#64748b' }} />
                        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="Required" dataKey="required" stroke="#e2e8f0" fill="#e2e8f0" fillOpacity={0.4} />
                        <Radar name="You" dataKey="you" stroke="#16a34a" fill="#16a34a" fillOpacity={0.5} />
                        <Tooltip />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Course recommendations */}
                {courses.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
                    <h3 className="font-bold text-slate-900 mb-1 text-sm flex items-center gap-2">
                      <BookOpen size={16} className="text-brand-600" /> Recommended Learning Resources
                    </h3>
                    <p className="text-xs text-slate-400 mb-5">Actionable courses to close your skill gaps for {selected.career.name}</p>
                    <div className="space-y-3">
                      {courses.map((course, i) => (
                        <a
                          key={i}
                          href={course.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:border-brand-200 hover:bg-brand-50/40 transition-all group"
                        >
                          <div className="w-9 h-9 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Certificate size={18} className="text-brand-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 group-hover:text-brand-700 truncate">{course.title}</p>
                            <p className="text-xs text-slate-400">{course.provider}</p>
                          </div>
                          <ArrowRight size={15} className="text-slate-300 group-hover:text-brand-500 flex-shrink-0 transition-colors" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
