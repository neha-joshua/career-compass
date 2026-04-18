import { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Users, Briefcase, ChartBar, Bookmark, TrendUp,
  Plus, Trash, PencilSimple, X, CheckCircle,
  UserCircle, ShieldCheck, Star
} from '@phosphor-icons/react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const TABS = [
  { id: 'overview', label: 'Overview', icon: ChartBar },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'careers', label: 'Careers', icon: Briefcase },
];

const FIELD_COLORS = ['#4f46e5', '#7c3aed', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];

export default function Admin() {
  const [tab, setTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCareerModal, setShowCareerModal] = useState(false);
  const [editingCareer, setEditingCareer] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [aRes, uRes, cRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/users'),
        api.get('/admin/careers'),
      ]);
      setAnalytics(aRes.data);
      setUsers(uRes.data);
      setCareers(cRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    await api.delete(`/admin/users/${id}`);
    setUsers(prev => prev.filter(u => u.id !== id));
    showToast('User deleted');
  };

  const deleteCareer = async (id) => {
    if (!confirm('Delete this career?')) return;
    await api.delete(`/admin/careers/${id}`);
    setCareers(prev => prev.filter(c => c.id !== id));
    showToast('Career deleted');
    loadData();
  };

  const openEdit = (career) => {
    setEditingCareer(career);
    setShowCareerModal(true);
  };

  const openAdd = () => {
    setEditingCareer(null);
    setShowCareerModal(true);
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
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-5 z-50 flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-2xl shadow-strong animate-fade-in">
          <CheckCircle weight="fill" size={18} />
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-10">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center">
              <ShieldCheck size={26} weight="duotone" className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">Admin Panel</h1>
              <p className="text-slate-400 text-sm">CareerCompass Management Dashboard</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white rounded-2xl p-1.5 shadow-soft border border-slate-100 w-fit">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                tab === id ? 'bg-brand-600 text-white shadow-brand' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && analytics && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {[
                { label: 'Total Students', value: analytics.stats.total_users, icon: Users, color: 'text-brand-600', bg: 'bg-brand-50' },
                { label: 'Career Paths', value: analytics.stats.total_careers, icon: Briefcase, color: 'text-violet-600', bg: 'bg-violet-50' },
                { label: 'Assessments', value: analytics.stats.total_assessments, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
                { label: 'Recommendations', value: analytics.stats.total_recommendations, icon: ChartBar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Bookmarks', value: analytics.stats.total_bookmarks, icon: Bookmark, color: 'text-rose-500', bg: 'bg-rose-50' },
                { label: 'New This Week', value: analytics.stats.recent_users, icon: TrendUp, color: 'text-cyan-600', bg: 'bg-cyan-50' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-soft">
                  <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon size={20} weight="duotone" className={color} />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">{value}</div>
                  <div className="text-xs font-semibold text-slate-400 mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Field distribution pie */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6">
                <h3 className="font-bold text-slate-900 mb-6">Careers by Field</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={analytics.fieldDistribution}
                      dataKey="count"
                      nameKey="field"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={45}
                    >
                      {analytics.fieldDistribution.map((_, i) => (
                        <Cell key={i} fill={FIELD_COLORS[i % FIELD_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v, n) => [v, n]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 mt-4">
                  {analytics.fieldDistribution.map((d, i) => (
                    <div key={d.field} className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: FIELD_COLORS[i % FIELD_COLORS.length] }} />
                      {d.field} ({d.count})
                    </div>
                  ))}
                </div>
              </div>

              {/* Top careers bar */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6">
                <h3 className="font-bold text-slate-900 mb-6">Top Recommended Careers</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analytics.topCareers} layout="vertical" margin={{ left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="rec_count" fill="#4f46e5" radius={[0, 4, 4, 0]} name="Recommendations" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top bookmarked */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6">
              <h3 className="font-bold text-slate-900 mb-5">Most Bookmarked Careers</h3>
              <div className="space-y-3">
                {analytics.topBookmarked.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl">
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-extrabold text-sm">
                      {i + 1}
                    </div>
                    <span className="text-xl">{c.icon}</span>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 text-sm">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.field}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-brand-600">
                      <Bookmark weight="fill" size={14} />
                      {c.bookmark_count}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">All Students ({users.filter(u => u.role === 'student').length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Stream</th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Assessments</th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Bookmarks</th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.filter(u => u.role === 'student').map(u => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-teal-400 flex items-center justify-center text-white font-bold text-sm">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{u.name}</p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${u.stream ? 'bg-brand-50 text-brand-700' : 'text-slate-400'}`}>
                          {u.stream || 'Not set'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-700">{u.assessment_count}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-700">{u.bookmark_count}</td>
                      <td className="px-6 py-4 text-xs text-slate-400">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                        >
                          <Trash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.filter(u => u.role === 'student').length === 0 && (
                <div className="text-center py-16 text-slate-400 font-medium">No students registered yet</div>
              )}
            </div>
          </div>
        )}

        {/* Careers */}
        {tab === 'careers' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-900">All Career Paths ({careers.length})</h2>
              <button
                onClick={openAdd}
                className="btn-primary text-sm py-2.5"
              >
                <Plus size={18} />
                Add Career
              </button>
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Career</th>
                      <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Field</th>
                      <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Min Grade</th>
                      <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Recs</th>
                      <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Bookmarks</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {careers.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{c.icon}</span>
                            <div>
                              <p className="font-semibold text-slate-900 text-sm">{c.name}</p>
                              <p className="text-xs text-slate-400">{c.salary_range}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-lg">{c.field}</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-700">{c.min_grade}%</td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-700">{c.rec_count}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-700">{c.bookmark_count}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEdit(c)}
                              className="p-2 rounded-xl text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-all duration-200"
                            >
                              <PencilSimple size={16} />
                            </button>
                            <button
                              onClick={() => deleteCareer(c.id)}
                              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Career Modal */}
      {showCareerModal && (
        <CareerModal
          career={editingCareer}
          onClose={() => setShowCareerModal(false)}
          onSave={async (data) => {
            try {
              if (editingCareer) {
                await api.put(`/admin/careers/${editingCareer.id}`, data);
                showToast('Career updated!');
              } else {
                await api.post('/admin/careers', data);
                showToast('Career added!');
              }
              setShowCareerModal(false);
              loadData();
            } catch (err) {
              console.error(err);
            }
          }}
        />
      )}
    </div>
  );
}

function CareerModal({ career, onClose, onSave }) {
  const [form, setForm] = useState({
    name: career?.name || '',
    description: career?.description || '',
    field: career?.field || '',
    icon: career?.icon || '🎯',
    salary_range: career?.salary_range || '',
    growth_outlook: career?.growth_outlook || 'Good',
    min_grade: career?.min_grade || 60,
    required_stream: career?.required_stream?.join(', ') || '',
    related_interests: career?.related_interests?.join(', ') || '',
    related_skills: career?.related_skills?.join(', ') || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave({
      ...form,
      min_grade: parseFloat(form.min_grade),
      required_stream: form.required_stream.split(',').map(s => s.trim()).filter(Boolean),
      related_interests: form.related_interests.split(',').map(s => s.trim()).filter(Boolean),
      related_skills: form.related_skills.split(',').map(s => s.trim()).filter(Boolean),
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-strong w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">{career ? 'Edit Career' : 'Add New Career'}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Career Name *</label>
              <input className="input-field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Field *</label>
              <input className="input-field" value={form.field} onChange={e => setForm(f => ({ ...f, field: e.target.value }))} required placeholder="e.g. Technology" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description *</label>
            <textarea className="input-field resize-none" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Icon (emoji)</label>
              <input className="input-field" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Salary Range</label>
              <input className="input-field" value={form.salary_range} onChange={e => setForm(f => ({ ...f, salary_range: e.target.value }))} placeholder="₹5L – ₹20L/year" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Min Grade (%)</label>
              <input type="number" min="0" max="100" className="input-field" value={form.min_grade} onChange={e => setForm(f => ({ ...f, min_grade: e.target.value }))} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Growth Outlook</label>
              <select className="input-field" value={form.growth_outlook} onChange={e => setForm(f => ({ ...f, growth_outlook: e.target.value }))}>
                {['Excellent', 'Good', 'Moderate', 'Stable'].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Streams (comma-separated)</label>
              <input className="input-field" value={form.required_stream} onChange={e => setForm(f => ({ ...f, required_stream: e.target.value }))} placeholder="Science, Commerce" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Related Interests (comma-separated)</label>
            <input className="input-field" value={form.related_interests} onChange={e => setForm(f => ({ ...f, related_interests: e.target.value }))} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Related Skills (comma-separated)</label>
            <input className="input-field" value={form.related_skills} onChange={e => setForm(f => ({ ...f, related_skills: e.target.value }))} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="flex-1 btn-primary justify-center">
              {saving ? <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : career ? 'Save Changes' : 'Add Career'}
            </button>
            <button type="button" onClick={onClose} className="flex-1 btn-secondary justify-center">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
