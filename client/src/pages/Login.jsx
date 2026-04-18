import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, EnvelopeSimple, Lock, Eye, EyeSlash, ArrowRight } from '@phosphor-icons/react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-50/20 to-violet-50/30 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        {/* Card outer shell */}
        <div className="p-1.5 bg-white/50 rounded-[2rem] border border-white ring-1 ring-black/5 shadow-strong">
          {/* Card inner */}
          <div className="bg-white rounded-[calc(2rem-6px)] p-8 shadow-inner-highlight">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center shadow-brand mb-4">
                <Compass weight="fill" className="text-white" size={28} />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">Welcome back</h1>
              <p className="text-slate-500 text-sm mt-1">Sign in to your CareerCompass account</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <EnvelopeSimple size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="input-field pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full group inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-brand-600 to-teal-600 text-white font-bold rounded-xl shadow-brand hover:shadow-xl active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    Sign In
                    <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-200 group-hover:translate-x-1">
                      <ArrowRight size={16} />
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-5 p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-xs font-semibold text-amber-700 mb-1">Demo Credentials</p>
              <p className="text-xs text-amber-600">Admin: admin@careercompass.com / admin123</p>
            </div>

            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
