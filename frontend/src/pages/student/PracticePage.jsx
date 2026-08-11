import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAdaptiveEngine } from '../../hooks/useAdaptiveEngine';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPracticeProblems } from '../../store/slices/recommendationSlice';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Target,
  Sparkles,
  AlertCircle,
  Clock,
  BookOpen,
  ArrowRight,
  Filter,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';

export function PracticePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTopic = searchParams.get('topic') || 'all';

  const { practiceProblems, isLoading } = useSelector((state) => state.recommendations);
  const { weakTopics } = useAdaptiveEngine();

  const [topicFilter, setTopicFilter] = useState(initialTopic);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchPracticeProblems({ topic: topicFilter, difficulty: difficultyFilter }));
  }, [dispatch, topicFilter, difficultyFilter]);

  const filteredProblems = (practiceProblems || []).filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.topic.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="purple" size="sm">
                Adaptive Problem Generator
              </Badge>
              <span className="text-xs text-slate-500 font-mono">Targeted Drills</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Adaptive Practice Hub</h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              Solve targeted algorithmic exercises dynamically curated to eliminate your identified conceptual gaps in weak topics.
            </p>
          </div>
        </div>
      </div>

      {/* Weak Topics Quick Badges Strip */}
      {weakTopics.length > 0 && (
        <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Currently Flagged Weak Topics (&lt; 60% Accuracy)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {weakTopics.map((w) => (
              <button
                key={w.id || w.topic}
                type="button"
                onClick={() => setTopicFilter(w.topic)}
                className="px-3 py-1 rounded-lg bg-white border border-rose-300 text-rose-800 text-xs font-medium hover:bg-rose-100/50 transition-colors shadow-2xs"
              >
                {w.topic} ({w.accuracy}% accuracy) • Drill
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input
          placeholder="Search problem titles or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={Search}
        />

        <Select
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Topics' },
            { value: 'prefix-sum', label: 'Prefix Sum' },
            { value: 'hashmap', label: 'HashMap & Sets' },
            { value: 'binary-search', label: 'Binary Search' },
            { value: 'two-pointer', label: 'Two Pointer' },
            { value: 'sliding-window', label: 'Sliding Window' },
          ]}
        />

        <Select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Difficulties' },
            { value: 'easy', label: 'Easy' },
            { value: 'medium', label: 'Medium' },
            { value: 'hard', label: 'Hard' },
          ]}
        />
      </div>

      {/* Practice Drill Cards Grid */}
      {filteredProblems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProblems.map((problem) => (
            <Card
              key={problem.id}
              className="p-5 sm:p-6 border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all space-y-4"
            >
              <div className="space-y-3">
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="primary" size="sm">
                      {problem.topic}
                    </Badge>
                    <Badge
                      variant={
                        problem.difficulty === 'Easy'
                          ? 'success'
                          : problem.difficulty === 'Medium'
                          ? 'warning'
                          : 'danger'
                      }
                      size="sm"
                    >
                      {problem.difficulty}
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {problem.estimatedMins} mins
                  </span>
                </div>

                {/* Problem Title & Reason */}
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">{problem.title}</h3>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
                    <p className="font-semibold text-slate-800 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      Adaptive Trigger Reason:
                    </p>
                    <p className="text-slate-600 leading-relaxed">{problem.reason}</p>
                  </div>
                </div>

                {/* Tags */}
                {problem.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {problem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono font-medium">
                  {problem.questionCount} interactive questions
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  rightIcon={ArrowRight}
                  onClick={() => navigate(`/quiz/quiz-prefix-sum`)}
                >
                  Start Practice Drill
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Target}
          title="No practice problems found"
          description="Try resetting your topic filter or search query."
          actionLabel="Reset Filters"
          onAction={() => {
            setTopicFilter('all');
            setDifficultyFilter('all');
            setSearchQuery('');
          }}
        />
      )}
    </div>
  );
}
