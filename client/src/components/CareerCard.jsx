import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Bookmark, BookmarkSimple, ArrowRight, TrendUp, CurrencyDollar, Scales } from '@phosphor-icons/react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';

const growthColors = {
  'Excellent': 'bg-emerald-50 text-emerald-700',
  'Good': 'bg-blue-50 text-blue-700',
  'Moderate': 'bg-amber-50 text-amber-700',
  'Stable': 'bg-slate-100 text-slate-600',
};

const fieldColors = {
  'Technology': 'bg-violet-50 text-violet-700',
  'Healthcare': 'bg-rose-50 text-rose-700',
  'Engineering': 'bg-orange-50 text-orange-700',
  'Finance': 'bg-green-50 text-green-700',
  'Business': 'bg-blue-50 text-blue-700',
  'Creative Arts': 'bg-pink-50 text-pink-700',
  'Media': 'bg-amber-50 text-amber-700',
  'Law': 'bg-slate-100 text-slate-700',
  'Education': 'bg-teal-50 text-teal-700',
  'Architecture': 'bg-indigo-50 text-indigo-700',
  'Science': 'bg-cyan-50 text-cyan-700',
};

export default function CareerCard({ career, score, gap, initialBookmarked = false, onBookmarkChange }) {
  const { user } = useAuth();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const inCompare = isInCompare(career.id);

  const toggleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    setBookmarkLoading(true);
    try {
      if (bookmarked) {
        await api.delete(`/bookmarks/${career.id}`);
        setBookmarked(false);
      } else {
        await api.post(`/bookmarks/${career.id}`);
        setBookmarked(true);
      }
      onBookmarkChange?.(!bookmarked);
    } catch (err) {
      console.error('Bookmark error:', err);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const toggleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(career.id);
    } else {
      addToCompare(career);
    }
  };

  const fieldColor = fieldColors[career.field] || 'bg-slate-100 text-slate-700';
  const growthColor = growthColors[career.growth_outlook] || 'bg-slate-100 text-slate-600';

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 shadow-soft hover:shadow-medium transition-all duration-500 hover:-translate-y-1 overflow-hidden">
      {/* Score badge */}
      {score !== undefined && (
        <div className="absolute top-4 right-4 z-10">
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold ${
            score >= 80 ? 'bg-emerald-500 text-white' :
            score >= 60 ? 'bg-brand-500 text-white' :
            score >= 40 ? 'bg-amber-500 text-white' :
            'bg-slate-200 text-slate-700'
          }`}>
            {score}% match
          </div>
        </div>
      )}

      {/* Top gradient bar */}
      <div className="h-1 bg-gradient-to-r from-brand-500 to-teal-500" />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center text-3xl flex-shrink-0 shadow-inner-highlight transition-transform duration-300 group-hover:scale-110">
            {career.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1 truncate">{career.name}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`badge ${fieldColor}`}>{career.field}</span>
              {career.growth_outlook && (
                <span className={`badge ${growthColor}`}>
                  <TrendUp size={10} className="mr-1" />
                  {career.growth_outlook}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {career.description}
        </p>

        {/* Salary */}
        {career.salary_range && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-slate-50 rounded-xl">
            <CurrencyDollar size={16} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">{career.salary_range}</span>
          </div>
        )}

        {/* Gap mini indicator */}
        {gap && (
          <div className="flex items-center gap-3 mb-4 px-3 py-2 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-slate-600">{gap.matchedSkills.length} skills matched</span>
            </div>
            {gap.missingSkills.length > 0 && (
              <>
                <div className="w-px h-3 bg-slate-200" />
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-xs font-semibold text-slate-600">{gap.missingSkills.length} to develop</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Skills preview */}
        {career.related_skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {career.related_skills.slice(0, 3).map(skill => (
              <span key={skill} className="px-2.5 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-lg">
                {skill}
              </span>
            ))}
            {career.related_skills.length > 3 && (
              <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-xs font-semibold rounded-lg">
                +{career.related_skills.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            to={`/careers/${career.id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all duration-200 group/btn"
          >
            View Details
            <ArrowRight size={16} className="transition-transform duration-200 group-hover/btn:translate-x-1" />
          </Link>
          <button
            onClick={toggleCompare}
            title={inCompare ? 'Remove from compare' : 'Add to compare'}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 ${
              inCompare
                ? 'bg-violet-600 text-white'
                : 'bg-slate-100 text-slate-500 hover:bg-violet-50 hover:text-violet-600'
            }`}
          >
            <Scales size={18} />
          </button>
          {user && (
            <button
              onClick={toggleBookmark}
              disabled={bookmarkLoading}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 ${
                bookmarked
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-500 hover:bg-brand-50 hover:text-brand-600'
              }`}
            >
              {bookmarked ? <Bookmark weight="fill" size={18} /> : <BookmarkSimple size={18} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
