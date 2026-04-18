import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Star, ChartBar, Bookmark, ArrowRight, CheckCircle,
  ClipboardText, TrendUp, Clock, Sparkle, ChartLine
} from '@phosphor-icons/react';

function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-soft">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>
          <Icon size={24} weight="duotone" className={color} />
        </div>
      </div>
      <div className="text-3xl font-extrabold text-slate-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-slate-500">{label}</div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 shadow-medium rounded-xl px-4 py-3 text-sm">
      <p className="font-bold text-slate-800">{payload[0].value}% match</p>
      <p className="text-slate-400 text-xs mt-0.5">{label}</p>
      {payload[0].payload.top_career && (
        <p className="text-brand-600 text-xs font-semibold mt-1">
          {payload[0].payload.career_icon} {payload[0].payload.top_career}
        </p>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [hasAssessment, setHasAssessment] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/recommendations').catch(() => ({ data: [] })),
      api.get('/bookmarks').catch(() => ({ data: [] })),
      api.get('/assessment/latest').catch(() => null),
      api.get('/assessment/history').catch(() => ({ data: [] })),
    ]).then(([recRes, bookRes, assRes, histRes]) => {
      setRecommendations(recRes.data || []);
      setBookmarks(bookRes.data || []);
      setHasAssessment(!!assRes);
      setHistory(histRes.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const topRec = recommendations[0];
  const firstName = user?.name?.split(' ')[0] || 'there';

  // Format history for chart
  const chartData = history.map((h, i) => ({
    name: `Assessment ${i + 1}`,
    score: h.top_score,
    top_career: h.top_career,
    career_icon: h.top5?.[0]?.icon || '',
    date: new Date(h.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
  }));

  // Score delta between last two assessments
  const scoreDelta = history.length >= 2
    ? history[history.length - 1].top_score - history[history.length - 2].top_score
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-16">
        <div className="w-12 h-12 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkle weight="fill" size={20} className="text-amber-400" />
            <span className="text-sm font-semibold text-slate-500">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Good {getGreeting()},{' '}
            <span className="text-gradient">{firstName}!</span>
          </h1>
          <p className="text-slate-500 mt-1 text-lg">Here's your career exploration overview</p>
        </div>

        {/* Assessment prompt */}
        {!hasAssessment && (
          <div className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 to-teal-600 p-8 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-extrabold mb-2">Take Your Career Assessment</h2>
                <p className="text-brand-200 text-base">
                  Answer a few questions about your interests and skills to get personalized career recommendations.
                </p>
              </div>
              <Link
                to="/assessment"
                className="group flex-shrink-0 inline-flex items-center gap-3 px-6 py-3 bg-white text-brand-700 font-bold rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                Start Now
                <span className="w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center transition-transform group-hover:translate-x-1">
                  <ArrowRight size={16} className="text-brand-600" />
                </span>
              </Link>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard
            icon={ChartBar}
            label="Career Recommendations"
            value={recommendations.length}
            color="text-brand-600"
            bg="bg-brand-50"
          />
          <StatCard
            icon={Bookmark}
            label="Saved Careers"
            value={bookmarks.length}
            color="text-violet-600"
            bg="bg-violet-50"
          />
          <StatCard
            icon={ClipboardText}
            label="Assessments Taken"
            value={history.length || (hasAssessment ? 1 : 0)}
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
          <StatCard
            icon={Star}
            label="Top Match Score"
            value={recommendations.length > 0 ? `${recommendations[0].score}%` : '—'}
            color="text-amber-500"
            bg="bg-amber-50"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Top Recommendations */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-slate-900">Top Career Matches</h2>
                {recommendations.length > 0 && (
                  <Link to="/recommendations" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                    View all <ArrowRight size={14} />
                  </Link>
                )}
              </div>

              {recommendations.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ChartBar size={32} weight="duotone" className="text-slate-400" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">No recommendations yet</h3>
                  <p className="text-slate-500 mb-6">Complete your assessment to get personalized career suggestions.</p>
                  <Link to="/assessment" className="btn-primary inline-flex">
                    Take Assessment
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendations.slice(0, 4).map((rec, i) => (
                    <Link key={rec.id} to={`/careers/${rec.career.id}`}>
                      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5 hover:shadow-medium transition-all duration-300 hover:-translate-y-0.5 group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl flex-shrink-0">
                            {rec.career.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="font-bold text-slate-900 mb-0.5">{rec.career.name}</h3>
                                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                  {rec.career.field}
                                </span>
                              </div>
                              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold flex-shrink-0 ${
                                rec.score >= 80 ? 'bg-emerald-50 text-emerald-700' :
                                rec.score >= 60 ? 'bg-brand-50 text-brand-700' :
                                'bg-amber-50 text-amber-700'
                              }`}>
                                <TrendUp size={14} />
                                {rec.score}%
                              </div>
                            </div>
                            {/* Score bar */}
                            <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                  rec.score >= 80 ? 'bg-emerald-500' :
                                  rec.score >= 60 ? 'bg-brand-500' : 'bg-amber-500'
                                }`}
                                style={{ width: `${rec.score}%` }}
                              />
                            </div>
                          </div>
                          <ArrowRight size={18} className="text-slate-300 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-brand-500" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Progress Tracker */}
            {chartData.length >= 1 && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <ChartLine size={20} className="text-brand-500" />
                      <h2 className="text-xl font-bold text-slate-900">Progress Tracker</h2>
                    </div>
                    <p className="text-slate-500 text-sm">Top career match score across your assessments</p>
                  </div>
                  {scoreDelta !== null && (
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold ${
                      scoreDelta > 0 ? 'bg-emerald-50 text-emerald-700' :
                      scoreDelta < 0 ? 'bg-red-50 text-red-600' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {scoreDelta > 0 ? '↑' : scoreDelta < 0 ? '↓' : '→'}
                      {Math.abs(scoreDelta)}% since last
                    </div>
                  )}
                </div>

                {chartData.length === 1 ? (
                  <div className="text-center py-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 rounded-xl text-sm font-semibold mb-2">
                      <Star weight="fill" size={16} className="text-amber-400" />
                      Current top match: {chartData[0].score}% — {chartData[0].top_career}
                    </div>
                    <p className="text-slate-400 text-sm mt-2">Take another assessment to track your progress over time.</p>
                    <Link to="/assessment" className="inline-flex items-center gap-1.5 mt-3 text-brand-600 font-semibold text-sm hover:underline">
                      Retake Assessment <ArrowRight size={14} />
                    </Link>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#16a34a"
                        strokeWidth={2.5}
                        dot={{ fill: '#16a34a', r: 5, strokeWidth: 0 }}
                        activeDot={{ r: 7, fill: '#16a34a' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}

                {/* Top 5 careers from latest assessment */}
                {history.length > 0 && history[history.length - 1].top5 && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Latest Top 5</p>
                    <div className="flex flex-wrap gap-2">
                      {history[history.length - 1].top5.map((c, i) => (
                        <div key={c.career_id} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700">
                          <span className="text-base">{c.icon}</span>
                          <span>{c.name}</span>
                          <span className={`font-bold ${
                            i === 0 ? 'text-emerald-600' : 'text-slate-400'
                          }`}>{c.score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Quick actions */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
              <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link to="/assessment" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-brand-50 transition-colors group">
                  <div className="w-9 h-9 bg-brand-100 rounded-xl flex items-center justify-center">
                    <Star size={18} className="text-brand-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-brand-600 transition-colors">
                    {hasAssessment ? 'Redo Assessment' : 'Take Assessment'}
                  </span>
                  <ArrowRight size={16} className="ml-auto text-slate-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                </Link>
                <Link to="/recommendations" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-violet-50 transition-colors group">
                  <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
                    <ChartBar size={18} className="text-violet-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-violet-600 transition-colors">View Recommendations</span>
                  <ArrowRight size={16} className="ml-auto text-slate-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
                </Link>
                <Link to="/explore" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 transition-colors group">
                  <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <ClipboardText size={18} className="text-emerald-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors">Explore All Careers</span>
                  <ArrowRight size={16} className="ml-auto text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </Link>
                <Link to="/bookmarks" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-amber-50 transition-colors group">
                  <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Bookmark size={18} className="text-amber-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-amber-600 transition-colors">Saved Careers</span>
                  <ArrowRight size={16} className="ml-auto text-slate-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                </Link>
                <Link to="/compare" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
                    <span className="text-base">⚖️</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Compare Careers</span>
                  <ArrowRight size={16} className="ml-auto text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </div>

            {/* Bookmarks preview */}
            {bookmarks.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900">Recently Saved</h3>
                  <Link to="/bookmarks" className="text-xs font-semibold text-brand-600">View all</Link>
                </div>
                <div className="space-y-3">
                  {bookmarks.slice(0, 3).map(b => (
                    <Link key={b.id} to={`/careers/${b.career.id}`} className="flex items-center gap-3 group">
                      <span className="text-xl">{b.career.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-brand-600 transition-colors">{b.career.name}</p>
                        <p className="text-xs text-slate-400">{b.career.field}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
