import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Loader2,
  RotateCcw,
  Reply,
  X,
  Code2,
  Download,
  Plus,
  FileCode,
  Check,
  Brain,
  Zap,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MessageItem } from './MessageItem';
import { cn } from '../../utils/cn';

export function ChatInterface({
  messages = [],
  isTyping = false,
  onSendMessage,
  onClearChat,
  onNewChat,
  onSaveNote,
  onSendToPlayground,
  context = {},
  selectedTopic = 'Prefix Sum',
  onSelectTopic,
  className = '',
}) {
  const [input, setInput] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [showCodeDrawer, setShowCodeDrawer] = useState(false);
  const [attachedCode, setAttachedCode] = useState('');
  const [attachedLang, setAttachedLang] = useState('python');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if ((!input.trim() && !attachedCode.trim()) || isTyping) return;

    const messageText = input.trim() || (attachedCode ? `Review my ${attachedLang} code:` : '');
    const codeAttachment = attachedCode.trim() ? { code: attachedCode.trim(), language: attachedLang } : null;

    onSendMessage(messageText, replyingTo, 'direct', codeAttachment);
    setInput('');
    setReplyingTo(null);
    setAttachedCode('');
    setShowCodeDrawer(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handlePromptSelect = (prompt) => {
    onSendMessage(prompt, replyingTo, 'direct', null);
    setReplyingTo(null);
  };

  const handleReplyClick = (msg) => {
    setReplyingTo(msg);
    inputRef.current?.focus();
  };

  const handleExportChat = () => {
    const textData = messages
      .map((m) => `[${m.sender.toUpperCase()} - ${m.timestamp}]\n${m.text}\n`)
      .join('\n----------------------------------------\n');
    const blob = new Blob([textData], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkillForage_AI_Mentor_${context.currentTopic || 'Session'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const starterPrompts = [
    {
      icon: Zap,
      color: 'rose',
      title: 'Prefix Sum Intuition & Proof',
      desc: 'Understand 1-based indexing, range queries O(1), and boundary bugs.',
      prompt: 'Explain the 1-based Prefix Sum technique simply with Python code and proof.',
    },
    {
      icon: Brain,
      color: 'amber',
      title: 'Analyze Diagnostic Weaknesses',
      desc: 'Break down why accuracy dropped on recent quizzes and how to improve.',
      prompt: 'Why am I struggling with Prefix Sum (43%) and HashMap (52%)? Analyze my diagnostic gaps.',
    },
    {
      icon: Code2,
      color: 'purple',
      title: 'Subarray Sum Equals K',
      desc: 'Optimal hash map prefix difference approach explained step by step.',
      prompt: 'Explain how HashMaps pair with Prefix Sum for "Subarray Sum Equals K" in O(N) time.',
    },
    {
      icon: BookOpen,
      color: 'blue',
      title: '5-Day Revision Strategy',
      desc: 'Targeted daily revision schedule for algorithmic interview readiness.',
      prompt: 'Create a 5-day personalized revision blueprint targeting my current weak topics.',
    },
  ];

  return (
    <div className={cn('flex flex-col h-full bg-white overflow-hidden', className)}>
      {/* 1. TOP HEADER BAR */}
      <div className="h-16 px-6 bg-white border-b border-slate-200/90 flex items-center justify-between gap-4 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-brand-600 flex items-center justify-center text-white shadow-md shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">AI Academic Mentor</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Adaptive Sync Active
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Personalized tutoring • Target Topic: <strong className="text-purple-700 font-semibold">{context.currentTopic || selectedTopic || 'Prefix Sum'}</strong>
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          {onNewChat && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={Plus}
              onClick={() => onNewChat(selectedTopic)}
              className="text-xs font-semibold"
            >
              New Chat
            </Button>
          )}

          <button
            type="button"
            onClick={handleExportChat}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Export conversation as Markdown"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onClearChat}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Reset this conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. MAIN CONVERSATION STREAM (Centered, Spacious, Clean) */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
          {/* If no messages yet, show welcoming hero with starter prompts */}
          {messages.length === 0 ? (
            <div className="py-8 sm:py-12 text-center space-y-6 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 to-brand-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-purple-200">
                <Sparkles className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  How can I help your learning today?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  I'm your dedicated AI Academic Mentor. Ask for algorithmic proofs, code debugging, intuition breakdowns, or diagnostic remediation.
                </p>
              </div>

              {/* Starter Suggestion Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 text-left max-w-2xl mx-auto">
                {starterPrompts.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePromptSelect(item.prompt)}
                      className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-purple-300 hover:shadow-md transition-all group flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <div
                          className={cn(
                            'p-2 rounded-xl text-white shadow-2xs',
                            item.color === 'rose'
                              ? 'bg-rose-500'
                              : item.color === 'amber'
                              ? 'bg-amber-500'
                              : item.color === 'purple'
                              ? 'bg-purple-600'
                              : 'bg-brand-600'
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-900 text-xs group-hover:text-purple-700 transition-colors">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                        {item.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            // Message List
            messages.map((msg) => (
              <MessageItem
                key={msg.id}
                message={msg}
                onActionClick={handlePromptSelect}
                onReplyClick={handleReplyClick}
                onSaveNote={onSaveNote}
                onSendToPlayground={onSendToPlayground}
              />
            ))
          )}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-3 text-xs text-slate-500 animate-in fade-in">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2.5 p-3.5 bg-white border border-slate-200 rounded-2xl shadow-card">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                <span className="font-medium">Synthesizing personalized explanation & code proofs...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 3. BOTTOM INPUT WORKSPACE (Centered & Clear) */}
      <div className="border-t border-slate-200/90 bg-white p-4 shrink-0 shadow-xs z-10">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Reply Preview if active */}
          {replyingTo && (
            <div className="px-3.5 py-2 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between text-xs text-purple-950 animate-in fade-in">
              <div className="flex items-center gap-2 truncate">
                <Reply className="w-3.5 h-3.5 text-purple-600 rotate-180 shrink-0" />
                <span className="font-bold">Replying to {replyingTo.sender === 'ai' ? 'AI Mentor' : 'yourself'}:</span>
                <span className="truncate italic text-purple-800">
                  "{replyingTo.text?.slice(0, 80)}..."
                </span>
              </div>
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                className="p-1 text-purple-500 hover:text-purple-900 rounded transition-colors ml-2"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Attached Code Drawer if toggled */}
          {showCodeDrawer && (
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 space-y-2 animate-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1.5 text-purple-300">
                  <FileCode className="w-4 h-4" />
                  Attach Code for AI Review
                </span>
                <div className="flex items-center gap-2">
                  <select
                    value={attachedLang}
                    onChange={(e) => setAttachedLang(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 font-mono"
                  >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowCodeDrawer(false)}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <textarea
                rows={3}
                value={attachedCode}
                onChange={(e) => setAttachedCode(e.target.value)}
                placeholder="Paste code function, logic, or bug here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 leading-relaxed"
              />
            </div>
          )}

          {/* Main Input Bar */}
          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2.5 bg-slate-50 border border-slate-200/90 rounded-2xl p-2.5 focus-within:bg-white focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition-all"
          >
            {/* Code Attachment Toggle */}
            <button
              type="button"
              onClick={() => setShowCodeDrawer(!showCodeDrawer)}
              className={cn(
                'p-2.5 rounded-xl border transition-colors shrink-0',
                showCodeDrawer || attachedCode
                  ? 'bg-purple-100 text-purple-700 border-purple-300'
                  : 'bg-white text-slate-500 hover:text-slate-900 border-slate-200'
              )}
              title="Attach code snippet for AI review"
            >
              <Code2 className="w-4 h-4" />
            </button>

            {/* Input Field */}
            <div className="flex-1 min-w-0">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask AI Mentor any algorithmic question or concept..."
                className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 rounded-xl"
                disabled={isTyping}
              />
            </div>

            {/* Send Button */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={(!input.trim() && !attachedCode.trim()) || isTyping}
              leftIcon={Send}
              className="h-10 px-5 rounded-xl shrink-0 font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
            >
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
