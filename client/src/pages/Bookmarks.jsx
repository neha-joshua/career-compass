import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import CareerCard from '../components/CareerCard';
import { Bookmark, ArrowRight } from '@phosphor-icons/react';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookmarks')
      .then(res => setBookmarks(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleBookmarkChange = (careerId, isNow) => {
    if (!isNow) {
      setBookmarks(prev => prev.filter(b => b.career.id !== careerId));
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
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center">
            <Bookmark size={26} weight="duotone" className="text-brand-600" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Saved Careers</h1>
            <p className="text-slate-500">{bookmarks.length} career{bookmarks.length !== 1 ? 's' : ''} saved</p>
          </div>
        </div>

        {bookmarks.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-16 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Bookmark size={40} weight="duotone" className="text-slate-400" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-3">No saved careers yet</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Browse careers and click the bookmark icon to save ones you're interested in exploring further.
            </p>
            <Link to="/explore" className="btn-primary inline-flex">
              Explore Careers
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookmarks.map(b => (
              <CareerCard
                key={b.id}
                career={b.career}
                initialBookmarked={true}
                onBookmarkChange={(isNow) => handleBookmarkChange(b.career.id, isNow)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
