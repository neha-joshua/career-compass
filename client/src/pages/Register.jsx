import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, User, EnvelopeSimple, Lock, Eye, EyeSlash, ArrowRight, CheckCircle } from '@phosphor-icons/react';

const perks = [
  'Free personalized career assessment',
  'Recommendations based on your profile',
  'Save and bookmark favorite careers',
  'Access to learning resources',
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      return setError('Passwords do not match');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/assessment');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-50/20 to-violet-50/30 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left panel */}
        <div className="hidden md:block">
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center shadow-brand">
              <Compass weight="fill" className="text-white" size={22} />
            </div>
            <div>
              <span className="font-bold text-xl text-slate-900">Career</span>
              <span className="font-bold text-xl text-gradient">Compass</span>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
            Start your career journey{' '}
            <span className="text-gradient">today</span>
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed mb-8">
            Create your free account and get personalized career recommendations in minutes.
          </p>
          <div className="space-y-4">
            {perks.map(perk => (
              <div key={perk} className="flex items-center gap-3">
                <CheckCircle weight="fill" size={22} className="text-emerald-500 flex-shrink-0" />
                <span className="text-slate-700 font-medium">{perk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form card */}
        <div className="p-1.5 bg-white/50 rounded-[2rem] border border-white ring-1 ring-black/5 shadow-strong">
          <div className="bg-white rounded-[calc(2rem-6px)] p-8 shadow-inner-highlight">
            <div className="mb-7">
              <h1 className="text-2xl font-extrabold text-slate-900">Create account</h1>
              <p className="text-slate-500 text-sm mt-1">Free forever. No credit card required.</p>
            </div>

            {error && (
              <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

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
                    placeholder="Min. 6 characters"
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

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repeat password"
                    value={form.confirm}
                    onChange={e => setForm({ ...form, confirm: e.target.value })}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full group inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-brand-600 to-teal-600 text-white font-bold rounded-xl shadow-brand hover:shadow-xl active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    Create Account
                    <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-200 group-hover:translate-x-1">
                      <ArrowRight size={16} />
                    </span>
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
