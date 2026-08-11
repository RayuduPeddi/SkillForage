import React, { useState } from 'react';
import {
  Bot,
  User,
  Copy,
  Check,
  Reply,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Bookmark,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Code2,
  Terminal,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export function MessageItem({ message, onActionClick, onReplyClick, onSaveNote, onSendToPlayground }) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'like' | 'dislike'
  const [isSaved, setIsSaved] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);

  const isAi = message.sender === 'ai';

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    setIsSaved(true);
    onSaveNote?.(message);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      // Simulate reading audio duration
      setTimeout(() => {
        setIsPlayingAudio(false);
      }, 5000);
    }
  };

  // Helper to render text with markdown code blocks, bold text, headers, and bullet points
  const renderFormattedContent = (content) => {
    if (!content) return null;

    const lines = content.split('\n');
    const elements = [];
    let inCodeBlock = false;
    let codeContent = [];
    let codeLanguage = '';

    lines.forEach((line, index) => {
      // Code block detection
      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.trim().replace('```', '') || 'python';
          codeContent = [];
        } else {
          inCodeBlock = false;
          const fullCode = codeContent.join('\n');
          elements.push(
            <div key={`code-${index}`} className="my-3.5 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 text-xs font-mono shadow-md">
              <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 font-semibold text-purple-300">
                  <Code2 className="w-3.5 h-3.5 text-purple-400" />
                  {codeLanguage.toUpperCase()}
                </span>
                <div className="flex items-center gap-2">
                  {onSendToPlayground && (
                    <button
                      type="button"
                      onClick={() => onSendToPlayground(fullCode, codeLanguage)}
                      className="flex items-center gap-1 text-purple-300 hover:text-white px-2 py-0.5 rounded bg-purple-950/60 hover:bg-purple-900/80 border border-purple-800/80 transition-colors"
                      title="Load into Live Code Playground"
                    >
                      <Terminal className="w-3 h-3" />
                      <span>Send to Playground</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleCopy(fullCode)}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>
              <pre className="p-3.5 overflow-x-auto whitespace-pre leading-relaxed text-slate-200 selection:bg-purple-900">
                {fullCode}
              </pre>
            </div>
          );
          codeContent = [];
        }
        return;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return;
      }

      // Headers
      if (line.startsWith('### ')) {
        elements.push(
          <h4 key={`h3-${index}`} className="font-bold text-base text-slate-900 mt-3 mb-1.5 flex items-center gap-1.5">
            {line.replace('### ', '')}
          </h4>
        );
        return;
      }
      if (line.startsWith('## ')) {
        elements.push(
          <h3 key={`h2-${index}`} className="font-bold text-lg text-slate-900 mt-4 mb-2">
            {line.replace('## ', '')}
          </h3>
        );
        return;
      }

      // Unordered List item
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        elements.push(
          <li key={`li-${index}`} className="ml-4 list-disc text-slate-700 leading-relaxed text-sm sm:text-base my-0.5">
            {renderInlineMarkdown(line.trim().replace(/^[-*]\s+/, ''))}
          </li>
        );
        return;
      }

      // Ordered List item
      if (/^\d+\.\s/.test(line.trim())) {
        elements.push(
          <div key={`ol-${index}`} className="ml-2 font-medium text-slate-800 leading-relaxed text-sm sm:text-base my-1">
            {renderInlineMarkdown(line.trim())}
          </div>
        );
        return;
      }

      // Empty space
      if (!line.trim()) {
        elements.push(<div key={`space-${index}`} className="h-2" />);
        return;
      }

      // Normal paragraph
      elements.push(
        <p key={`p-${index}`} className="leading-relaxed text-sm sm:text-base text-slate-700">
          {renderInlineMarkdown(line)}
        </p>
      );
    });

    return elements;
  };

  // Helper for inline `code` and **bold**
  const renderInlineMarkdown = (text) => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-purple-700 font-mono text-xs sm:text-sm font-semibold border border-slate-200">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div
      className={cn(
        'flex gap-3 max-w-4xl animate-in fade-in duration-150',
        isAi ? 'mr-auto w-full' : 'ml-auto flex-row-reverse max-w-2xl'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold shadow-xs transition-transform',
          isAi ? 'bg-purple-600 text-white shadow-purple-200' : 'bg-brand-600 text-white shadow-brand-200'
        )}
      >
        {isAi ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
      </div>

      {/* Bubble Container */}
      <div className="space-y-2 flex-1 min-w-0">
        {/* Reply Quote Banner if present */}
        {message.replyTo && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200/70 border border-slate-300/80 text-xs text-slate-600 max-w-md">
            <Reply className="w-3.5 h-3.5 text-slate-400 rotate-180 shrink-0" />
            <span className="font-semibold">{message.replyTo.sender === 'ai' ? 'AI Mentor' : 'You'}:</span>
            <span className="truncate italic">"{message.replyTo.text}"</span>
          </div>
        )}

        {/* User Code Attachment Preview if present */}
        {!isAi && message.codeAttachment && (
          <div className="p-3 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono border border-slate-800">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-[10px] text-slate-400">
              <span>Attached Code: {message.codeAttachment.language}</span>
              <Code2 className="w-3.5 h-3.5 text-brand-400" />
            </div>
            <pre className="max-h-32 overflow-y-auto whitespace-pre leading-relaxed">
              {message.codeAttachment.code}
            </pre>
          </div>
        )}

        {/* Adaptive Context Tag for AI responses */}
        {isAi && message.adaptiveContext && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs">
              <Sparkles className="w-3 h-3 text-purple-600" />
              Focus: {message.adaptiveContext.topic} ({message.adaptiveContext.mastery}) • {message.adaptiveContext.difficulty}
            </span>
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={cn(
            'p-5 sm:p-6 rounded-2xl leading-relaxed shadow-card transition-all',
            isAi
              ? 'bg-white border border-slate-200/90 text-slate-800'
              : 'bg-brand-600 text-white font-medium ml-auto rounded-tr-xs text-sm sm:text-base'
          )}
        >
          {isAi ? (
            <div className="space-y-2.5">{renderFormattedContent(message.text)}</div>
          ) : (
            <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">{message.text}</p>
          )}

          {/* Embedded In-Chat Interactive Quiz if present */}
          {isAi && message.interactiveQuiz && (
            <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-purple-50/60 border border-purple-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-purple-600" />
                  Interactive Checkpoint
                </span>
                <span className="text-[11px] font-semibold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                  Adaptive Auto-Score
                </span>
              </div>

              <p className="text-sm font-bold text-slate-900">
                {message.interactiveQuiz.question}
              </p>

              <div className="space-y-2">
                {message.interactiveQuiz.options.map((opt) => {
                  const isSelected = selectedQuizOption?.id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedQuizOption(opt)}
                      className={cn(
                        'w-full text-left p-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-between gap-2',
                        isSelected
                          ? opt.isCorrect
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold'
                            : 'bg-rose-50 border-rose-500 text-rose-950 font-semibold'
                          : 'bg-white border-slate-200 hover:border-purple-300 text-slate-800'
                      )}
                    >
                      <span>{opt.text}</span>
                      {isSelected && (
                        opt.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedQuizOption && (
                <div className={cn(
                  'p-3.5 rounded-xl text-sm leading-relaxed',
                  selectedQuizOption.isCorrect ? 'bg-emerald-100 text-emerald-900 font-medium' : 'bg-rose-100 text-rose-900 font-medium'
                )}>
                  {selectedQuizOption.explanation}
                </div>
              )}
            </div>
          )}

          {/* Action Toolbar on AI bubble */}
          {isAi && (
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-slate-500 text-xs sm:text-sm">
              <div className="flex items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => onReplyClick?.(message)}
                  className="flex items-center gap-1.5 hover:text-brand-600 font-semibold transition-colors"
                  title="Reply / Quote this response"
                >
                  <Reply className="w-4 h-4" />
                  <span>Reply</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(message.text)}
                  className="flex items-center gap-1.5 hover:text-slate-800 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center gap-1.5 hover:text-purple-600 transition-colors"
                  title="Save to My Learning Notes"
                >
                  <Bookmark className={cn('w-4 h-4', isSaved ? 'text-purple-600 fill-purple-600' : '')} />
                  <span>{isSaved ? 'Saved!' : 'Save Note'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleAudio}
                  className={cn(
                    'flex items-center gap-1.5 transition-colors',
                    isPlayingAudio ? 'text-purple-600 font-bold' : 'hover:text-purple-600'
                  )}
                  title="Listen to explanation"
                >
                  {isPlayingAudio ? <VolumeX className="w-4 h-4 text-purple-600" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isPlayingAudio ? 'Reading...' : 'Listen'}</span>
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setFeedback('like')}
                  className={cn(
                    'p-1.5 rounded-lg hover:bg-slate-100 transition-colors',
                    feedback === 'like' ? 'text-emerald-600 bg-emerald-50' : 'hover:text-slate-700'
                  )}
                  title="Helpful response"
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setFeedback('dislike')}
                  className={cn(
                    'p-1.5 rounded-lg hover:bg-slate-100 transition-colors',
                    feedback === 'dislike' ? 'text-rose-600 bg-rose-50' : 'hover:text-slate-700'
                  )}
                  title="Needs improvement"
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Actions Strip */}
        {message.suggestedActions && message.suggestedActions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-0.5">
            {message.suggestedActions.map((action, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onActionClick?.(action)}
                className="px-3.5 py-1.5 rounded-full bg-purple-50/90 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-medium transition-all shadow-2xs text-left flex items-center gap-1.5 hover:border-purple-300"
              >
                <span>{action}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
