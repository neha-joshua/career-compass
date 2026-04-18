import { useCompare } from '../context/CompareContext';
import { Link } from 'react-router-dom';
import { X, ArrowRight, TrendUp, CurrencyDollar, GraduationCap, Brain, CheckCircle, ArrowLeft } from '@phosphor-icons/react';

const growthRank = { 'Excellent': 4, 'Good': 3, 'Moderate': 2, 'Stable': 1 };
const growthColor = { 'Excellent': 'text-emerald-600', 'Good': 'text-blue-600', 'Moderate': 'text-amber-600', 'Stable': 'text-slate-500' };

export default function Compare() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚖️</div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-3">No careers to compare</h2>
          <p className="text-slate-500 mb-6">Go to Explore or Recommendations and click "Compare" on careers you want to evaluate side-by-side.</p>
          <Link to="/explore" className="btn-primary inline-flex">Explore Careers <ArrowRight size={18} /></Link>
        </div>
      </div>
    );
  }

  const allSkills = [...new Set(compareList.flatMap(c => c.related_skills || []))];

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/explore" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 mb-2 transition-colors">
              <ArrowLeft size={16} /> Back to Explore
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-900">Career Comparison</h1>
            <p className="text-slate-500 mt-1">Comparing {compareList.length} career{compareList.length > 1 ? 's' : ''} side-by-side</p>
          </div>
          <button onClick={clearCompare} className="btn-ghost text-red-500 hover:bg-red-50">
            <X size={18} /> Clear All
          </button>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-100 shadow-soft bg-white">
          <table className="w-full min-w-[640px]">
            {/* Career headers */}
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left p-6 w-40 text-sm font-bold text-slate-400 uppercase tracking-wider">Criteria</th>
                {compareList.map(career => (
                  <th key={career.id} className="p-6 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center text-4xl">
                        {career.icon}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-base">{career.name}</p>
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{career.field}</span>
                      </div>
                      <button
                        onClick={() => removeFromCompare(career.id)}
                        className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                      >
                        <X size={12} /> Remove
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {/* Match Score */}
              {compareList.some(c => c.score !== undefined) && (
                <CompareRow label="Match Score" icon="🎯">
                  {compareList.map(career => {
                    const best = Math.max(...compareList.filter(c => c.score !== undefined).map(c => c.score || 0));
                    return (
                      <td key={career.id} className="p-5 text-center">
                        {career.score !== undefined ? (
                          <div className="flex flex-col items-center gap-2">
                            <span className={`text-2xl font-extrabold ${career.score === best ? 'text-emerald-600' : 'text-slate-700'}`}>
                              {career.score}%
                            </span>
                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${career.score === best ? 'bg-emerald-500' : 'bg-brand-400'}`} style={{ width: `${career.score}%` }} />
                            </div>
                            {career.score === best && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Best Match</span>}
                          </div>
                        ) : <span className="text-slate-300">—</span>}
                      </td>
                    );
                  })}
                </CompareRow>
              )}

              {/* Salary */}
              <CompareRow label="Salary Range" icon="💰">
                {compareList.map(career => (
                  <td key={career.id} className="p-5 text-center">
                    <span className="font-semibold text-slate-700 text-sm">{career.salary_range || '—'}</span>
                  </td>
                ))}
              </CompareRow>

              {/* Growth */}
              <CompareRow label="Growth Outlook" icon="📈">
                {compareList.map(career => {
                  const best = Math.max(...compareList.map(c => growthRank[c.growth_outlook] || 0));
                  const isBest = (growthRank[career.growth_outlook] || 0) === best;
                  return (
                    <td key={career.id} className="p-5 text-center">
                      <span className={`font-bold text-sm ${growthColor[career.growth_outlook] || 'text-slate-500'}`}>
                        <TrendUp size={14} className="inline mr-1" />
                        {career.growth_outlook || '—'}
                        {isBest && compareList.length > 1 && <span className="ml-1 text-xs">⭐</span>}
                      </span>
                    </td>
                  );
                })}
              </CompareRow>

              {/* Min Grade */}
              <CompareRow label="Min. Grade Required" icon="📊">
                {compareList.map(career => {
                  const easiest = Math.min(...compareList.map(c => c.min_grade || 100));
                  return (
                    <td key={career.id} className="p-5 text-center">
                      <span className={`font-bold text-sm px-3 py-1.5 rounded-lg ${career.min_grade === easiest ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                        {career.min_grade || 60}%
                      </span>
                    </td>
                  );
                })}
              </CompareRow>

              {/* Stream */}
              <CompareRow label="Recommended Stream" icon="🎓">
                {compareList.map(career => (
                  <td key={career.id} className="p-5 text-center">
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {(career.required_stream || []).map(s => (
                        <span key={s} className="px-2.5 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-lg">{s}</span>
                      ))}
                    </div>
                  </td>
                ))}
              </CompareRow>

              {/* Skills comparison */}
              <CompareRow label="Key Skills" icon="🧠">
                {compareList.map(career => (
                  <td key={career.id} className="p-5">
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {(career.related_skills || []).slice(0, 4).map(skill => (
                        <span key={skill} className="px-2 py-1 bg-violet-50 text-violet-700 text-xs font-semibold rounded-lg">{skill}</span>
                      ))}
                    </div>
                  </td>
                ))}
              </CompareRow>

              {/* Skills overlap matrix */}
              {allSkills.length > 0 && (
                <tr>
                  <td className="p-5 text-sm font-bold text-slate-500 align-top">
                    <div className="flex items-center gap-2">
                      <Brain size={16} className="text-violet-500" />
                      Skills Breakdown
                    </div>
                  </td>
                  {compareList.map(career => (
                    <td key={career.id} className="p-5">
                      <div className="space-y-1.5">
                        {allSkills.map(skill => {
                          const has = (career.related_skills || []).includes(skill);
                          return (
                            <div key={skill} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold ${has ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-400'}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${has ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                              {skill}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  ))}
                </tr>
              )}

              {/* View Detail CTA */}
              <tr>
                <td className="p-5" />
                {compareList.map(career => (
                  <td key={career.id} className="p-5 text-center">
                    <Link
                      to={`/careers/${career.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-bold rounded-xl hover:bg-brand-700 active:scale-95 transition-all duration-200"
                    >
                      Full Details <ArrowRight size={16} />
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-center text-sm text-slate-400 mt-6">
          Add up to 3 careers to compare. Go to{' '}
          <Link to="/explore" className="text-brand-600 font-semibold hover:underline">Explore</Link> to add more.
        </p>
      </div>
    </div>
  );
}

function CompareRow({ label, icon, children }) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="p-5 text-sm font-bold text-slate-600 align-middle">
        <span className="mr-1.5">{icon}</span> {label}
      </td>
      {children}
    </tr>
  );
}
