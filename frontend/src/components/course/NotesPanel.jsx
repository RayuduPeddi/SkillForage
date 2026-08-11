import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { learningService } from '../../services/learningService';
import { Save, Check, FileText } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export function NotesPanel({ lessonId }) {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { success } = useToast();

  useEffect(() => {
    async function loadNotes() {
      if (!lessonId) return;
      const existing = await learningService.getNotes(lessonId);
      setContent(existing || '');
      setSaved(false);
    }
    loadNotes();
  }, [lessonId]);

  const handleSave = async () => {
    if (!lessonId) return;
    setIsSaving(true);
    await learningService.saveNotes(lessonId, content);
    setIsSaving(false);
    setSaved(true);
    success('Notes Saved', 'Your personal lesson notes have been securely stored.');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-card space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
          <FileText className="w-4 h-4 text-brand-600" />
          <span>My Personal Lesson Notes</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          isLoading={isSaving}
          leftIcon={saved ? Check : Save}
        >
          {saved ? 'Saved' : 'Save Notes'}
        </Button>
      </div>

      <Textarea
        placeholder="Record your thoughts, edge-case reminders, or complexity formulas here..."
        rows={6}
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setSaved(false);
        }}
        className="font-mono text-xs leading-relaxed"
      />
    </div>
  );
}
