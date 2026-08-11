import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Textarea';
import { PlusCircle, HelpCircle, Search, Trash2 } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export function QuestionBank() {
  const { success: toastSuccess } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questions, setQuestions] = useState([
    {
      id: 'qb_1',
      topic: 'Prefix Sum',
      difficulty: 'Intermediate',
      question: 'What is the space complexity of a 2D prefix sum table of an M x N matrix?',
      correctAnswer: 'O(M * N)',
    },
    {
      id: 'qb_2',
      topic: 'HashMap & Sets',
      difficulty: 'Easy',
      question: 'What is the average time complexity of insertion into a Hash Table?',
      correctAnswer: 'O(1) amortized',
    },
    {
      id: 'qb_3',
      topic: 'Two Pointer',
      difficulty: 'Intermediate',
      question: 'Can two pointers be used to solve 3Sum in O(N^2) time?',
      correctAnswer: 'Yes, by sorting first and fixing one element',
    },
  ]);

  const [newQuestion, setNewQuestion] = useState({
    topic: 'Prefix Sum',
    difficulty: 'Intermediate',
    question: '',
    correctAnswer: '',
  });

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.question) return;
    setQuestions([...questions, { ...newQuestion, id: `qb_${Date.now()}` }]);
    setIsModalOpen(false);
    setNewQuestion({ topic: 'Prefix Sum', difficulty: 'Intermediate', question: '', correctAnswer: '' });
    toastSuccess('Question Added', 'The question was saved to the cohort diagnostic bank.');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Diagnostic Question Bank</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Author and categorize questions evaluated during adaptive diagnostic quizzes.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={PlusCircle}
          onClick={() => setIsModalOpen(true)}
        >
          Add New Question
        </Button>
      </div>

      <div className="space-y-3">
        {questions.map((q) => (
          <Card key={q.id} className="p-4 sm:p-5 border-slate-200 shadow-xs flex items-start justify-between gap-4">
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <Badge variant="primary" size="sm">
                  {q.topic}
                </Badge>
                <Badge variant="outline" size="sm">
                  {q.difficulty}
                </Badge>
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-slate-900">{q.question}</h3>
              <p className="text-xs text-emerald-700 font-mono">Answer: {q.correctAnswer}</p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-rose-600 hover:bg-rose-50"
              onClick={() => {
                setQuestions(questions.filter((x) => x.id !== q.id));
                toastSuccess('Deleted', 'Question removed from question bank.');
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </Card>
        ))}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Diagnostic Question"
        description="Tag by topic and difficulty for the adaptive engine."
      >
        <form onSubmit={handleAddQuestion} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Topic"
              value={newQuestion.topic}
              onChange={(e) => setNewQuestion({ ...newQuestion, topic: e.target.value })}
              options={[
                { value: 'Prefix Sum', label: 'Prefix Sum' },
                { value: 'HashMap & Sets', label: 'HashMap & Sets' },
                { value: 'Two Pointer', label: 'Two Pointer' },
                { value: 'Sliding Window', label: 'Sliding Window' },
                { value: 'Trees & BST', label: 'Trees & BST' },
              ]}
            />
            <Select
              label="Difficulty"
              value={newQuestion.difficulty}
              onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
              options={[
                { value: 'Easy', label: 'Easy' },
                { value: 'Intermediate', label: 'Intermediate' },
                { value: 'Hard', label: 'Hard' },
              ]}
            />
          </div>

          <Textarea
            label="Question Prompt"
            value={newQuestion.question}
            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
            placeholder="Type the problem question..."
            required
          />

          <Input
            label="Correct Explanation / Answer"
            value={newQuestion.correctAnswer}
            onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
            placeholder="Key concept explanation"
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Question
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
