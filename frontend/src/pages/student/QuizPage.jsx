import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QuestionCard } from '../../components/quiz/QuestionCard';
import { QuizTimer } from '../../components/quiz/QuizTimer';
import { QuizProgress } from '../../components/quiz/QuizProgress';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { LoadingState } from '../../components/ui/LoadingState';
import { useSelector, useDispatch } from 'react-redux';
import { fetchQuizById, submitQuizAttempt } from '../../store/slices/quizSlice';
import { useToast } from '../../hooks/useToast';
import { ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';

export function QuizPage() {
  const { quizId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentQuiz: quiz, isLoading, isSubmitting } = useSelector((state) => state.quiz);
  const { success: toastSuccess, warning: toastWarning } = useToast();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (quizId) {
      dispatch(fetchQuizById(quizId));
    }
  }, [dispatch, quizId]);

  if (isLoading || !quiz) {
    return <LoadingState message="Preparing diagnostic assessment questions..." />;
  }

  const questions = quiz.questions || [];
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;

  const handleSelectOption = (optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setShowConfirmModal(false);
    const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);
    const res = await dispatch(
      submitQuizAttempt({
        quizId: quiz.id,
        answers,
        timeSpentSeconds,
      })
    );

    if (res.meta?.requestStatus === 'fulfilled') {
      toastSuccess('Assessment Submitted', 'Generating adaptive topic analysis...');
      navigate(`/quiz/${quiz.id}/results`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={ArrowLeft}
            onClick={() => navigate(-1)}
          >
            Exit Quiz
          </Button>
          <div className="h-4 w-px bg-slate-200" />
          <h1 className="text-sm font-bold text-slate-900 truncate">{quiz.title}</h1>
        </div>

        <QuizTimer
          initialSeconds={quiz.timeLimitSeconds || 600}
          onTimeUp={() => {
            toastWarning('Time Expired', 'Submitting your completed answers automatically...');
            handleSubmitQuiz();
          }}
        />
      </div>

      {/* Progress Strip */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <QuizProgress
          current={currentIndex + 1}
          total={totalQuestions}
          answeredCount={answeredCount}
        />
      </div>

      {/* Question Card */}
      <QuestionCard
        question={currentQuestion}
        selectedOption={answers[currentQuestion?.id]}
        onSelectOption={handleSelectOption}
        index={currentIndex}
      />

      {/* Question Navigation Footer */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="md"
          leftIcon={ChevronLeft}
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {currentIndex < totalQuestions - 1 ? (
            <Button
              variant="primary"
              size="md"
              rightIcon={ChevronRight}
              onClick={handleNext}
            >
              Next Question
            </Button>
          ) : (
            <Button
              variant="success"
              size="md"
              rightIcon={CheckCircle2}
              onClick={() => setShowConfirmModal(true)}
              isLoading={isSubmitting}
            >
              Submit Assessment
            </Button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Submit Assessment?"
        description="Are you ready to submit your answers and generate your adaptive diagnosis?"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl text-xs space-y-1">
            <p className="text-slate-700">
              Answered Questions: <strong className="text-slate-900">{answeredCount}</strong> of {totalQuestions}
            </p>
            {answeredCount < totalQuestions && (
              <p className="text-amber-600 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                You have {totalQuestions - answeredCount} unanswered questions.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setShowConfirmModal(false)}>
              Keep Reviewing
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmitQuiz}
              isLoading={isSubmitting}
            >
              Confirm & Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
