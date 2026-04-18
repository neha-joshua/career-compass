import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, EnvelopeSimple, GraduationCap, CheckCircle, PencilSimple } from '@phosphor-icons/react';

const STREAMS = ['Science', 'Commerce', 'Arts'];
const EDUCATIONS = ['Class 10', 'Class 11-12', 'Undergraduate', 'Postgraduate', 'Working Professional'];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.profile?.bio || '',
    stream: user?.profile?.stream || '',
    grade_10: user?.profile?.grade_10 || '',
    grade_12: user?.profile?.grade_12 || '',
    current_grade: user?.profile?.current_grade || '',
    current_education: user?.profile?.current_education || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.put('/users/profile', {
        ...form,
        grade_10: parseFloat(form.grade_10) || null,
        grade_12: parseFloat(form.grade_12) || null,
        current_grade: parseFloat(form.current_grade) || null,
      });
      updateUser({ ...user, name: form.name, profile: res.data.user.profile });
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Profile header */}
        <div className="bg-gradient-to-br from-brand-600 to-teal-700 rounded-3xl p-8 text-white mb-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-white/10 border-2 border-white/30 flex items-center justify-center text-3xl font-extrabold">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">{user?.name}</h1>
              <p className="text-brand-200 flex items-center gap-1.5 mt-1">
                <EnvelopeSimple size={16} />
                {user?.email}
              </p>
              <span className="inline-block mt-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold capitalize">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {success && (
          <div className="mb-5 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 font-semibold">
            <CheckCircle weight="fill" size={20} />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 font-medium">
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-8">
          <div className="flex items-center justify-between mb-7">
            <h2 className="text-xl font-bold text-slate-900">Profile Information</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 transition-colors"
              >
                <PencilSimple size={16} />
                Edit Profile
              </button>
            )}
          </div>

          {!editing ? (
            <div className="space-y-5">
              <InfoRow icon={User} label="Full Name" value={user?.name} />
              <InfoRow icon={EnvelopeSimple} label="Email" value={user?.email} />
              <div className="border-t border-slate-100 pt-5">
                <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <GraduationCap size={16} className="text-brand-600" />
                  Academic Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <InfoField label="Stream" value={user?.profile?.stream || '—'} />
                  <InfoField label="Current Education" value={user?.profile?.current_education || '—'} />
                  <InfoField label="Class 10 %" value={user?.profile?.grade_10 ? `${user.profile.grade_10}%` : '—'} />
                  <InfoField label="Class 12 %" value={user?.profile?.grade_12 ? `${user.profile.grade_12}%` : '—'} />
                  <InfoField label="Current Grade %" value={user?.profile?.current_grade ? `${user.profile.current_grade}%` : '—'} />
                </div>
              </div>
              {user?.profile?.bio && (
                <div className="border-t border-slate-100 pt-5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Bio</p>
                  <p className="text-slate-700">{user.profile.bio}</p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  rows={3}
                  placeholder="Tell us about yourself..."
                  className="input-field resize-none"
                />
              </div>

              <div className="border-t border-slate-100 pt-5">
                <h3 className="text-sm font-bold text-slate-700 mb-4">Academic Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Stream</label>
                    <div className="grid grid-cols-3 gap-3">
                      {STREAMS.map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, stream: s }))}
                          className={`py-3 rounded-xl border-2 font-bold text-sm transition-all duration-200 ${
                            form.stream === s ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:border-brand-300'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Current Education Level</label>
                    <select
                      value={form.current_education}
                      onChange={e => setForm(f => ({ ...f, current_education: e.target.value }))}
                      className="input-field"
                    >
                      <option value="">Select level</option>
                      {EDUCATIONS.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { key: 'grade_10', label: 'Class 10 %' },
                      { key: 'grade_12', label: 'Class 12 %' },
                      { key: 'current_grade', label: 'Current Grade %' },
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={form[key]}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                          placeholder="e.g. 85"
                          className="input-field"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary justify-center"
                >
                  {loading ? <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 btn-secondary justify-center"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-soft flex-shrink-0">
        <Icon size={18} className="text-slate-500" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="font-semibold text-slate-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function InfoField({ label, value }) {
  return (
    <div className="p-4 bg-slate-50 rounded-2xl">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="font-bold text-slate-800">{value}</p>
    </div>
  );
}
