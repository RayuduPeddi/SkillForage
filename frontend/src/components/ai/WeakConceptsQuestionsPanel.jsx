import React, { useState } from 'react';
import {
  AlertTriangle,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Send,
  ChevronRight,
  ChevronDown,
  Zap,
  Target,
  Brain,
  RotateCcw,
  CheckCircle2,
  PanelRightClose,
  PanelRightOpen,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { cn } from '../../utils/cn';

// Curated high-yield conceptual mentor questions by topic
export const TOPIC_MENTOR_QUESTIONS = {
  'Prefix Sum': [
    {
      id: 'ps_1',
      title: '1-Based Indexing Invariant',
      question: 'Why do we use 1-based indexing in Prefix Sum arrays and how does it prevent index out-of-bounds bugs?',
      tag: 'Core Intuition',
    },
    {
      id: 'ps_2',
      title: 'Range Sum Query Formula',
      question: 'Explain the mathematical formula prefix[R+1] - prefix[L] for computing subarray sum in O(1) time.',
      tag: 'Proof & Math',
    },
    {
      id: 'ps_3',
      title: 'Prefix Sum + HashMap Pairing',
      question: 'How do HashMaps pair with Prefix Sum to solve "Subarray Sum Equals K" in O(N) time instead of O(N^2)?',
      tag: 'Interview Pattern',
    },
    {
      id: 'ps_4',
      title: 'Top 3 Common Mistakes',
      question: 'Show me the top 3 mistakes and boundary traps students make when implementing Prefix Sum.',
      tag: 'Bug Prevention',
    },
    {
      id: 'ps_5',
      title: 'Interactive Practice Problem',
      question: 'Give me an easy 1-question practice problem on Prefix Sum and let me try to solve it first.',
      tag: 'Practice Drill',
    },
  ],
  'HashMap & Sets': [
    {
      id: 'hm_1',
      title: 'HashMap vs Frequency Array',
      question: 'When should I use a HashMap vs a Fixed-size Frequency Array for counting?',
      tag: 'Core Concept',
    },
    {
      id: 'hm_2',
      title: 'Single-Pass Two Sum Trick',
      question: 'Explain the single-pass complement lookup in Two Sum and why we check the map before inserting.',
      tag: 'Interview Pattern',
    },
    {
      id: 'hm_3',
      title: 'Hash Collisions & Time Complexity',
      question: 'Why is average HashMap lookup O(1) but worst-case O(N)? How does load factor prevent degradation?',
      tag: 'Complexity Theory',
    },
  ],
  'Binary Search': [
    {
      id: 'bs_1',
      title: 'Left <= Right vs Left < Right',
      question: 'How do I decide between "while left <= right" vs "while left < right" in binary search boundary conditions?',
      tag: 'Boundary Traps',
    },
    {
      id: 'bs_2',
      title: 'Binary Search on Monotonic Space',
      question: 'How do I apply Binary Search to find the minimum/maximum answer on a monotonic predicate function?',
      tag: 'Advanced Pattern',
    },
    {
      id: 'bs_3',
      title: 'Mid Calculation Overflow',
      question: 'Why do we write "left + (right - left) // 2" instead of "(left + right) // 2"?',
      tag: 'Implementation',
    },
  ],
  'Trees & BST': [
    {
      id: 'tr_1',
      title: 'Tree Traversals Comparison',
      question: 'What is the intuitive difference between Pre-order, In-order, and Post-order traversals and when to use each?',
      tag: 'Foundations',
    },
    {
      id: 'tr_2',
      title: 'Validate BST Invariants',
      question: 'Why is simply checking "left < root < right" for children insufficient to validate a BST? Explain the range pass approach.',
      tag: 'Tree Invariants',
    },
    {
      id: 'tr_3',
      title: 'Lowest Common Ancestor (LCA)',
      question: 'Explain the recursive divide-and-conquer strategy for finding the Lowest Common Ancestor in a Binary Tree.',
      tag: 'Interview Classic',
    },
  ],
  'Sliding Window': [
    {
      id: 'sw_1',
      title: 'Sliding Window vs Prefix Sum',
      question: 'When can Sliding Window be used instead of Prefix Sum? What constraint allows the window contraction?',
      tag: 'Pattern Strategy',
    },
    {
      id: 'sw_2',
      title: 'Variable Window Expansion & Shrink',
      question: 'Explain the template for variable-length sliding window when looking for the longest valid subarray.',
      tag: 'Template Code',
    },
  ],
};

export function WeakConceptsQuestionsPanel({
  weakTopics = [],
  currentTopic = 'Prefix Sum',
  onSelectTopic,
  onAskQuestion,
  isOpen = true,
  onToggleOpen,
}) {
  const [expandedTopic, setExpandedTopic] = useState(currentTopic);

  // Default fallback topics if empty
  const displayTopics =
    weakTopics && weakTopics.length > 0
      ? weakTopics
      : [
          { id: 'prefix-sum', topic: 'Prefix Sum', accuracy: 43, status: 'Needs Revision' },
          { id: 'hashmap', topic: 'HashMap & Sets', accuracy: 52, status: 'Needs Practice' },
          { id: 'binary-search', topic: 'Binary Search', accuracy: 45, status: 'Needs Revision' },
          { id: 'trees', topic: 'Trees & BST', accuracy: 35, status: 'Needs Revision' },
        ];

  const activeQuestions =
    TOPIC_MENTOR_QUESTIONS[expandedTopic] ||
    TOPIC_MENTOR_QUESTIONS[currentTopic] ||
    TOPIC_MENTOR_QUESTIONS['Prefix Sum'];

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200/90 select-none overflow-hidden">
      {/* 1. Header Bar */}
      <div className="p-4 border-b border-slate-200/90 flex items-center justify-between shrink-0 bg-slate-50/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Weak Concepts & Questions
            </h3>
            <p className="text-[11px] text-slate-500">
              1-click questions to ask your mentor
            </p>
          </div>
        </div>

        {onToggleOpen && (
          <button
            type="button"
            onClick={onToggleOpen}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            title="Collapse panel"
          >
            <PanelRightClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* Section 1: Weak Topics Spectrum */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
            <span>Diagnostic Gaps ({displayTopics.length})</span>
            <span className="text-rose-600 font-semibold">Priority Focus</span>
          </div>

          <div className="space-y-2">
            {displayTopics.map((topicItem) => {
              const isSelected = (expandedTopic === topicItem.topic) || (currentTopic === topicItem.topic);
              const accuracy = topicItem.accuracy || 45;

              return (
                <div
                  key={topicItem.topic || topicItem.id}
                  onClick={() => {
                    const selectedTopicName = topicItem.topic;
                    setExpandedTopic(selectedTopicName);
                    onSelectTopic?.(selectedTopicName);

                    const firstQuestion =
                      TOPIC_MENTOR_QUESTIONS[selectedTopicName]?.[0]?.question ||
                      `Explain the core concepts and common pitfalls for ${selectedTopicName}.`;
                    onAskQuestion?.(firstQuestion);
                  }}
                  className={cn(
                    'p-3 rounded-xl border transition-all cursor-pointer space-y-2',
                    isSelected
                      ? 'bg-purple-50/80 border-purple-300 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'w-2 h-2 rounded-full',
                          accuracy < 50 ? 'bg-rose-500' : 'bg-amber-500'
                        )}
                      />
                      <span className="text-xs font-bold text-slate-900">
                        {topicItem.topic}
                      </span>
                    </div>

                    <span
                      className={cn(
                        'text-[10px] font-bold font-mono px-2 py-0.5 rounded-full',
                        accuracy < 50
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      )}
                    >
                      {accuracy}% Accuracy
                    </span>
                  </div>

                  <ProgressBar
                    value={accuracy}
                    size="xs"
                    color={accuracy < 50 ? 'danger' : 'warning'}
                  />

                  <div className="flex items-center justify-between pt-0.5 text-[11px]">
                    <span className="text-slate-400 text-[10px]">
                      {isSelected ? '● Currently Active Focus' : 'Click to view questions'}
                    </span>
                    <span className="text-purple-600 font-semibold text-[11px] flex items-center gap-0.5">
                      {isSelected ? 'Questions Below ↓' : 'Select →'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Questions to Ask the Mentor for Selected Topic */}
        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Questions for {expandedTopic || currentTopic}
            </span>
            <Badge variant="purple" size="sm">
              {activeQuestions.length} Suggestions
            </Badge>
          </div>

          <div className="space-y-2">
            {activeQuestions.map((q) => (
              <div
                key={q.id}
                className="p-3 rounded-xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-xs transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    {q.tag}
                  </span>
                  <button
                    type="button"
                    onClick={() => onAskQuestion?.(q.question)}
                    className="flex items-center gap-1 text-[11px] font-bold text-purple-600 hover:text-purple-800 transition-colors"
                    title="Send this question to AI Mentor"
                  >
                    <span>Ask</span>
                    <Send className="w-3 h-3 text-purple-600" />
                  </button>
                </div>

                <h4 className="text-xs font-semibold text-slate-900 group-hover:text-purple-950 transition-colors">
                  {q.title}
                </h4>

                <p className="text-[11px] text-slate-600 leading-relaxed italic bg-slate-50/70 p-2 rounded-lg border border-slate-100">
                  "{q.question}"
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={MessageSquare}
                  onClick={() => onAskQuestion?.(q.question)}
                  className="w-full text-xs h-7 py-0 font-medium text-slate-700 hover:text-purple-700 hover:border-purple-300 hover:bg-purple-50"
                >
                  Ask Mentor This Question
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Bottom 1-Click Drill Generator */}
      <div className="p-3 border-t border-slate-200/90 bg-slate-50/80 shrink-0">
        <Button
          variant="primary"
          size="sm"
          leftIcon={Zap}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold h-9 rounded-xl shadow-xs"
          onClick={() =>
            onAskQuestion?.(
              `Generate an interactive 1-question adaptive checkpoint on my weakest topic (${expandedTopic || currentTopic}).`
            )
          }
        >
          Generate Mini-Quiz on {expandedTopic || currentTopic}
        </Button>
      </div>
    </div>
  );
}
