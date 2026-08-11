import React, { useState } from 'react';
import { ChevronDown, ChevronUp, PlayCircle, CheckCircle2, FileQuestion, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';

export function ModuleAccordion({
  modules = [],
  currentLessonId,
  onSelectLesson,
  interactive = true,
}) {
  // Open active module by default
  const [openModuleIds, setOpenModuleIds] = useState(() => {
    const activeMod = modules.find((m) => m.lessons?.some((l) => l.id === currentLessonId));
    return activeMod ? [activeMod.id] : [modules[0]?.id];
  });

  const toggleModule = (moduleId) => {
    setOpenModuleIds((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  return (
    <div className="space-y-3">
      {modules.map((module, index) => {
        const isOpen = openModuleIds.includes(module.id);
        const totalLessons = module.lessons?.length || 0;
        const completedCount = module.lessons?.filter((l) => l.completed).length || 0;

        return (
          <div
            key={module.id || index}
            className="border border-slate-200/90 rounded-xl bg-white overflow-hidden shadow-xs transition-all"
          >
            {/* Header */}
            <button
              type="button"
              onClick={() => toggleModule(module.id)}
              className="w-full px-4 py-3.5 flex items-center justify-between bg-slate-50/50 hover:bg-slate-100/50 text-left transition-colors"
            >
              <div className="space-y-0.5 pr-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 tracking-tight">{module.title}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                  <span>{module.duration || '2h 15m'}</span>
                  <span>•</span>
                  <span>
                    {completedCount}/{totalLessons} completed
                  </span>
                </div>
              </div>

              <div className="text-slate-400">
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {/* Lesson List */}
            {isOpen && (
              <div className="divide-y divide-slate-100 border-t border-slate-100">
                {module.lessons?.map((lesson) => {
                  const isCurrent = lesson.id === currentLessonId;
                  const isQuiz = lesson.type === 'quiz' || !!lesson.quizId;

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => interactive && onSelectLesson && onSelectLesson(lesson)}
                      className={cn(
                        'px-4 py-3 flex items-center justify-between text-xs transition-colors',
                        interactive && 'cursor-pointer hover:bg-slate-50',
                        isCurrent && 'bg-brand-50/70 border-l-4 border-l-brand-600 font-semibold text-brand-900',
                        !isCurrent && 'text-slate-700'
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        {lesson.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : isQuiz ? (
                          <FileQuestion className="w-4 h-4 text-amber-500 shrink-0" />
                        ) : (
                          <PlayCircle
                            className={cn('w-4 h-4 shrink-0', isCurrent ? 'text-brand-600' : 'text-slate-400')}
                          />
                        )}
                        <span className="truncate">{lesson.title}</span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono shrink-0">
                        {isQuiz ? (
                          <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-medium">Quiz</span>
                        ) : (
                          <span>{lesson.duration}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
