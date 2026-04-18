import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Compass, Star, ChartBar, BookOpen, Users, CheckCircle, TrendUp, Brain, Target } from '@phosphor-icons/react';

const features = [
  {
    icon: Brain,
    title: 'HACSS AI Engine',
    description: 'Hybrid Adaptive Career Simulation System combines resume analysis, behavioral intelligence, and predictive simulation for unmatched accuracy.',
    color: 'from-violet-500 to-brand-600',
    bg: 'bg-violet-50',
    iconColor: 'text-violet-600'
  },
  {
    icon: Target,
    title: 'Resume-Powered Matching',
    description: 'Upload your resume (PDF/DOCX) to auto-extract skills and get 60+ career paths ranked by real suitability score.',
    color: 'from-brand-500 to-cyan-500',
    bg: 'bg-brand-50',
    iconColor: 'text-brand-600'
  },
  {
    icon: BookOpen,
    title: 'Skill Gap Analysis',
    description: 'Identify exactly which skills you\'re missing, compare with industry standards, and get curated course recommendations.',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600'
  },
  {
    icon: ChartBar,
    title: 'Location-Based Insights',
    description: 'Get city-specific salary data, job market trends, and regional demand analysis for every recommended career.',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    iconColor: 'text-amber-600'
  },
  {
    icon: TrendUp,
    title: 'Real-Time Analytics',
    description: 'Interactive charts show career suitability scores, skill distributions, and progress across assessments over time.',
    color: 'from-rose-500 to-pink-500',
    bg: 'bg-rose-50',
    iconColor: 'text-rose-600'
  },
  {
    icon: Users,
    title: 'Behavioral Intelligence',
    description: 'Your engagement patterns and assessment history dynamically refine recommendations for continuous improvement.',
    color: 'from-indigo-500 to-brand-500',
    bg: 'bg-indigo-50',
    iconColor: 'text-indigo-600'
  },
];

const stats = [
  { value: '60+', label: 'Career Paths' },
  { value: '100%', label: 'Personalized' },
  { value: 'HACSS', label: 'AI Engine' },
  { value: 'Free', label: 'Always' },
];

const steps = [
  { step: '01', title: 'Create Your Profile', desc: 'Sign up and optionally upload your resume. Our AI auto-extracts skills and experience to boost accuracy.' },
  { step: '02', title: 'Complete Assessment', desc: 'Select interests, skills, and grades. Add your location for city-specific salary and market insights.' },
  { step: '03', title: 'Get 60+ Recommendations', desc: 'HACSS engine runs a simulation and ranks 60+ career paths by suitability. Explore skill gaps with a click.' },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-brand-50/30 to-violet-50/40" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-violet-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-400/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-32 pt-40">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-100 rounded-full mb-8 animate-fade-in">
              <Compass weight="fill" size={16} className="text-brand-600" />
              <span className="text-brand-700 text-sm font-semibold">Smart Career Path Recommendation System</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.05] mb-6 animate-fade-up">
              Discover Your{' '}
              <span className="text-gradient">Perfect Career</span>{' '}
              Path
            </h1>

            <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-up animate-delay-100">
              Personalized career guidance powered by intelligent analysis of your interests,
              academic performance, and skills. Make confident decisions about your future.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up animate-delay-200">
              <Link
                to={user ? '/assessment' : '/register'}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-brand-600 to-teal-600 text-white font-bold text-lg rounded-2xl shadow-brand hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Start Free Assessment
                <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight size={18} />
                </span>
              </Link>
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-700 font-bold text-lg rounded-2xl border border-slate-200 shadow-soft hover:shadow-medium hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]"
              >
                Explore Careers
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-20 animate-fade-up animate-delay-300">
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-3xl font-extrabold text-gradient mb-1">{value}</div>
                  <div className="text-sm text-slate-500 font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-slate-300 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 bg-slate-400 rounded-full" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="section-eyebrow">How it works</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">
              Three steps to your{' '}
              <span className="text-gradient">ideal career</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Our intelligent system guides you through a simple process to discover the careers that fit you best.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ step, title, desc }, i) => (
              <div key={step} className="relative group">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-brand-200 to-transparent z-0" />
                )}
                <div className="relative z-10 bg-white rounded-3xl p-8 border border-slate-100 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                  <div className="text-5xl font-extrabold text-gradient opacity-20 mb-4">{step}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
                  <p className="text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="section-eyebrow">Features</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">
              Everything you need to{' '}
              <span className="text-gradient">decide confidently</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description, bg, iconColor }) => (
              <div key={title} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 group">
                <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}>
                  <Icon size={28} weight="duotone" className={iconColor} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-teal-700 p-12 sm:p-20 text-center">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <span className="inline-block px-4 py-2 bg-white/10 text-white text-sm font-semibold rounded-full mb-6 tracking-wide">
                Start for free — no credit card needed
              </span>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
                Ready to find your<br />dream career?
              </h2>
              <p className="text-brand-200 text-lg mb-10 max-w-lg mx-auto">
                Join students who've already discovered their ideal career paths using CareerCompass.
              </p>
              <Link
                to={user ? '/assessment' : '/register'}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-brand-700 font-bold text-lg rounded-2xl shadow-strong hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]"
              >
                {user ? 'Take Assessment' : 'Create Free Account'}
                <span className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight size={18} className="text-brand-600" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center">
              <Compass weight="fill" className="text-white" size={16} />
            </div>
            <span className="font-bold text-white">CareerCompass</span>
          </div>
          <p className="text-sm text-slate-500">© 2024 CareerCompass. Smart Career Path Recommendation System.</p>
        </div>
      </footer>
    </div>
  );
}
