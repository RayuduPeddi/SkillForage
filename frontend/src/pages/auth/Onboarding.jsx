import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { ROUTES } from '../../constants/routes';
import {
  Sparkles,
  Target,
  Code2,
  Brain,
  Sliders,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
} from 'lucide-react';

export function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState({
    learningGoal: 'Software Engineer Interview Prep',
    targetSkill: 'Data Structures & Algorithms',
    experienceLevel: 'Intermediate',
    preferences: {
      pace: 'Moderate (45 mins/day)',
      format: 'Interactive Video + Practice Drills',
    },
    diagnosticAnswer: 'a',
  });
  const [isFinishing, setIsFinishing] = useState(false);

  const { completeOnboarding } = useAuth();
  const { success: toastSuccess } = useToast();
  const navigate = useNavigate();

  const totalSteps = 6;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinish = async () => {
    setIsFinishing(true);
    await completeOnboarding(data);
    setIsFinishing(false);
    toastSuccess('Onboarding Complete', 'Your personalized adaptive path is now active!');
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4 sm:px-6">
      {/* Progress Bar Header */}
      <div className="space-y-2 mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1.5 text-brand-600">
            <Sparkles className="w-3.5 h-3.5" />
            Step {currentStep} of {totalSteps}
          </span>
          <span className="font-mono">{Math.round((currentStep / totalSteps) * 100)}% Completed</span>
        </div>
        <ProgressBar value={currentStep} max={totalSteps} size="sm" color="brand" />
      </div>

      {/* Card Content Container */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-card space-y-6 animate-in fade-in duration-200">
        {/* Step 1: Welcome */}
        {currentStep === 1 && (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Welcome to SkillForage</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              SkillForage is an AI-powered adaptive learning system. We tailor curriculum, practice drills, and review recommendations directly to your accuracy and problem-solving speed.
            </p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs text-slate-600 space-y-2">
              <p className="font-semibold text-slate-900">What to expect:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-500">
                <li>Under 3 minutes setup</li>
                <li>Dynamic curriculum tailored to your experience</li>
                <li>Initial diagnostic baseline evaluation</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 2: Learning Goal */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">What is your primary learning goal?</h2>
              <p className="text-xs text-slate-500 mt-1">This guides how your curriculum timeline is structured.</p>
            </div>

            <div className="space-y-2.5">
              {[
                { title: 'Software Engineer Interview Prep', desc: 'Crack FAANG & top tech algorithmic coding rounds' },
                { title: 'University Computer Science Mastery', desc: 'Excel in academic data structures and system design' },
                { title: 'Fullstack Career Transition', desc: 'Build scalable modern web applications from scratch' },
                { title: 'Upskilling in AI & Machine Learning', desc: 'Master transformers, LLMs, and Python architectures' },
              ].map((goal) => (
                <div
                  key={goal.title}
                  onClick={() => setData({ ...data, learningGoal: goal.title })}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                    data.learningGoal === goal.title
                      ? 'border-brand-600 bg-brand-50/70 text-brand-900 ring-1 ring-brand-500/20 font-semibold'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <p className="font-bold text-sm text-slate-900">{goal.title}</p>
                  <p className="text-slate-500 mt-0.5">{goal.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Skill Selection */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Which core skill do you want to master first?</h2>
              <p className="text-xs text-slate-500 mt-1">You can explore and enroll in other courses anytime.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'Data Structures & Algorithms', tag: 'Core CS' },
                { title: 'System Design for High Scale', tag: 'Architecture' },
                { title: 'Fullstack React & Node.js', tag: 'Engineering' },
                { title: 'Machine Learning & LLMs', tag: 'AI' },
              ].map((s) => (
                <div
                  key={s.title}
                  onClick={() => setData({ ...data, targetSkill: s.title })}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                    data.targetSkill === s.title
                      ? 'border-brand-600 bg-brand-50/70 text-brand-900 ring-1 ring-brand-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-mono text-brand-600 font-semibold uppercase">{s.tag}</span>
                  <p className="font-bold text-sm text-slate-900 mt-1">{s.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Experience Level */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Select your current experience level</h2>
              <p className="text-xs text-slate-500 mt-1">We adjust the starting difficulty of diagnostic questions.</p>
            </div>

            <div className="space-y-2.5">
              {[
                { level: 'Beginner', desc: 'Basic programming knowledge; new to algorithmic problem solving' },
                { level: 'Intermediate', desc: 'Familiar with arrays, hash maps, and recursion; looking to master patterns' },
                { level: 'Advanced', desc: 'Experienced developer optimizing for hard graphs, DP, and system scale' },
              ].map((lvl) => (
                <div
                  key={lvl.level}
                  onClick={() => setData({ ...data, experienceLevel: lvl.level })}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                    data.experienceLevel === lvl.level
                      ? 'border-brand-600 bg-brand-50/70 text-brand-900 ring-1 ring-brand-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <p className="font-bold text-sm text-slate-900">{lvl.level}</p>
                  <p className="text-slate-500 mt-0.5">{lvl.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Learning Preferences */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Your study preferences</h2>
              <p className="text-xs text-slate-500 mt-1">Setting realistic daily goals increases completion by 3x.</p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Daily Learning Commitment</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Light (20m)', 'Moderate (45m)', 'Intensive (90m)'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setData({ ...data, preferences: { ...data.preferences, pace: p } })}
                      className={`p-2.5 rounded-lg border text-xs font-medium transition-all ${
                        data.preferences.pace === p
                          ? 'border-brand-600 bg-brand-50 text-brand-700 font-semibold'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Initial Diagnostic Assessment */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-purple-600 font-bold uppercase tracking-wider">
                Adaptive Baseline Question
              </span>
              <h2 className="text-base font-bold text-slate-900">
                What is the time complexity of querying a range sum $[L, R]$ with a precomputed prefix sum array?
              </h2>
            </div>

            <div className="space-y-2">
              {[
                { id: 'a', text: 'O(1) constant time subtraction prefix[R] - prefix[L-1]' },
                { id: 'b', text: 'O(N) linear scan over the elements' },
                { id: 'c', text: 'O(log N) binary search' },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setData({ ...data, diagnosticAnswer: opt.id })}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    data.diagnosticAnswer === opt.id
                      ? 'border-brand-600 bg-brand-50/70 text-brand-900 ring-1 ring-brand-500/20 font-semibold'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  {opt.text}
                </div>
              ))}
            </div>

            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 space-y-1">
              <p className="font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                Adaptive Curriculum Synthesis
              </p>
              <p className="text-[11px] text-purple-700">
                We are generating your personalized baseline. Your weaknesses in Prefix Sum and HashMap will be automatically flagged for targeted practice.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {currentStep > 1 ? (
            <Button variant="outline" size="sm" onClick={handleBack} leftIcon={ArrowLeft}>
              Back
            </Button>
          ) : (
            <div />
          )}

          {currentStep < totalSteps ? (
            <Button variant="primary" size="sm" onClick={handleNext} rightIcon={ArrowRight}>
              Continue
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={handleFinish}
              isLoading={isFinishing}
              rightIcon={CheckCircle2}
            >
              Generate My Adaptive Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
