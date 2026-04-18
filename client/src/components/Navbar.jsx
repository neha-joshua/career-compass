import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Compass, SquaresFour, Star, Bookmark, User, SignOut,
  List, X, ChartBar, MagnifyingGlass, ShieldCheck, Brain
} from '@phosphor-icons/react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = user ? [
    { to: '/dashboard', label: 'Dashboard', icon: SquaresFour },
    { to: '/assessment', label: 'Assessment', icon: Star },
    { to: '/recommendations', label: 'Recommendations', icon: ChartBar },
    { to: '/explore', label: 'Explore', icon: MagnifyingGlass },
    { to: '/bookmarks', label: 'Saved', icon: Bookmark },
    { to: '/skill-gap', label: 'Skill Gap', icon: Brain },
  ] : [
    { to: '/explore', label: 'Explore Careers', icon: MagnifyingGlass },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen ? 'bg-white/95 backdrop-blur-xl shadow-soft' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center shadow-brand transition-transform duration-300 group-hover:scale-110">
                <Compass weight="fill" className="text-white" size={20} />
              </div>
              <div>
                <span className="font-bold text-lg text-slate-900 leading-none">Career</span>
                <span className="font-bold text-lg text-gradient leading-none">Compass</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive(to)
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {label}
                </Link>
              ))}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive('/admin') ? 'bg-amber-50 text-amber-600' : 'text-slate-600 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  Admin
                </Link>
              )}
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2.5 px-4 py-2 rounded-xl hover:bg-slate-100 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{user.name?.split(' ')[0]}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    <SignOut size={16} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary text-sm py-2.5">
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors relative w-10 h-10 flex items-center justify-center"
            >
              <span className={`absolute transition-all duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0 rotate-90'}`}>
                <X size={22} className="text-slate-700" />
              </span>
              <span className={`absolute transition-all duration-300 ${menuOpen ? 'opacity-0 -rotate-90' : 'opacity-100'}`}>
                <List size={22} className="text-slate-700" />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-white border-t border-slate-100 px-4 py-4 space-y-1">
            {navLinks.map(({ to, label, icon: Icon }, i) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive(to) ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-amber-600 hover:bg-amber-50">
                <ShieldCheck size={18} />
                Admin Panel
              </Link>
            )}
            <div className="pt-3 border-t border-slate-100 mt-3">
              {user ? (
                <div className="space-y-1">
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    {user.name}
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50">
                    <SignOut size={18} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" className="w-full text-center px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50">
                    Sign In
                  </Link>
                  <Link to="/register" className="w-full text-center btn-primary justify-center">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
