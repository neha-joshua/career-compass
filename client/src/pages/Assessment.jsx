import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  CheckCircle, ArrowRight, ArrowLeft, GraduationCap, Heart, Brain, Rocket,
  UploadSimple, File, X, MapPin, Warning, Sparkle
} from '@phosphor-icons/react';

const STREAMS = ['Science', 'Commerce', 'Arts'];

const INTERESTS = [
  'Technology & Programming', 'Mathematics & Statistics', 'Biology & Life Sciences',
  'Physics & Chemistry', 'Business & Finance', 'Art & Design',
  'Writing & Literature', 'Music & Performing Arts', 'Healthcare & Medicine',
  'Law & Justice', 'Education & Teaching', 'Environment & Nature',
  'Social Work & Community', 'Sports & Fitness', 'Media & Communication',
  'Research & Analysis', 'Architecture & Construction', 'Entrepreneurship & Innovation',
];

const SKILLS = [
  'Problem Solving', 'Critical Thinking', 'Communication', 'Leadership',
  'Creativity', 'Teamwork', 'Time Management', 'Technical Skills',
  'Analytical Thinking', 'Writing', 'Research', 'Design',
  'Programming/Coding', 'Mathematics', 'Public Speaking',
  'Empathy', 'Attention to Detail', 'Project Management',
];

const INDIA_CITIES = [
  'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai',
  'Kolkata', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kochi',
  'Chandigarh', 'Bhopal', 'Indore', 'Nagpur', 'Visakhapatnam',
  'Tier 2 City', 'Tier 3 City / Small Town', 'Outside India',
];

const STEPS = [
  { id: 1, title: 'Academic & Resume', icon: GraduationCap, color: 'brand' },
  { id: 2, title: 'Your Interests', icon: Heart, color: 'rose' },
  { id: 3, title: 'Your Skills', icon: Brain, color: 'violet' },
  { id: 4, title: 'Review & Launch', icon: Rocket, color: 'emerald' },
];

