import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import CareerCard from '../components/CareerCard';
import ReportTemplate from '../components/ReportTemplate';
import { useAuth } from '../context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  ChartBar, Star, ArrowRight, FunnelSimple, FilePdf, Spinner,
  MapPin, Brain, TrendUp, Sparkle
} from '@phosphor-icons/react';

const FIELDS = ['All', 'Technology', 'Healthcare', 'Engineering', 'Finance', 'Business', 'Creative Arts', 'Media', 'Law', 'Education', 'Architecture', 'Science'];

const LOCATION_INSIGHTS = {
  'Bangalore': { multiplier: 1.35, hub: 'India\'s Silicon Valley – top tech & startup hub', topFields: ['Technology', 'Engineering'] },
  'Mumbai': { multiplier: 1.3, hub: 'Financial & media capital – Finance, Media, Business', topFields: ['Finance', 'Business', 'Media'] },
  'Delhi': { multiplier: 1.25, hub: 'Government, law & corporate hub', topFields: ['Law', 'Business', 'Education'] },
  'Hyderabad': { multiplier: 1.2, hub: 'Rising tech & pharma hub – HITEC City', topFields: ['Technology', 'Healthcare', 'Engineering'] },
  'Pune': { multiplier: 1.18, hub: 'IT, manufacturing & education city', topFields: ['Technology', 'Engineering', 'Education'] },
  'Chennai': { multiplier: 1.15, hub: 'Auto, IT & healthcare hub', topFields: ['Engineering', 'Technology', 'Healthcare'] },
  'Kolkata': { multiplier: 1.0, hub: 'Creative, education & trade hub', topFields: ['Creative Arts', 'Education', 'Business'] },
  'Kochi': { multiplier: 1.05, hub: 'IT & maritime hub', topFields: ['Technology', 'Business'] },
};

const GROWTH_COLOR = { 'Excellent': '#16a34a', 'Good': '#0ea5e9', 'Moderate': '#f59e0b', 'Stable': '#8b5cf6' };

function CustomBarTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 shadow-medium rounded-xl px-4 py-3 text-sm">
      <p className="font-bold text-slate-900">{payload[0]?.payload?.fullName}</p>
      <p className="text-brand-600 font-semibold">{payload[0]?.value}% match</p>
    </div>
  );
}

