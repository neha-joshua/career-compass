import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import {
  ArrowLeft, Bookmark, BookmarkSimple, TrendUp, CurrencyDollar,
  GraduationCap, Heart, Brain, BookOpen, ArrowSquareOut, CheckCircle,
  X, PlusCircle, ArrowsLeftRight, Exam
} from '@phosphor-icons/react';
import { getExamsForCareer, difficultyConfig, getCalendarUrl, getDaysUntil } from '../data/examMapper';
import ShadowSimulation from '../components/ShadowSimulation';

export default function CareerDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const [career, setCareer] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [userSkills, setUserSkills] = useState([]);
  const [compareAdded, setCompareAdded] = useState(false);

  useEffect(() => {
    const requests = [
      api.get(`/careers/${id}`),
      user ? api.get(`/bookmarks/check/${id}`) : Promise.resolve({ data: { bookmarked: false } }),
      user ? api.get('/assessment/latest').catch(() => null) : Promise.resolve(null),
    ];

    Promise.all(requests).then(([careerRes, bRes, assessRes]) => {
      setCareer(careerRes.data);
      setBookmarked(bRes.data.bookmarked);
      if (assessRes?.data?.skills) setUserSkills(assessRes.data.skills);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id, user]);

  const toggleBookmark = async () => {
    if (!user) return;
    setBookmarkLoading(true);
    try {
      if (bookmarked) {
        await api.delete(`/bookmarks/${id}`);
        setBookmarked(false);
      } else {
        await api.post(`/bookmarks/${id}`);
        setBookmarked(true);
      }
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleCompare = () => {
    if (isInCompare(career.id)) {
      removeFromCompare(career.id);
      setCompareAdded(false);
    } else {
      addToCompare({ ...career, score: undefined });
      setCompareAdded(true);
      setTimeout(() => setCompareAdded(false), 2000);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-16">
      <div className="w-12 h-12 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
    </div>
  );

  if (!career) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-16">
      <div className="text-center">
        <p className="text-2xl font-bold text-slate-900 mb-3">Career not found</p>
        <Link to="/explore" className="btn-primary inline-flex">Back to Explore</Link>
      </div>
    </div>
  );

  const growthColor = {
    'Excellent': 'text-emerald-700 bg-emerald-50 border-emerald-200',
    'Good': 'text-blue-700 bg-blue-50 border-blue-200',
    'Moderate': 'text-amber-700 bg-amber-50 border-amber-200',
    'Stable': 'text-slate-600 bg-slate-50 border-slate-200',
  }[career.growth_outlook] || 'text-slate-600 bg-slate-50 border-slate-200';

  const exams = getExamsForCareer(career.name);

  // Skills Gap Analysis
  const matchedSkills = career.related_skills?.filter(s => userSkills.includes(s)) || [];
  const missingSkills = career.related_skills?.filter(s => !userSkills.includes(s)) || [];
  const hasAssessment = userSkills.length > 0;

  const inCompare = isInCompare(career.id);

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-600 to-teal-700 text-white">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <Link to="/explore" className="inline-flex items-center gap-2 text-brand-200 hover:text-white mb-8 transition-colors font-semibold text-sm">
            <ArrowLeft size={18} /> Back to Explore
          </Link>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center text-5xl">
                {career.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm font-semibold">{career.field}</span>
                  <span className={`px-3 py-1 rounded-full border text-xs font-bold ${growthColor}`}>
                    <TrendUp size={11} className="inline mr-1" />{career.growth_outlook} Growth
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold">{career.name}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCompare}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold border-2 text-sm transition-all duration-200 active:scale-95 ${
                  inCompare ? 'bg-white text-violet-700 border-white' : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
                }`}
              >
                <ArrowsLeftRight size={18} />
                {inCompare ? 'In Compare' : 'Compare'}
              </button>
              {user && (
                <button
                  onClick={toggleBookmark}
                  disabled={bookmarkLoading}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold border-2 text-sm transition-all duration-200 active:scale-95 ${
                    bookmarked ? 'bg-white text-brand-700 border-white' : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
                  }`}
                >
                  {bookmarked ? <Bookmark weight="fill" size={18} /> : <BookmarkSimple size={18} />}
                  {bookmarked ? 'Saved' : 'Save'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {compareAdded && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-violet-600 text-white px-6 py-3 rounded-2xl shadow-strong font-semibold flex items-center gap-2 animate-fade-up">
          <CheckCircle weight="fill" size={20} />
          Added to compare!
          <Link to="/compare" className="underline ml-1">View →</Link>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">About This Career</h2>
              <p className="text-slate-600 leading-relaxed text-base">{career.description}</p>
            </div>

            {/* Skills Gap Analysis — only if user has taken assessment */}
            {hasAssessment && career.related_skills?.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                    <Brain size={22} weight="duotone" className="text-brand-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Your Skills Gap Analysis</h2>
                    <p className="text-sm text-slate-500">Based on your latest assessment</p>
                  </div>
                </div>

                {/* Gap score bar */}
                <div className="my-5 p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-600">Skills Match</span>
                    <span className="text-sm font-extrabold text-brand-600">{matchedSkills.length}/{career.related_skills.length} skills</span>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 rounded-full transition-all duration-700"
                      style={{ width: `${career.related_skills.length > 0 ? (matchedSkills.length / career.related_skills.length) * 100 : 0}%` }}
                    />
                  </div>
                  {missingSkills.length > 0 && (
                    <p className="text-xs text-slate-500 mt-2">
                      💡 Develop <strong>{missingSkills.length} more skill{missingSkills.length > 1 ? 's' : ''}</strong> to significantly improve your match score
                    </p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* You have */}
                  <div>
                    <p className="text-sm font-bold text-emerald-700 mb-2 flex items-center gap-1.5">
                      <CheckCircle weight="fill" size={16} /> You Have ({matchedSkills.length})
                    </p>
                    <div className="space-y-2">
                      {matchedSkills.length > 0 ? matchedSkills.map(s => (
                        <div key={s} className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-sm font-semibold text-emerald-800">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          {s}
                        </div>
                      )) : (
                        <p className="text-sm text-slate-400 italic">No matching skills yet</p>
                      )}
                    </div>
                  </div>
                  {/* Missing */}
                  <div>
                    <p className="text-sm font-bold text-red-600 mb-2 flex items-center gap-1.5">
                      <X size={16} /> Need to Develop ({missingSkills.length})
                    </p>
                    <div className="space-y-2">
                      {missingSkills.length > 0 ? missingSkills.map(s => (
                        <div key={s} className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-xl text-sm font-semibold text-red-700">
                          <div className="w-2 h-2 rounded-full bg-red-400" />
                          {s}
                        </div>
                      )) : (
                        <p className="text-sm text-emerald-600 font-bold">🎉 You have all required skills!</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Entrance Exams */}
            {exams.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-xl">🎓</div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Entrance Exams to Crack</h2>
                    <p className="text-sm text-slate-500">Indian competitive exams for this career path</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {exams.map((exam, i) => {
                    const cfg = difficultyConfig[exam.difficulty] || difficultyConfig['Moderate'];
                    const daysLeft = getDaysUntil(exam.nextDate);
                    const calUrl = getCalendarUrl(exam);
                    const urgency =
                      daysLeft !== null && daysLeft <= 30 ? 'bg-red-50 text-red-700 border-red-200' :
                      daysLeft !== null && daysLeft <= 90 ? 'bg-orange-50 text-orange-700 border-orange-200' :
                      'bg-emerald-50 text-emerald-700 border-emerald-200';
                    return (
                      <div
                        key={i}
                        className="p-4 bg-slate-50 rounded-2xl border border-transparent hover:bg-amber-50 hover:border-amber-200 transition-all duration-200 group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center font-extrabold text-amber-700 text-sm flex-shrink-0">
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <a
                                href={exam.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-slate-900 group-hover:text-amber-800 transition-colors hover:underline inline-flex items-center gap-1"
                              >
                                {exam.name}
                                <ArrowSquareOut size={13} className="text-slate-300 group-hover:text-amber-500 flex-shrink-0" />
                              </a>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${cfg.color}`}>
                                <span className={`inline-block w-1.5 h-1.5 rounded-full ${cfg.dot} mr-1`} />
                                {exam.difficulty}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mb-1">Conducted by: <strong>{exam.conducted}</strong></p>
                            <p className="text-sm text-slate-600 mb-2">💡 {exam.tip}</p>

                            {/* Countdown + Calendar */}
                            {daysLeft !== null && (
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${urgency}`}>
                                  🗓 {daysLeft <= 0 ? 'Exam passed — check for next date' : daysLeft === 1 ? 'Tomorrow!' : `${daysLeft} days away`}
                                </span>
                                {calUrl && daysLeft > 0 && (
                                  <a
                                    href={calUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                                    onClick={e => e.stopPropagation()}
                                  >
                                    <span>📅</span> Add to Google Calendar
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Shadow a Professional Simulation */}
            <ShadowSimulation careerName={career.name} />

            {/* Related Interests */}
            {career.related_interests?.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
                    <Heart size={22} weight="duotone" className="text-rose-500" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Related Interests</h2>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {career.related_interests.map(interest => (
                    <span key={interest} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 text-sm font-semibold rounded-xl">
                      <CheckCircle weight="fill" size={14} />{interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* All Required Skills */}
            {career.related_skills?.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
                    <Brain size={22} weight="duotone" className="text-violet-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Key Skills Required</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {career.related_skills.map(skill => {
                    const userHas = userSkills.includes(skill);
                    return (
                      <div key={skill} className={`flex items-center gap-3 p-3 rounded-xl border ${userHas && hasAssessment ? 'bg-emerald-50 border-emerald-100' : 'bg-violet-50 border-violet-50'}`}>
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${userHas && hasAssessment ? 'bg-emerald-500' : 'bg-violet-400'}`} />
                        <span className={`text-sm font-semibold ${userHas && hasAssessment ? 'text-emerald-800' : 'text-violet-800'}`}>{skill}</span>
                        {userHas && hasAssessment && <CheckCircle weight="fill" size={14} className="text-emerald-500 ml-auto" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Learning Resources */}
            {career.resources?.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <BookOpen size={22} weight="duotone" className="text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Learning Resources</h2>
                </div>
                <div className="space-y-3">
                  {career.resources.map((resource, i) => (
                    <a key={i} href={resource.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-all duration-200 group">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center font-bold text-emerald-700 flex-shrink-0">{i + 1}</div>
                      <span className="flex-1 font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">{resource.title}</span>
                      <ArrowSquareOut size={18} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <CurrencyDollar size={22} weight="duotone" className="text-green-600" />
                </div>
                <h3 className="font-bold text-slate-900">Salary Range</h3>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{career.salary_range || 'Varies'}</p>
              <p className="text-xs text-slate-400 mt-1">Annual compensation in India</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                  <TrendUp size={22} weight="duotone" className="text-brand-600" />
                </div>
                <h3 className="font-bold text-slate-900">Growth Outlook</h3>
              </div>
              <span className={`inline-block px-4 py-2 rounded-xl border text-sm font-bold ${growthColor}`}>{career.growth_outlook}</span>
              <p className="text-xs text-slate-400 mt-3">Based on current industry demand</p>
            </div>

            {career.required_stream?.length > 0 && !career.required_stream.includes('Any') && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                    <GraduationCap size={22} weight="duotone" className="text-brand-600" />
                  </div>
                  <h3 className="font-bold text-slate-900">Recommended Stream</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {career.required_stream.map(s => (
                    <span key={s} className="px-3 py-1.5 bg-brand-50 text-brand-700 font-bold text-sm rounded-xl border border-brand-100">{s}</span>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-2">Min grade: <strong>{career.min_grade}%</strong></p>
              </div>
            )}

            {/* Compare CTA */}
            <button
              onClick={handleCompare}
              className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold border-2 transition-all duration-200 active:scale-95 text-sm ${
                inCompare
                  ? 'border-violet-400 bg-violet-50 text-violet-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:text-violet-600'
              }`}
            >
              <ArrowsLeftRight size={18} />
              {inCompare ? 'Remove from Compare' : 'Add to Compare'}
            </button>

            {!user ? (
              <div className="bg-gradient-to-br from-brand-600 to-teal-600 rounded-3xl p-6 text-white text-center">
                <h3 className="font-bold text-lg mb-2">See your match score</h3>
                <p className="text-brand-200 text-sm mb-4">Create an account and take our assessment</p>
                <Link to="/register" className="w-full block bg-white text-brand-700 font-bold py-3 rounded-2xl hover:shadow-lg transition-all text-sm">
                  Get Started Free
                </Link>
              </div>
            ) : (
              <Link to="/assessment" className="block bg-gradient-to-br from-brand-600 to-teal-600 rounded-3xl p-6 text-white text-center hover:shadow-brand transition-all duration-300 hover:-translate-y-0.5">
                <h3 className="font-bold text-lg mb-1">Check Your Match</h3>
                <p className="text-brand-200 text-sm">Retake assessment for updated scores</p>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