export default function Assessment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [startTime] = useState(Date.now());

  // Resume state
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [resumeError, setResumeError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    stream: '',
    grade_10: '',
    grade_12: '',
    current_grade: '',
    location: '',
    interests: [],
    skills: [],
  });

  const [fieldErrors, setFieldErrors] = useState({});

  // Auto-apply resume skills/interests when resume data arrives
  useEffect(() => {
    if (!resumeData) return;
    setForm(f => ({
      ...f,
      interests: [...new Set([...f.interests, ...resumeData.interests])].slice(0, 10),
      skills: [...new Set([...f.skills, ...resumeData.skills])].slice(0, 12),
    }));
  }, [resumeData]);

  const toggleArray = (key, value) => {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(value)
        ? f[key].filter(v => v !== value)
        : [...f[key], value]
    }));
  };

  const validateStep = () => {
    const errs = {};
    if (step === 1) {
      if (!form.stream) errs.stream = 'Please select your academic stream';
      const g10 = parseFloat(form.grade_10);
      const g12 = parseFloat(form.grade_12);
      const gc = parseFloat(form.current_grade);
      if (form.grade_10 && (isNaN(g10) || g10 < 0 || g10 > 100)) errs.grade_10 = 'Must be 0–100';
      if (form.grade_12 && (isNaN(g12) || g12 < 0 || g12 > 100)) errs.grade_12 = 'Must be 0–100';
      if (form.current_grade && (isNaN(gc) || gc < 0 || gc > 100)) errs.current_grade = 'Must be 0–100';
    }
    if (step === 2 && form.interests.length < 3) errs.interests = 'Select at least 3 interests';
    if (step === 3 && form.skills.length < 3) errs.skills = 'Select at least 3 skills';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const canProceed = () => {
    if (step === 1) return form.stream !== '';
    if (step === 2) return form.interests.length >= 3;
    if (step === 3) return form.skills.length >= 3;
    return true;
  };

  const handleNext = () => {
    if (validateStep()) setStep(s => s + 1);
  };

  // ── Resume upload ────────────────────────────────────────────────────────
  const handleFile = async (file) => {
    if (!file) return;
    const maxSize = 5 * 1024 * 1024;
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!allowed.includes(file.type)) {
      setResumeError('Only PDF and DOCX files are accepted');
      return;
    }
    if (file.size > maxSize) {
      setResumeError('File size must be under 5 MB');
      return;
    }
    setResumeError('');
    setResumeFile(file);
    setResumeUploading(true);
    try {
      const fd = new FormData();
      fd.append('resume', file);
      const res = await api.post('/resume/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResumeData(res.data);
    } catch (err) {
      setResumeError(err.response?.data?.message || 'Failed to parse resume');
      setResumeFile(null);
    } finally {
      setResumeUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    try {
      await api.post('/assessment', {
        stream: form.stream,
        grade_10: parseFloat(form.grade_10) || null,
        grade_12: parseFloat(form.grade_12) || null,
        current_grade: parseFloat(form.current_grade) || null,
        interests: form.interests,
        skills: form.skills,
        location: form.location || null,
        resume_skills: resumeData?.skills || [],
        time_spent: timeSpent,
      });
      navigate('/recommendations');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit assessment');
      setLoading(false);
    }
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50/40 via-slate-50 to-teal-50/30 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-100 text-brand-700 rounded-full text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkle weight="fill" size={13} />
            Hybrid Adaptive Career Simulation
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Career Assessment</h1>
          <p className="text-slate-500 text-sm">Your answers power a personalized career simulation across 60+ paths</p>
        </div>

        {/* Progress steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((s) => {
              const Icon = s.icon;
              const isCompleted = step > s.id;
              const isCurrent = step === s.id;
              return (
                <div key={s.id} className="flex flex-col items-center gap-1.5">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted ? 'bg-emerald-500 text-white shadow-lg' :
                    isCurrent ? 'bg-brand-600 text-white shadow-brand' :
                    'bg-white text-slate-400 border-2 border-slate-200'
                  }`}>
                    {isCompleted ? <CheckCircle weight="fill" size={22} /> : <Icon size={20} />}
                  </div>
                  <span className={`text-[11px] font-semibold hidden sm:block ${isCurrent ? 'text-brand-600' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6 sm:p-8 mb-6">

          {/* ── Step 1: Academic + Resume ── */}
          {step === 1 && (
            <div className="animate-fade-in space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center">
                  <GraduationCap size={26} weight="duotone" className="text-brand-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Academic Background</h2>
                  <p className="text-sm text-slate-500">Tell us about your education and optionally upload your resume</p>
                </div>
              </div>

              {/* Resume Upload */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-slate-700">Resume Upload <span className="text-slate-400 font-normal">(optional – auto-fills skills)</span></label>
                  {resumeData && (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      ✓ Parsed successfully
                    </span>
                  )}
                </div>

                {!resumeFile ? (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
                      dragOver
                        ? 'border-brand-400 bg-brand-50'
                        : 'border-slate-200 hover:border-brand-300 hover:bg-brand-50/40'
                    }`}
                  >
                    <UploadSimple size={28} className="mx-auto text-brand-400 mb-2" />
                    <p className="text-sm font-semibold text-slate-700 mb-1">
                      {dragOver ? 'Drop it here!' : 'Drag & drop or click to upload'}
                    </p>
                    <p className="text-xs text-slate-400">PDF or DOCX · Max 5 MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.doc"
                      className="hidden"
                      onChange={e => handleFile(e.target.files[0])}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <File size={20} className="text-brand-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{resumeFile.name}</p>
                      {resumeUploading && <p className="text-xs text-brand-600 mt-0.5">Analyzing resume…</p>}
                      {resumeData && (
                        <p className="text-xs text-emerald-600 mt-0.5">
                          {resumeData.skills.length} skills · {resumeData.interests.length} interest areas detected
                        </p>
                      )}
                    </div>
                    <button onClick={() => { setResumeFile(null); setResumeData(null); setResumeError(''); }} className="text-slate-400 hover:text-red-500 transition-colors">
                      <X size={18} />
                    </button>
                  </div>
                )}

                {resumeUploading && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                    <div className="w-4 h-4 rounded-full border-2 border-brand-300 border-t-brand-600 animate-spin" />
                    Parsing resume with AI…
                  </div>
                )}

                {resumeError && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">
                    <Warning size={16} className="flex-shrink-0" />
                    {resumeError}
                  </div>
                )}

                {resumeData && (
                  <div className="mt-3 p-4 bg-brand-50 rounded-2xl border border-brand-100">
                    <p className="text-xs font-bold text-brand-700 mb-2">Auto-detected skills (pre-filled on next steps):</p>
                    <div className="flex flex-wrap gap-1.5">
                      {resumeData.skills.slice(0, 10).map(s => (
                        <span key={s} className="px-2.5 py-1 bg-white text-brand-700 text-xs font-semibold rounded-lg border border-brand-200">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Stream */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">
                  Academic Stream <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {STREAMS.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => { setForm(f => ({ ...f, stream: s })); setFieldErrors(e => ({ ...e, stream: '' })); }}
                      className={`py-4 px-4 rounded-2xl border-2 font-bold text-sm transition-all duration-200 ${
                        form.stream === s
                          ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-brand'
                          : 'border-slate-200 text-slate-600 hover:border-brand-300 hover:bg-brand-50/50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {fieldErrors.stream && <p className="text-xs text-red-500 mt-2 flex items-center gap-1"><Warning size={12} /> {fieldErrors.stream}</p>}
              </div>

              {/* Grades */}
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { key: 'grade_10', label: 'Class 10 %' },
                  { key: 'grade_12', label: 'Class 12 %' },
                  { key: 'current_grade', label: 'Current / College %' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="e.g. 85"
                      value={form[key]}
                      onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setFieldErrors(er => ({ ...er, [key]: '' })); }}
                      className={`input-field ${fieldErrors[key] ? 'border-red-300 ring-1 ring-red-200' : ''}`}
                    />
                    {fieldErrors[key] && <p className="text-xs text-red-500 mt-1">{fieldErrors[key]}</p>}
                  </div>
                ))}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <MapPin size={15} className="text-brand-500" />
                  Location / City <span className="text-slate-400 font-normal">(for local job market insights)</span>
                </label>
                <select
                  value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  className="input-field"
                >
                  <option value="">Select your city / region</option>
                  {INDIA_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* ── Step 2: Interests ── */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center">
                  <Heart size={26} weight="duotone" className="text-rose-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Your Interests</h2>
                  <p className="text-sm text-slate-500">Select at least 3 areas that fascinate you</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-5">
                <span className="text-xs text-slate-400">
                  Selected: <span className={`font-bold ${form.interests.length >= 3 ? 'text-brand-600' : 'text-red-500'}`}>{form.interests.length}</span> / 3 minimum
                </span>
                {resumeData && form.interests.length > 0 && (
                  <span className="text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full font-semibold">✓ Pre-filled from resume</span>
                )}
              </div>

              <div className="flex flex-wrap gap-2.5">
                {INTERESTS.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => { toggleArray('interests', interest); setFieldErrors(e => ({ ...e, interests: '' })); }}
                    className={`px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                      form.interests.includes(interest)
                        ? 'border-rose-400 bg-rose-50 text-rose-700 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:border-rose-300 hover:bg-rose-50/50'
                    }`}
                  >
                    {form.interests.includes(interest) && '✓ '}
                    {interest}
                  </button>
                ))}
              </div>
              {fieldErrors.interests && (
                <p className="text-xs text-red-500 mt-4 flex items-center gap-1"><Warning size={12} /> {fieldErrors.interests}</p>
              )}
            </div>
          )}

          {/* ── Step 3: Skills ── */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center">
                  <Brain size={26} weight="duotone" className="text-violet-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Your Skills</h2>
                  <p className="text-sm text-slate-500">Select skills you have or are actively developing</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-5">
                <span className="text-xs text-slate-400">
                  Selected: <span className={`font-bold ${form.skills.length >= 3 ? 'text-brand-600' : 'text-red-500'}`}>{form.skills.length}</span> / 3 minimum
                </span>
                {resumeData && form.skills.length > 0 && (
                  <span className="text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full font-semibold">✓ Pre-filled from resume</span>
                )}
              </div>

              <div className="flex flex-wrap gap-2.5">
                {SKILLS.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => { toggleArray('skills', skill); setFieldErrors(e => ({ ...e, skills: '' })); }}
                    className={`px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                      form.skills.includes(skill)
                        ? 'border-violet-400 bg-violet-50 text-violet-700 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:border-violet-300 hover:bg-violet-50/50'
                    }`}
                  >
                    {form.skills.includes(skill) && '✓ '}
                    {skill}
                  </button>
                ))}
              </div>
              {fieldErrors.skills && (
                <p className="text-xs text-red-500 mt-4 flex items-center gap-1"><Warning size={12} /> {fieldErrors.skills}</p>
              )}
            </div>
          )}

          {/* ── Step 4: Review ── */}
          {step === 4 && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                  <Rocket size={26} weight="duotone" className="text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Review & Launch HACSS</h2>
                  <p className="text-sm text-slate-500">Your Hybrid Adaptive Career Simulation is ready to run</p>
                </div>
              </div>

              {/* HACSS Badge */}
              <div className="p-4 bg-gradient-to-r from-brand-600 to-teal-600 rounded-2xl text-white mb-6">
                <div className="flex items-center gap-3">
                  <Sparkle weight="fill" size={24} className="text-white/80" />
                  <div>
                    <p className="font-bold text-sm">HACSS Engine Ready</p>
                    <p className="text-xs text-white/70">Resume profiling + Predictive simulation + Behavioral feedback active</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-5 bg-slate-50 rounded-2xl">
                  <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <GraduationCap size={16} className="text-brand-600" /> Academic Background
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Stream', val: form.stream },
                      { label: 'Class 10', val: form.grade_10 ? `${form.grade_10}%` : '—' },
                      { label: 'Class 12', val: form.grade_12 ? `${form.grade_12}%` : '—' },
                      { label: 'Current', val: form.current_grade ? `${form.current_grade}%` : '—' },
                    ].map(({ label, val }) => (
                      <div key={label} className="text-center p-3 bg-white rounded-xl">
                        <div className="text-xs text-slate-400 mb-1">{label}</div>
                        <div className="font-bold text-slate-800 text-sm">{val}</div>
                      </div>
                    ))}
                  </div>
                  {form.location && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                      <MapPin size={14} className="text-brand-500" />
                      <span className="font-medium">{form.location}</span>
                    </div>
                  )}
                </div>

                {resumeFile && resumeData && (
                  <div className="p-5 bg-brand-50 rounded-2xl border border-brand-100">
                    <h3 className="text-sm font-bold text-brand-700 mb-2 flex items-center gap-2">
                      <File size={16} /> Resume Analysis
                    </h3>
                    <p className="text-xs text-brand-600">{resumeData.summary}</p>
                  </div>
                )}

                <div className="p-5 bg-slate-50 rounded-2xl">
                  <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <Heart size={16} className="text-rose-500" /> Interests ({form.interests.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {form.interests.map(i => (
                      <span key={i} className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg">{i}</span>
                    ))}
                  </div>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl">
                  <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <Brain size={16} className="text-violet-600" /> Skills ({form.skills.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {form.skills.map(s => (
                      <span key={s} className="px-3 py-1 bg-violet-100 text-violet-700 text-xs font-semibold rounded-lg">{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm flex items-center gap-2">
                  <Warning size={16} className="flex-shrink-0" />
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 1}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="text-sm text-slate-400 font-medium">Step {step} of {STEPS.length}</div>

          {step < STEPS.length ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-brand-600 to-teal-600 text-white font-bold rounded-xl shadow-brand hover:shadow-xl active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              Continue
              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-1 group-disabled:translate-x-0">
                <ArrowRight size={16} />
              </span>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-brand-600 to-teal-600 text-white font-bold rounded-xl shadow-brand hover:shadow-xl active:scale-[0.98] transition-all duration-300 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  Run Simulation
                  <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-1">
                    <ArrowRight size={16} />
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
