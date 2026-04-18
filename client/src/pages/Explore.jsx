import { useState, useEffect } from 'react';
import api from '../services/api';
import CareerCard from '../components/CareerCard';
import { useAuth } from '../context/AuthContext';
import { MagnifyingGlass, FunnelSimple } from '@phosphor-icons/react';

const FIELDS = ['All', 'Technology', 'Healthcare', 'Engineering', 'Finance', 'Business', 'Creative Arts', 'Media', 'Law', 'Education', 'Architecture', 'Science'];

export default function Explore() {
  const { user } = useAuth();
  const [careers, setCareers] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [field, setField] = useState('All');

  useEffect(() => {
    api.get('/careers').then(res => setCareers(res.data)).catch(console.error);

    if (user) {
      api.get('/bookmarks').then(res => {
        setBookmarkedIds(new Set(res.data.map(b => b.career.id)));
      }).catch(console.error);
    }

    setLoading(false);
  }, [user]);

  const filtered = careers.filter(c => {
    const matchField = field === 'All' || c.field === field;
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()) || c.field.toLowerCase().includes(search.toLowerCase());
    return matchField && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm font-semibold mb-4">
            Explore All Careers
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Find Your Path</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">
            Browse through {careers.length} career paths across industries to discover what excites you
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search careers, fields, skills..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-brand-400 focus:bg-white/15 transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Field filter */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          <FunnelSimple size={18} className="text-slate-400 flex-shrink-0" />
          {FIELDS.map(f => (
            <button
              key={f}
              onClick={() => setField(f)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                field === f
                  ? 'bg-brand-600 text-white shadow-brand'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300 hover:text-brand-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{filtered.length}</span> career{filtered.length !== 1 ? 's' : ''}
            {field !== 'All' && <> in <span className="text-brand-600 font-bold">{field}</span></>}
            {search && <> for "<span className="text-brand-600 font-bold">{search}</span>"</>}
          </p>
          {(search || field !== 'All') && (
            <button
              onClick={() => { setSearch(''); setField('All'); }}
              className="text-sm font-semibold text-slate-400 hover:text-slate-700 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-xl font-medium">No careers found.</p>
            <button
              onClick={() => { setSearch(''); setField('All'); }}
              className="mt-3 text-brand-600 font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(career => (
              <CareerCard
                key={career.id}
                career={career}
                initialBookmarked={bookmarkedIds.has(career.id)}
                onBookmarkChange={(isNow) => {
                  setBookmarkedIds(prev => {
                    const next = new Set(prev);
                    if (isNow) next.add(career.id);
                    else next.delete(career.id);
                    return next;
                  });
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
