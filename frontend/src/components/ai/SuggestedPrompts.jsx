import React from 'react';
import { Sparkles } from 'lucide-react';
import { AI_STARTER_PROMPTS } from '../../services/mockData';

export function SuggestedPrompts({ onSelectPrompt }) {
  return (
    <div className="space-y-2">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-purple-600" />
        Suggested Prompts
      </span>

      <div className="flex flex-wrap gap-2">
        {AI_STARTER_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt(prompt)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-all hover:border-slate-300 shadow-xs text-left"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
