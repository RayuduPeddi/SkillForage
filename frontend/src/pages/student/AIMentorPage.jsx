import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchSessions,
  createNewSession,
  deleteSession,
  setActiveSessionId,
  sendAiMessage,
  addSavedNote,
} from '../../store/slices/aiMentorSlice';
import { useAdaptiveEngine } from '../../hooks/useAdaptiveEngine';
import { useToast } from '../../hooks/useToast';
import { ChatInterface } from '../../components/ai/ChatInterface';
import { WeakConceptsQuestionsPanel } from '../../components/ai/WeakConceptsQuestionsPanel';
import { Button } from '../../components/ui/Button';
import {
  Plus,
  MessageSquare,
  Search,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export function AIMentorPage() {
  const dispatch = useDispatch();
  const {
    sessions = [],
    activeSessionId,
    isTyping,
  } = useSelector((state) => state.aiMentor);

  const { weakTopics, strongTopics, overallMastery } = useAdaptiveEngine();
  const { success: toastSuccess, info: toastInfo } = useToast();

  const [isSessionsOpen, setIsSessionsOpen] = useState(true);
  const [isQuestionsOpen, setIsQuestionsOpen] = useState(true);
  const [sessionSearch, setSessionSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('Prefix Sum');
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    dispatch(fetchSessions());
  }, [dispatch]);

  useEffect(() => {
    const updateViewMode = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobileView(mobile);
      if (mobile) {
        setIsSessionsOpen(false);
        setIsQuestionsOpen(false);
      } else {
        setIsSessionsOpen(true);
        setIsQuestionsOpen(true);
      }
    };

    updateViewMode();
    window.addEventListener('resize', updateViewMode);
    return () => window.removeEventListener('resize', updateViewMode);
  }, []);

  const openSessionsPanel = () => {
    setIsSessionsOpen(true);
    if (isMobileView) {
      setIsQuestionsOpen(false);
    }
  };

  const openQuestionsPanel = () => {
    setIsQuestionsOpen(true);
    if (isMobileView) {
      setIsSessionsOpen(false);
    }
  };

  const closeMobilePanels = () => {
    if (isMobileView) {
      setIsSessionsOpen(false);
      setIsQuestionsOpen(false);
    }
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const messages = activeSession?.messages || [];

  const handleCreateNewChat = (topic = 'Prefix Sum', title = '') => {
    dispatch(createNewSession({ topic, title }));
    setSelectedTopic(topic);
    toastSuccess('New Chat Initialized', `Started a fresh mentor session for ${topic}.`);
  };

  const handleDeleteSession = (e, sessionId) => {
    e.stopPropagation();
    dispatch(deleteSession(sessionId));
    toastInfo('Session Deleted', 'Conversation was removed.');
  };

  const handleSendMessage = (messageText, replyTo = null, persona = 'direct', codeAttachment = null) => {
    const studentContext = {
      overallMastery,
      currentTopic: selectedTopic,
      weakTopics: weakTopics.map((w) => `${w.topic} (${w.accuracy}%)`),
      strongTopics: strongTopics.map((s) => `${s.topic} (${s.accuracy}%)`),
    };

    dispatch(
      sendAiMessage({
        message: messageText,
        context: studentContext,
        replyTo,
        persona,
        codeAttachment,
      })
    );
  };

  const handleClearActiveChat = () => {
    if (activeSession) {
      handleCreateNewChat(selectedTopic, `Fresh ${selectedTopic} Discussion`);
    }
  };

  const handleSaveNote = (message) => {
    dispatch(
      addSavedNote({
        id: `note_${Date.now()}`,
        title: `AI Explanation: ${selectedTopic}`,
        snippet: message.text?.slice(0, 180) + '...',
        fullText: message.text,
        topic: selectedTopic,
        savedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      })
    );
    toastSuccess('Note Saved', 'Saved explanation to your notebook.');
  };

  const filteredSessions = sessions.filter(
    (s) =>
      s.title?.toLowerCase().includes(sessionSearch.toLowerCase()) ||
      s.topic?.toLowerCase().includes(sessionSearch.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-4rem)] w-full flex overflow-hidden bg-white relative">
      {isMobileView && (isSessionsOpen || isQuestionsOpen) && (
        <button
          type="button"
          onClick={closeMobilePanels}
          className="fixed inset-0 z-20 bg-slate-950/30 backdrop-blur-sm lg:hidden"
          aria-label="Close mobile panel"
        />
      )}
      {/* 1. LEFT SESSIONS SIDEBAR (Collapsible) */}
      <div
        className={cn(
          'bg-slate-50/90 border-r border-slate-200/90 flex flex-col shrink-0 transition-all duration-200 z-20',
          isSessionsOpen
            ? 'fixed inset-0 z-30 w-full lg:static lg:w-full xl:w-72 bg-slate-50/95 lg:bg-slate-50/90'
            : 'w-0 border-r-0 overflow-hidden lg:w-full'
        )}
      >
        {/* Top + New Session Button */}
        <div className="p-3.5 border-b border-slate-200/80 flex items-center gap-2 shrink-0">
          <Button
            variant="primary"
            size="sm"
            leftIcon={Plus}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs h-9 rounded-xl shadow-xs"
            onClick={() => handleCreateNewChat(selectedTopic)}
          >
            New Chat
          </Button>

          <button
            type="button"
            onClick={() => {
              setIsSessionsOpen(false);
              closeMobilePanels();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors lg:hidden"
            title="Collapse sessions list"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Search Session Bar */}
        <div className="px-3.5 py-2.5 border-b border-slate-200/80 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={sessionSearch}
              onChange={(e) => setSessionSearch(e.target.value)}
              placeholder="Search chat history..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
            />
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Chat History
          </div>

          {filteredSessions.length > 0 ? (
            filteredSessions.map((sess) => {
              const isActive = sess.id === activeSessionId;
              return (
                <div
                  key={sess.id}
                  onClick={() => {
                    dispatch(setActiveSessionId(sess.id));
                    setSelectedTopic(sess.topic || 'Prefix Sum');
                  }}
                  className={cn(
                    'group p-2.5 rounded-xl text-xs cursor-pointer transition-all flex items-center justify-between gap-2',
                    isActive
                      ? 'bg-white border border-purple-200 text-purple-950 font-bold shadow-xs'
                      : 'hover:bg-white/80 text-slate-700 border border-transparent'
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <MessageSquare
                      className={cn(
                        'w-3.5 h-3.5 shrink-0',
                        isActive ? 'text-purple-600' : 'text-slate-400 group-hover:text-slate-600'
                      )}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold">{sess.title}</p>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {sess.topic}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteSession(e, sess.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded transition-all"
                    title="Delete session"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-slate-400 text-xs">No previous chats</div>
          )}
        </div>
      </div>

      {/* Floating Toggle for Sessions Sidebar when closed */}
      {!isSessionsOpen && (
        <button
          type="button"
          onClick={openSessionsPanel}
          className="fixed left-4 top-20 z-30 p-2 rounded-xl bg-white border border-slate-200 shadow-md text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors lg:hidden"
          title="Open chat history sidebar"
        >
          <PanelLeftOpen className="w-4 h-4" />
        </button>
      )}

      {/* 2. CENTER: FULL PAGE CLEAR CHAT INTERFACE */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {isMobileView && (
          <div className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-3 flex items-center gap-2 lg:hidden">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs font-semibold"
              onClick={openSessionsPanel}
            >
              Chat History
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs font-semibold"
              onClick={openQuestionsPanel}
            >
              Weak Topics
            </Button>
          </div>
        )}
        <ChatInterface
          messages={messages}
          isTyping={isTyping}
          onSendMessage={handleSendMessage}
          onClearChat={handleClearActiveChat}
          onNewChat={handleCreateNewChat}
          onSaveNote={handleSaveNote}
          context={{ overallMastery, currentTopic: selectedTopic }}
          selectedTopic={selectedTopic}
          onSelectTopic={setSelectedTopic}
        />
      </div>

      {/* 3. RIGHT: WEAK CONCEPTS & SUGGESTED QUESTIONS PANEL */}
      <div
        className={cn(
          'transition-all duration-200 shrink-0 h-full z-20',
          isQuestionsOpen
            ? 'fixed inset-0 right-0 z-30 w-full xl:static xl:w-full 2xl:w-96 bg-white lg:bg-transparent'
            : 'w-0 overflow-hidden xl:w-0'
        )}
      >
        {isQuestionsOpen && (
          <WeakConceptsQuestionsPanel
            weakTopics={weakTopics}
            currentTopic={selectedTopic}
            onSelectTopic={(t) => {
              setSelectedTopic(t);
              toastSuccess('Topic Switched', `AI Mentor focus switched to ${t}.`);
            }}
            onAskQuestion={(question) => {
              if (isMobileView) {
                setIsQuestionsOpen(false);
              }
              handleSendMessage(question);
            }}
            isOpen={isQuestionsOpen}
            onToggleOpen={() => {
              setIsQuestionsOpen(false);
              if (isMobileView) closeMobilePanels();
            }}
          />
        )}
      </div>

      {/* Floating Toggle for Right Questions Panel when closed */}
      {!isQuestionsOpen && (
        <button
          type="button"
          onClick={openQuestionsPanel}
          className="fixed right-4 top-20 z-30 p-2.5 rounded-xl bg-white border border-slate-200 shadow-lg text-purple-700 hover:bg-purple-50 transition-colors flex items-center gap-1.5 text-xs font-bold"
          title="View Weak Concepts & Questions"
        >
          <PanelRightOpen className="w-4 h-4" />
          <span className="hidden sm:inline">Weak Concepts & Questions</span>
        </button>
      )}
    </div>
  );
}
