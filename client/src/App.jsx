import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CompareProvider, useCompare } from './context/CompareContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import Recommendations from './pages/Recommendations';
import CareerDetail from './pages/CareerDetail';
import Bookmarks from './pages/Bookmarks';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Explore from './pages/Explore';
import Compare from './pages/Compare';
import SkillGap from './pages/SkillGap';
import { ArrowRight, X, Scales } from '@phosphor-icons/react';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
        <p className="text-slate-500 font-medium">Loading CareerCompass...</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-4 border border-white/10">
        <Scales size={20} className="text-brand-400 flex-shrink-0" />
        <div className="flex items-center gap-2">
          {compareList.map(c => (
            <div key={c.id} className="flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-1.5">
              <span className="text-sm">{c.icon}</span>
              <span className="text-xs font-semibold text-white max-w-[80px] truncate">{c.name}</span>
              <button
                onClick={() => removeFromCompare(c.id)}
                className="text-white/50 hover:text-white transition-colors ml-1"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {compareList.length < 3 && (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-dashed border-white/20 text-white/40 text-xs">
              + Add more
            </div>
          )}
        </div>
        <Link
          to="/compare"
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-400 text-white text-sm font-bold rounded-xl transition-colors"
        >
          Compare {compareList.length} <ArrowRight size={14} />
        </Link>
        <button
          onClick={clearCompare}
          className="text-white/40 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
        <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
        <Route path="/careers/:id" element={<CareerDetail />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/skill-gap" element={<ProtectedRoute><SkillGap /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CompareBar />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CompareProvider>
        <AppRoutes />
      </CompareProvider>
    </AuthProvider>
  );
}