export default function Recommendations() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [assessment, setAssessment] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showChart, setShowChart] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/recommendations'),
      api.get('/bookmarks'),
      api.get('/assessment/latest').catch(() => ({ data: null })),
    ]).then(([recRes, bookRes, assRes]) => {
      setRecommendations(recRes.data);
      setBookmarkedIds(new Set(bookRes.data.map(b => b.career.id)));
      setAssessment(assRes.data);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All'
    ? recommendations
    : recommendations.filter(r => r.career.field === filter);

  const top8 = recommendations.slice(0, 8).map(r => ({
    name: r.career.name.length > 16 ? r.career.name.slice(0, 14) + '…' : r.career.name,
    fullName: r.career.name,
    score: r.score,
    icon: r.career.icon,
    growth: r.career.growth_outlook,
  }));

  const locationInsight = assessment?.location ? LOCATION_INSIGHTS[assessment.location] : null;

  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');
      const element = document.getElementById('career-report-template');
      if (!element) return;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height);
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width * ratio, canvas.height * ratio);
      pdf.save(`CareerCompass_Report_${user?.name?.replace(/\s+/g, '_') || 'Student'}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Could not generate PDF. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-16">
        <div className="w-12 h-12 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50/30 via-slate-50 to-teal-50/20 pt-16">
      {recommendations.length > 0 && (
        <ReportTemplate id="career-report-template" user={user} recommendations={recommendations} assessment={assessment} />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-100 text-brand-700 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-3">
              <Sparkle weight="fill" size={12} /> Personalized for you
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
              Your Career Recommendations
            </h1>
            <p className="text-slate-500 text-base">
              {recommendations.length > 0
                ? `${recommendations.length} career paths matched and ranked for your profile`
                : 'Complete an assessment to see your personalized recommendations'}
            </p>
          </div>
          {recommendations.length > 0 && (
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                to="/skill-gap"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-50 text-brand-700 font-semibold text-sm rounded-xl border border-brand-200 hover:bg-brand-100 transition-all"
              >
                <Brain size={16} /> Skill Gap Analysis
              </Link>
              <button
                onClick={handleDownloadPDF}
                disabled={pdfLoading}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl hover:border-brand-300 hover:text-brand-700 hover:shadow-soft transition-all disabled:opacity-60"
              >
                {pdfLoading ? <Spinner size={16} className="animate-spin text-brand-500" /> : <FilePdf size={16} className="text-red-500" />}
                {pdfLoading ? 'Generating…' : 'Download PDF'}
              </button>
            </div>
          )}
        </div>

        {recommendations.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-16 text-center">
            <div className="w-20 h-20 bg-brand-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <ChartBar size={40} weight="duotone" className="text-brand-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">No recommendations yet</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Take the career assessment to get 50+ personalized career paths matched to your skills, interests, and academic profile.
            </p>
            <Link to="/assessment" className="btn-primary inline-flex">
              Take Assessment <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <>
            {/* Top match banner */}
            {recommendations[0] && (
              <div className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 to-teal-600 p-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-4xl border border-white/20 flex-shrink-0">
                      {recommendations[0].career.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Star weight="fill" size={16} className="text-amber-300" />
                        <span className="text-white/80 text-sm font-semibold">Best Match</span>
                      </div>
                      <h2 className="text-2xl font-bold text-white">{recommendations[0].career.name}</h2>
                      <p className="text-brand-100 text-sm">{recommendations[0].career.field} · {recommendations[0].career.salary_range}</p>
                      {recommendations[0].gap && (
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs font-semibold text-emerald-300">
                            ✓ {recommendations[0].gap.matchedSkills.length} skills matched
                          </span>
                          {recommendations[0].gap.missingSkills.length > 0 && (
                            <span className="text-xs font-semibold text-white/60">
                              · {recommendations[0].gap.missingSkills.length} to develop
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-5xl font-extrabold text-white">{recommendations[0].score}%</div>
                      <div className="text-brand-200 text-sm font-semibold">Match Score</div>
                    </div>
                    <Link
                      to={`/careers/${recommendations[0].career.id}`}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-white text-brand-700 font-bold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                    >
                      Explore <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Location insight */}
            {locationInsight && (
              <div className="mb-8 p-5 bg-white rounded-2xl border border-slate-100 shadow-soft">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} weight="duotone" className="text-brand-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 text-sm">
                        {assessment.location} Market Insights
                      </h3>
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        +{Math.round((locationInsight.multiplier - 1) * 100)}% salary premium
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-3">{locationInsight.hub}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">Top fields in demand:</span>
                      {locationInsight.topFields.map(f => (
                        <span key={f} className="px-2.5 py-0.5 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full border border-brand-100">{f}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Suitability chart */}
            <div className="mb-8 bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-slate-900 text-base">Career Suitability Chart</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Top 8 careers by match score</p>
                </div>
                <TrendUp size={18} className="text-brand-400" />
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={top8} barCategoryGap="25%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} unit="%" />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {top8.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={GROWTH_COLOR[entry.growth] || '#16a34a'}
                        opacity={i === 0 ? 1 : 0.7}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                {Object.entries(GROWTH_COLOR).map(([label, color]) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: color }} />
                    <span className="text-xs text-slate-400">{label} growth</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Field filter */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
              <FunnelSimple size={18} className="text-slate-400 flex-shrink-0" />
              {FIELDS.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    filter === f
                      ? 'bg-brand-600 text-white shadow-brand'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300 hover:text-brand-600'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500">
                Showing <span className="font-bold text-slate-800">{filtered.length}</span> career{filtered.length !== 1 ? 's' : ''}
                {filter !== 'All' && ` in ${filter}`}
              </p>
            </div>

            {/* Grid */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map(rec => (
                <CareerCard
                  key={rec.id}
                  career={rec.career}
                  score={rec.score}
                  gap={rec.gap}
                  initialBookmarked={bookmarkedIds.has(rec.career.id)}
                  onBookmarkChange={(isNowBookmarked) => {
                    setBookmarkedIds(prev => {
                      const next = new Set(prev);
                      if (isNowBookmarked) next.add(rec.career.id);
                      else next.delete(rec.career.id);
                      return next;
                    });
                  }}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-slate-500 text-lg">No recommendations in the <strong>{filter}</strong> field.</p>
                <button onClick={() => setFilter('All')} className="mt-3 text-brand-600 font-semibold hover:underline">
                  Show all fields
                </button>
              </div>
            )}

            {/* Skill gap CTA */}
            <div className="mt-10 p-6 bg-white rounded-2xl border border-slate-100 shadow-soft flex flex-col sm:flex-row items-center gap-4 justify-between">
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Want to improve your match scores?</h3>
                <p className="text-sm text-slate-500">See exactly which skills to develop and where to learn them.</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Link to="/skill-gap" className="btn-primary text-sm py-2.5">
                  <Brain size={16} /> View Skill Gap
                </Link>
                <Link to="/assessment" className="btn-secondary text-sm py-2.5">
                  Retake Assessment
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
