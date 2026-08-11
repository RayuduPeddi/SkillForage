import React, { useState } from 'react';
import {
  Sparkles,
  AlertCircle,
  CheckCircle,
  Play,
  Terminal,
  Code2,
  Bookmark,
  Zap,
  Trash2,
  RotateCcw,
  Copy,
  Check,
  Send,
  HelpCircle,
  Layers,
  Brain,
  Activity,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

export function InspectorPanel({
  overallMastery = 72,
  weakTopics = [],
  strongTopics = [],
  currentTopic = 'Prefix Sum',
  onSelectTopic,
  onSendToChat,
  sandboxCode,
  setSandboxCode,
  sandboxLang,
  setSandboxLang,
  onRunSandbox,
  sandboxOutput,
  isSandboxRunning,
  savedNotes = [],
  onDeleteNote,
}) {
  const [activeTab, setActiveTab] = useState('diagnostics'); // 'diagnostics' | 'playground' | 'notes' | 'drills'
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const starterTemplates = {
    python: `class PrefixSumEngine:
    def __init__(self, nums: list[int]):
        self.prefix = [0] * (len(nums) + 1)
        for i, val in enumerate(nums):
            self.prefix[i + 1] = self.prefix[i] + val

    def query_range(self, L: int, R: int) -> int:
        """Computes sum in strictly O(1) time."""
        return self.prefix[R + 1] - self.prefix[L]

# Test Case:
engine = PrefixSumEngine([2, 4, 6, 8, 10])
print("Range (1, 3) Sum:", engine.query_range(1, 3)) # Expected: 18`,
    javascript: `class PrefixSumEngine {
  constructor(nums) {
    this.prefix = new Array(nums.length + 1).fill(0);
    for (let i = 0; i < nums.length; i++) {
      this.prefix[i + 1] = this.prefix[i] + nums[i];
    }
  }

  queryRange(L, R) {
    return this.prefix[R + 1] - this.prefix[L];
  }
}

const engine = new PrefixSumEngine([2, 4, 6, 8, 10]);
console.log("Range (1, 3) Sum:", engine.queryRange(1, 3)); // 18`,
    cpp: `#include <iostream>
#include <vector>
using namespace std;

class PrefixSumEngine {
    vector<int> prefix;
public:
    PrefixSumEngine(vector<int>& nums) {
        prefix.assign(nums.size() + 1, 0);
        for (int i = 0; i < nums.size(); i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
    }
    int queryRange(int L, int R) {
        return prefix[R + 1] - prefix[L];
    }
};

int main() {
    vector<int> nums = {2, 4, 6, 8, 10};
    PrefixSumEngine engine(nums);
    cout << "Range (1, 3) Sum: " << engine.queryRange(1, 3) << endl;
    return 0;
}`,
    java: `import java.util.*;

public class PrefixSumEngine {
    private int[] prefix;

    public PrefixSumEngine(int[] nums) {
        prefix = new int[nums.length + 1];
        for (int i = 0; i < nums.length; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
    }

    public int queryRange(int L, int R) {
        return prefix[R + 1] - prefix[L];
    }

    public static void main(String[] args) {
        int[] nums = {2, 4, 6, 8, 10};
        PrefixSumEngine engine = new PrefixSumEngine(nums);
        System.out.println("Range (1, 3) Sum: " + engine.queryRange(1, 3));
    }
}`,
  };

  const handleLangChange = (newLang) => {
    setSandboxLang(newLang);
    setSandboxCode(starterTemplates[newLang] || starterTemplates.python);
  };

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const practiceDrills = [
    {
      id: 'd1',
      title: 'Range Sum Query - Immutable (1D Array)',
      difficulty: 'Easy',
      topic: 'Prefix Sum',
      accuracy: '43% Accuracy Gap',
      prompt: 'Guide me through solving Range Sum Query - Immutable using 1-based indexing in Python.',
    },
    {
      id: 'd2',
      title: 'Subarray Sum Equals K (Negative Values Included)',
      difficulty: 'Medium',
      topic: 'Prefix Sum + HashMap',
      accuracy: '52% Accuracy Gap',
      prompt: 'Explain why sliding window fails on Subarray Sum Equals K when negative numbers exist, and show the HashMap prefix approach.',
    },
    {
      id: 'd3',
      title: '2D Matrix Region Sum (Inclusion-Exclusion)',
      difficulty: 'Hard',
      topic: '2D Prefix Sum',
      accuracy: 'Next Level Unlock',
      prompt: 'Walk me through the 2D Prefix Sum formula using the Principle of Inclusion-Exclusion with clear ASCII diagrams.',
    },
  ];

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-card h-full overflow-hidden">
      {/* Header Tabs */}
      <div className="p-2 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1 w-full">
          <button
            type="button"
            onClick={() => setActiveTab('diagnostics')}
            className={cn(
              'flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all',
              activeTab === 'diagnostics'
                ? 'bg-white text-purple-700 shadow-2xs font-bold border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            )}
          >
            <Activity className="w-3.5 h-3.5 text-purple-600" />
            <span>Diagnostics</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('playground')}
            className={cn(
              'flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all',
              activeTab === 'playground'
                ? 'bg-white text-purple-700 shadow-2xs font-bold border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            )}
          >
            <Terminal className="w-3.5 h-3.5 text-brand-600" />
            <span>Sandbox</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={cn(
              'flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all',
              activeTab === 'notes'
                ? 'bg-white text-purple-700 shadow-2xs font-bold border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            )}
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-500" />
            <span>Notes ({savedNotes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('drills')}
            className={cn(
              'flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all',
              activeTab === 'drills'
                ? 'bg-white text-purple-700 shadow-2xs font-bold border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            )}
          >
            <Zap className="w-3.5 h-3.5 text-rose-500" />
            <span>Drills</span>
          </button>
        </div>
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* DIAGNOSTICS TAB */}
        {activeTab === 'diagnostics' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Live Focus Card */}
            <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-purple-800 font-semibold">Active AI Target:</span>
                <Badge variant="purple" size="sm">{currentTopic}</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-purple-800 font-semibold">Diagnostic Mastery:</span>
                <span className="font-mono font-bold text-purple-900">{overallMastery}%</span>
              </div>
              <div className="w-full bg-purple-200/80 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-purple-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${overallMastery}%` }}
                />
              </div>
            </div>

            {/* Identified Weak Concepts */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Target Weak Areas
                </span>
                <span className="text-[10px] text-slate-400">Click to switch focus</span>
              </div>
              <div className="space-y-1.5">
                {weakTopics.map((item) => (
                  <button
                    key={item.id || item.topic}
                    type="button"
                    onClick={() => onSelectTopic?.(item.topic)}
                    className={cn(
                      'w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all',
                      currentTopic === item.topic
                        ? 'bg-rose-50 border-rose-400 font-bold text-rose-900 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-rose-300 text-slate-700'
                    )}
                  >
                    <span className="truncate">{item.topic}</span>
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-mono font-bold text-[11px] shrink-0">
                      {item.accuracy}%
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mastered Concepts */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Mastered Concepts
              </span>
              <div className="space-y-1.5">
                {strongTopics.map((item) => (
                  <div
                    key={item.id || item.topic}
                    className="p-2.5 rounded-xl border border-emerald-100 bg-emerald-50/50 text-xs flex items-center justify-between"
                  >
                    <span className="text-emerald-950 font-medium">{item.topic}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-mono font-bold text-[11px]">
                      {item.accuracy}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Adaptive Conceptual Guidance */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-600">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-purple-600" />
                Adaptive Misconception Flag
              </div>
              <p className="leading-relaxed text-slate-500">
                Your last quiz showed an off-by-one error when $L = 0$. Always use an $N+1$ sized prefix table initialized with 0 to make range queries strictly $O(1)$.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 text-xs"
                onClick={() => onSendToChat?.('Show me the 1-based indexing proof to eliminate the L=0 bug permanently.')}
              >
                Ask Mentor to Explain Proof →
              </Button>
            </div>
          </div>
        )}

        {/* CODE PLAYGROUND TAB */}
        {activeTab === 'playground' && (
          <div className="space-y-3 animate-in fade-in flex flex-col h-full">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-slate-900">Sandbox Editor</span>
              </div>

              <select
                value={sandboxLang}
                onChange={(e) => handleLangChange(e.target.value)}
                className="bg-slate-100 border border-slate-300 rounded px-2 py-1 text-xs text-slate-700 font-mono focus:outline-none"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
            </div>

            {/* Code Textarea */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs shadow-inner">
              <textarea
                rows={10}
                value={sandboxCode}
                onChange={(e) => setSandboxCode(e.target.value)}
                className="w-full bg-transparent p-3 text-slate-200 leading-relaxed resize-none focus:outline-none placeholder-slate-600"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => handleCopy(sandboxCode)}
                className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1 transition-colors"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                className="flex-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => onRunSandbox?.(sandboxCode, sandboxLang)}
                disabled={isSandboxRunning}
                leftIcon={Play}
              >
                {isSandboxRunning ? 'Running Tests...' : 'Run in Sandbox'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs border-purple-300 text-purple-700 hover:bg-purple-50"
                onClick={() =>
                  onSendToChat?.(
                    `Please review and optimize my ${sandboxLang} implementation:`,
                    { code: sandboxCode, language: sandboxLang }
                  )
                }
                leftIcon={Send}
              >
                Ask Mentor to Review
              </Button>
            </div>

            {/* Terminal Output */}
            {sandboxOutput && (
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 font-mono text-[11px] text-slate-200 space-y-1">
                <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800">
                  <span className="flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-emerald-400" />
                    Console Output
                  </span>
                  <span className="text-[10px] text-emerald-400">Exit Code: 0</span>
                </div>
                <pre className="whitespace-pre-wrap max-h-36 overflow-y-auto leading-relaxed text-emerald-300/90 pt-1">
                  {sandboxOutput}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* SAVED NOTES TAB */}
        {activeTab === 'notes' && (
          <div className="space-y-4 animate-in fade-in">
            {savedNotes.length > 0 ? (
              <>
                {/* Flashcard Mode Flip Card */}
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-900 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-purple-600" />
                      Flashcard Drill ({flashcardIndex + 1}/{savedNotes.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="text-purple-700 font-bold hover:underline"
                    >
                      {isFlipped ? 'Show Front' : 'Flip Card'}
                    </button>
                  </div>

                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="p-4 min-h-[110px] rounded-lg bg-white border border-purple-100 shadow-2xs flex flex-col justify-center cursor-pointer transition-all hover:border-purple-300"
                  >
                    {!isFlipped ? (
                      <div className="space-y-1">
                        <Badge variant="purple" size="sm">
                          {savedNotes[flashcardIndex]?.topic}
                        </Badge>
                        <h4 className="text-sm font-bold text-slate-900">
                          {savedNotes[flashcardIndex]?.title}
                        </h4>
                        <p className="text-[11px] text-slate-400">Click to reveal formula / code snippet</p>
                      </div>
                    ) : (
                      <pre className="text-xs font-mono bg-slate-950 text-slate-200 p-2.5 rounded whitespace-pre-wrap overflow-x-auto leading-relaxed">
                        {savedNotes[flashcardIndex]?.snippet || savedNotes[flashcardIndex]?.fullText}
                      </pre>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      disabled={flashcardIndex === 0}
                      onClick={() => {
                        setFlashcardIndex(flashcardIndex - 1);
                        setIsFlipped(false);
                      }}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      disabled={flashcardIndex >= savedNotes.length - 1}
                      onClick={() => {
                        setFlashcardIndex(flashcardIndex + 1);
                        setIsFlipped(false);
                      }}
                    >
                      Next Card
                    </Button>
                  </div>
                </div>

                {/* All Notes List */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    All Saved Concepts
                  </span>
                  {savedNotes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 rounded-xl border border-slate-200 bg-white hover:border-purple-300 transition-all space-y-2 shadow-2xs text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <Badge variant="purple" size="sm">{note.topic}</Badge>
                        <button
                          type="button"
                          onClick={() => onDeleteNote?.(note.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="font-bold text-slate-900">{note.title}</h4>
                      <pre className="p-2 rounded bg-slate-900 text-slate-200 font-mono text-[11px] whitespace-pre-wrap overflow-x-auto">
                        {note.snippet || note.fullText}
                      </pre>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                No saved notes yet. Click "Save Note" on any AI Mentor response to save it here!
              </div>
            )}
          </div>
        )}

        {/* DRILLS TAB */}
        {activeTab === 'drills' && (
          <div className="space-y-3 animate-in fade-in">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-bold flex items-center gap-1 text-amber-800">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                Adaptive Practice Arena
              </span>
              <p className="text-amber-700">
                Targeted algorithmic challenges generated based on your 43% Prefix Sum accuracy.
              </p>
            </div>

            <div className="space-y-2.5">
              {practiceDrills.map((drill) => (
                <div
                  key={drill.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-purple-300 transition-all space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-purple-700">{drill.topic}</span>
                    <Badge
                      variant={
                        drill.difficulty === 'Easy'
                          ? 'success'
                          : drill.difficulty === 'Medium'
                          ? 'warning'
                          : 'danger'
                      }
                      size="sm"
                    >
                      {drill.difficulty}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{drill.title}</h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="text-rose-600 font-semibold">{drill.accuracy}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 px-3 border-purple-200 text-purple-700 hover:bg-purple-50"
                      onClick={() => onSendToChat?.(drill.prompt)}
                    >
                      Launch in Chat →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
