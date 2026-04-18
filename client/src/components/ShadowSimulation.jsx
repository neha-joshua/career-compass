import { useState } from 'react';
import { getScenarioForCareer } from '../data/shadowScenarios';
import { X, ArrowRight, CheckCircle, Warning, Trophy, SmileyMeh, SmileySad } from '@phosphor-icons/react';

const INITIAL_SCORE = 50;

function ScoreBar({ score }) {
  const pct = Math.max(0, Math.min(100, score));
  const color =
    pct >= 80 ? 'from-emerald-400 to-emerald-500' :
    pct >= 65 ? 'from-blue-400 to-blue-500' :
    pct >= 50 ? 'from-amber-400 to-amber-500' :
    'from-red-400 to-red-500';

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Fit Score</span>
        <span className="text-sm font-extrabold text-slate-800">{pct}/100</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function ResultScreen({ score, careerName, onReset }) {
  const pct = Math.max(0, Math.min(100, score));

  const result =
    pct >= 80
      ? {
          icon: <Trophy size={36} weight="fill" className="text-amber-500" />,
          bg: 'from-emerald-50 to-teal-50',
          border: 'border-emerald-200',
          badge: 'bg-emerald-100 text-emerald-800',
          label: 'Excellent Fit',
          headline: 'You thrive in this environment!',
          body: `Your choices reflect strong alignment with the day-to-day realities of being a ${careerName}. You approach challenges with professionalism, sound judgment, and the right mindset.`,
        }
      : pct >= 65
      ? {
          icon: <CheckCircle size={36} weight="fill" className="text-blue-500" />,
          bg: 'from-blue-50 to-indigo-50',
          border: 'border-blue-200',
          badge: 'bg-blue-100 text-blue-800',
          label: 'Good Fit',
          headline: 'You will adapt well — with some learning.',
          body: `You have a good instinct for this career. A few of your choices suggest areas to develop, but overall you are well-suited for the realities of the role.`,
        }
      : pct >= 50
      ? {
          icon: <SmileyMeh size={36} weight="fill" className="text-amber-500" />,
          bg: 'from-amber-50 to-yellow-50',
          border: 'border-amber-200',
          badge: 'bg-amber-100 text-amber-800',
          label: 'Mixed Fit',
          headline: 'Some aspects will challenge you.',
          body: `This career has moments that do not naturally align with your current instincts. With self-awareness and the right mentorship, you can succeed — but expect a real learning curve.`,
        }
      : {
          icon: <Warning size={36} weight="fill" className="text-red-500" />,
          bg: 'from-red-50 to-rose-50',
          border: 'border-red-200',
          badge: 'bg-red-100 text-red-800',
          label: 'Consider carefully',
          headline: 'This career may be more stressful than you expect.',
          body: `Several of your choices suggest a mismatch with the day-to-day demands of a ${careerName}. That does not mean you cannot pursue it — but go in with eyes open about what the job truly requires.`,
        };

  return (
    <div className={`rounded-2xl border ${result.border} bg-gradient-to-br ${result.bg} p-6 text-center`}>
      <div className="flex justify-center mb-3">{result.icon}</div>
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${result.badge}`}>
        {result.label}
      </span>
      <div className="text-4xl font-extrabold text-slate-900 mb-1">{pct}<span className="text-xl text-slate-400">/100</span></div>
      <p className="font-bold text-slate-800 text-base mb-2">{result.headline}</p>
      <p className="text-sm text-slate-600 leading-relaxed mb-5">{result.body}</p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-50 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}

export default function ShadowSimulation({ careerName }) {
  const scenario = getScenarioForCareer(careerName);
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(INITIAL_SCORE);
  const [chosen, setChosen] = useState(null); // letter of chosen option
  const [feedbackShown, setFeedbackShown] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const question = scenario.questions[current];

  const handleChoice = (option) => {
    if (chosen) return;
    setChosen(option.letter);
    setFeedbackShown(true);
    setScore(prev => Math.max(0, Math.min(100, prev + option.impact)));
    setAnswers(prev => [...prev, { q: current, letter: option.letter, impact: option.impact }]);
  };

  const handleNext = () => {
    if (current + 1 >= scenario.questions.length) {
      setFinished(true);
    } else {
      setCurrent(prev => prev + 1);
      setChosen(null);
      setFeedbackShown(false);
    }
  };

  const handleReset = () => {
    setStarted(false);
    setCurrent(0);
    setScore(INITIAL_SCORE);
    setChosen(null);
    setFeedbackShown(false);
    setAnswers([]);
    setFinished(false);
  };

  if (!started) {
    return (
      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center text-2xl shadow-md">
            🎭
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Shadow a Professional</h2>
            <p className="text-sm text-violet-600 font-semibold">5-question workday simulation</p>
          </div>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed mb-2">
          Step into a real workday as a <strong className="text-slate-800">{careerName}</strong>. Make decisions, see how professionals think, and find out how well you fit this career's reality.
        </p>
        <p className="text-xs text-slate-400 italic mb-5">
          {scenario.intro}
        </p>
        <button
          onClick={() => setStarted(true)}
          className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-2xl transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg"
        >
          Start Simulation <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-2xl bg-violet-100 flex items-center justify-center text-xl">
          🎭
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-extrabold text-slate-900">Shadow a Professional</h2>
          <p className="text-sm text-slate-500">A day as a <strong>{careerName}</strong></p>
        </div>
        {!finished && (
          <span className="px-3 py-1 bg-violet-50 text-violet-700 font-bold rounded-full text-sm">
            {current + 1} / {scenario.questions.length}
          </span>
        )}
      </div>

      {/* Progress dots */}
      {!finished && (
        <div className="flex items-center gap-2 mb-5">
          {scenario.questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i < current ? 'bg-violet-500' :
                i === current ? 'bg-violet-300' :
                'bg-slate-100'
              }`}
            />
          ))}
        </div>
      )}

      {/* Score bar */}
      <div className="mb-6">
        <ScoreBar score={score} />
      </div>

      {finished ? (
        <ResultScreen score={score} careerName={careerName} onReset={handleReset} />
      ) : (
        <div>
          {/* Time chip */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold mb-3">
            🕐 {question.time}
          </div>

          {/* Situation */}
          <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 mb-5">
            <p className="text-slate-800 font-semibold text-sm leading-relaxed">
              {question.situation}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option) => {
              const isChosen = chosen === option.letter;
              const isRevealed = feedbackShown;
              const isGood = option.impact > 5;
              const isOkay = option.impact > 0 && option.impact <= 5;
              const isBad = option.impact <= 0;

              let optionStyle = 'border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50';
              if (isRevealed && isChosen) {
                optionStyle = isGood
                  ? 'border-emerald-400 bg-emerald-50'
                  : isOkay
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-red-300 bg-red-50';
              } else if (isRevealed && !isChosen) {
                optionStyle = 'border-slate-100 bg-slate-50 opacity-60';
              }

              return (
                <button
                  key={option.letter}
                  onClick={() => handleChoice(option)}
                  disabled={!!chosen}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${optionStyle} ${!chosen ? 'active:scale-[0.99] cursor-pointer' : 'cursor-default'}`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-sm flex-shrink-0 transition-colors ${
                      isRevealed && isChosen
                        ? isGood ? 'bg-emerald-200 text-emerald-800' : isOkay ? 'bg-blue-200 text-blue-800' : 'bg-red-200 text-red-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {option.letter}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">{option.text}</p>
                      {isRevealed && isChosen && (
                        <p className={`text-xs mt-1.5 font-medium ${
                          isGood ? 'text-emerald-700' : isOkay ? 'text-blue-700' : 'text-red-700'
                        }`}>
                          {isGood ? '✓ ' : isOkay ? '→ ' : '✗ '}{option.feedback}
                        </p>
                      )}
                    </div>
                    {isRevealed && isChosen && (
                      <span className={`text-xs font-extrabold px-2 py-1 rounded-lg flex-shrink-0 ${
                        isGood ? 'bg-emerald-100 text-emerald-700' : isOkay ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {option.impact > 0 ? `+${option.impact}` : option.impact}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Next button */}
          {feedbackShown && (
            <button
              onClick={handleNext}
              className="mt-5 w-full flex items-center justify-center gap-2 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-2xl transition-all duration-200 active:scale-95"
            >
              {current + 1 < scenario.questions.length ? (
                <>Next Situation <ArrowRight size={18} /></>
              ) : (
                <>See My Result <Trophy size={18} /></>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
