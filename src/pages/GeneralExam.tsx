import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  XCircle,
  ChevronRight,
  Award,
  Clock,
  BookOpen,
  Target,
  Lightbulb,
  RotateCcw,
  ArrowLeft,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { generalExam } from '../data/generalExam';
import AppSidebar from '../components/AppSidebar';
import MobileMenuHeader from '../components/MobileMenuHeader';
import { SidebarProvider } from '../contexts/SidebarContext';

export default function GeneralExam() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const totalQuestions = generalExam.questions.length;
  const minScoreToPass = Math.ceil(totalQuestions * 0.6); // 60% minimum
  const currentQuestion = generalExam.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login');
      } else {
        setUserId(session.user.id);
        setUserEmail(session.user.email ?? null);
        const fullName = session.user.user_metadata?.full_name;
        if (fullName) setUserName(fullName);
        else if (session.user.email) setUserName(session.user.email.split('@')[0]);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!s) navigate('/login');
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleAnswer = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionIndex }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < generalExam.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate score and show results
      const correctAnswers = Object.entries(answers).reduce((acc, [qIdx, answer]) => {
        if (generalExam.questions[parseInt(qIdx)].correctAnswer === answer) {
          return acc + 1;
        }
        return acc;
      }, 0);
      setScore(correctAnswers);
      setShowResults(true);

      // Save exam result to database (each attempt creates a new row)
      if (userId) {
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        const passed = percentage >= 60;
        supabase
          .from('general_exam_results')
          .insert({
            user_id: userId,
            score: correctAnswers,
            total_questions: totalQuestions,
            percentage: percentage,
            passed: passed,
            completed_at: new Date().toISOString(),
            answers: answers,
          })
          .then(({ error }) => {
            if (error) console.error('Error saving exam result:', error);
          });
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  return (
    <SidebarProvider>
      <div className="app-layout">
        <MobileMenuHeader />
        <AppSidebar
          userName={userName}
          userEmail={userEmail}
          onLogout={handleLogout}
          loggingOut={loggingOut}
        />
        <main className="app-main">
          <div className="exam-page">
            {/* Header */}
            <header className="exam-header">
              <div className="exam-header-content">
                <button onClick={handleGoBack} className="exam-back-btn">
                  <ArrowLeft size={16} />
                  <span>Voltar ao Painel</span>
                </button>
                <div className="exam-title">
                  <Award size={24} />
                  <div>
                    <h1>{generalExam.title}</h1>
                    <p>{generalExam.description}</p>
                  </div>
                </div>
              </div>
              {!showResults && (
                <div className="exam-progress">
                  <div className="exam-progress-bar">
                    <div className="exam-progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="exam-progress-text">
                    {currentQuestionIndex + 1} de {generalExam.questions.length}
                  </span>
                </div>
              )}
            </header>

            {/* Content */}
            {!showResults ? (
              <div className="exam-content">
                <div className="exam-question-card">
                  <div className="exam-question-header">
                    <span className="exam-question-number">Questão {currentQuestionIndex + 1}</span>
                    <div className="exam-question-meta">
                      <Clock size={14} />
                      <span>Tempo livre</span>
                    </div>
                  </div>

                  <h2 className="exam-question-text">{currentQuestion.question}</h2>

                  <div className="exam-options">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        className={`exam-option ${
                          answers[currentQuestionIndex] === index ? 'exam-option--selected' : ''
                        }`}
                      >
                        <span className="exam-option-letter">{String.fromCharCode(65 + index)}</span>
                        <span className="exam-option-text">{option}</span>
                      </button>
                    ))}
                  </div>

                  <div className="exam-navigation">
                    <button
                      onClick={handlePrevious}
                      disabled={currentQuestionIndex === 0}
                      className="exam-nav-btn exam-nav-btn--prev"
                    >
                      <ArrowLeft size={16} />
                      <span>Anterior</span>
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={answers[currentQuestionIndex] === undefined}
                      className="exam-nav-btn exam-nav-btn--next"
                    >
                      <span>{currentQuestionIndex === generalExam.questions.length - 1 ? 'Finalizar' : 'Próximo'}</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="exam-results">
                <div className="exam-results-card">
                  <div className="exam-results-header">
                    <div className={`exam-results-icon ${score >= minScoreToPass ? 'exam-results-icon--success' : 'exam-results-icon--warning'}`}>
                      {score >= minScoreToPass ? <Award size={48} /> : <Lightbulb size={48} />}
                    </div>
                    <h2 className="exam-results-title">
                      {score >= minScoreToPass ? 'Parabéns!' : 'Continue estudando!'}
                    </h2>
                    <p className="exam-results-subtitle">
                      Você acertou {score} de {totalQuestions} questões
                      {score >= minScoreToPass ? '' : ` (mínimo: ${minScoreToPass})`}
                    </p>
                  </div>

                  <div className="exam-results-score">
                    <div className="exam-results-score-circle">
                      <span className="exam-results-score-number">{Math.round((score / generalExam.questions.length) * 100)}%</span>
                    </div>
                    <p className="exam-results-score-text">
                      {score >= minScoreToPass ? 'Desempenho excelente! Prova finalizada com sucesso.' : `Revise os módulos para melhorar seu desempenho. Mínimo: ${minScoreToPass}/${totalQuestions} (60%).`}
                    </p>
                  </div>

                  <div className="exam-results-actions">
                    <button onClick={handleRestart} className="exam-results-btn exam-results-btn--primary">
                      <RotateCcw size={16} />
                      <span>Tentar Novamente</span>
                    </button>
                    <button onClick={handleGoBack} className="exam-results-btn exam-results-btn--secondary">
                      <BookOpen size={16} />
                      <span>Revisar Módulos</span>
                    </button>
                  </div>

                  <div className="exam-results-details">
                    <h3 className="exam-results-details-title">
                      <Target size={16} />
                      Detalhes das Respostas
                    </h3>
                    <div className="exam-results-list">
                      {generalExam.questions.map((question, index) => {
                        const isCorrect = answers[index] === question.correctAnswer;
                        return (
                          <div key={index} className={`exam-result-item ${isCorrect ? 'exam-result-item--correct' : 'exam-result-item--incorrect'}`}>
                            <div className="exam-result-item-header">
                              <span className="exam-result-item-number">Q{index + 1}</span>
                              {isCorrect ? (
                                <CheckCircle size={16} className="exam-result-item-icon exam-result-item-icon--correct" />
                              ) : (
                                <XCircle size={16} className="exam-result-item-icon exam-result-item-icon--incorrect" />
                              )}
                            </div>
                            <p className="exam-result-item-question">{question.question}</p>
                            <div className="exam-result-item-answer">
                              <span className="exam-result-item-answer-label">Sua resposta:</span>
                              <span className={`exam-result-item-answer-text ${isCorrect ? 'exam-result-item-answer-text--correct' : 'exam-result-item-answer-text--incorrect'}`}>
                                {answers[index] !== undefined ? question.options[answers[index]] : 'Não respondida'}
                              </span>
                            </div>
                            {!isCorrect && (
                              <div className="exam-result-item-correct">
                                <span className="exam-result-item-correct-label">Resposta correta:</span>
                                <span className="exam-result-item-correct-text">
                                  {question.options[question.correctAnswer]}
                                </span>
                              </div>
                            )}
                            <div className="exam-result-item-explanation">
                              <span className="exam-result-item-explanation-label">Explicação:</span>
                              <p className="exam-result-item-explanation-text">{question.explanation}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <style>{`
            /* ── Exam Page ── */
            .exam-page {
              min-height: 100vh;
              background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
              padding: 24px;
            }

            /* ── Header ── */
            .exam-header {
              background: rgba(15, 23, 42, 0.8);
              backdrop-filter: blur(12px);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 16px;
              padding: 20px 24px;
              margin-bottom: 24px;
            }

            .exam-header-content {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 24px;
            }

            .exam-back-btn {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 10px 16px;
              background: rgba(255, 255, 255, 0.05);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 10px;
              color: #94a3b8;
              font-size: 14px;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s ease;
            }

            .exam-back-btn:hover {
              background: rgba(255, 255, 255, 0.1);
              color: #e2e8f0;
            }

            .exam-title {
              display: flex;
              align-items: center;
              gap: 16px;
              flex: 1;
            }

            .exam-title h1 {
              font-size: 20px;
              font-weight: 600;
              color: #f1f5f9;
              margin: 0;
            }

            .exam-title p {
              font-size: 13px;
              color: #94a3b8;
              margin: 4px 0 0 0;
            }

            .exam-title svg {
              color: #fbbf24;
            }

            .exam-progress {
              display: flex;
              align-items: center;
              gap: 12px;
            }

            .exam-progress-bar {
              width: 200px;
              height: 8px;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 4px;
              overflow: hidden;
            }

            .exam-progress-fill {
              height: 100%;
              background: linear-gradient(90deg, #fbbf24, #f59e0b);
              border-radius: 4px;
              transition: width 0.3s ease;
            }

            .exam-progress-text {
              font-size: 13px;
              color: #94a3b8;
              font-weight: 500;
            }

            /* ── Content ── */
            .exam-content {
              max-width: 900px;
              margin: 0 auto;
            }

            .exam-question-card {
              background: rgba(30, 41, 59, 0.8);
              backdrop-filter: blur(12px);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 16px;
              padding: 32px;
            }

            .exam-question-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 24px;
            }

            .exam-question-number {
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: #fbbf24;
            }

            .exam-question-meta {
              display: flex;
              align-items: center;
              gap: 6px;
              font-size: 12px;
              color: #94a3b8;
            }

            .exam-question-text {
              font-size: 20px;
              font-weight: 500;
              color: #f1f5f9;
              margin: 0 0 32px 0;
              line-height: 1.5;
            }

            .exam-options {
              display: flex;
              flex-direction: column;
              gap: 12px;
            }

            .exam-option {
              display: flex;
              align-items: center;
              gap: 16px;
              padding: 16px 20px;
              background: rgba(255, 255, 255, 0.03);
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 12px;
              cursor: pointer;
              transition: all 0.2s ease;
              text-align: left;
            }

            .exam-option:hover {
              background: rgba(255, 255, 255, 0.08);
              border-color: rgba(251, 191, 36, 0.3);
            }

            .exam-option--selected {
              background: rgba(251, 191, 36, 0.1);
              border-color: #fbbf24;
            }

            .exam-option-letter {
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 8px;
              font-size: 14px;
              font-weight: 600;
              color: #e2e8f0;
            }

            .exam-option--selected .exam-option-letter {
              background: #fbbf24;
              color: #0f172a;
            }

            .exam-option-text {
              flex: 1;
              font-size: 15px;
              color: #e2e8f0;
            }

            .exam-option-arrow {
              color: #64748b;
              opacity: 0;
              transition: all 0.2s ease;
            }

            .exam-option:hover .exam-option-arrow {
              opacity: 1;
            }

            .exam-navigation {
              display: flex;
              justify-content: space-between;
              gap: 12px;
              margin-top: 24px;
              padding-top: 24px;
              border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .exam-nav-btn {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              padding: 12px 24px;
              border-radius: 10px;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s ease;
            }

            .exam-nav-btn:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }

            .exam-nav-btn--prev {
              background: rgba(255, 255, 255, 0.05);
              color: #94a3b8;
              border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .exam-nav-btn--prev:hover:not(:disabled) {
              background: rgba(255, 255, 255, 0.1);
              color: #e2e8f0;
            }

            .exam-nav-btn--next {
              background: linear-gradient(135deg, #fbbf24, #f59e0b);
              color: #0f172a;
              border: none;
            }

            .exam-nav-btn--next:hover:not(:disabled) {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
            }

            /* ── Results ── */
            .exam-results {
              max-width: 900px;
              margin: 0 auto;
            }

            .exam-results-card {
              background: rgba(30, 41, 59, 0.8);
              backdrop-filter: blur(12px);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 16px;
              padding: 40px;
            }

            .exam-results-header {
              text-align: center;
              margin-bottom: 32px;
            }

            .exam-results-icon {
              width: 80px;
              height: 80px;
              margin: 0 auto 20px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .exam-results-icon--success {
              background: rgba(34, 197, 94, 0.2);
              color: #22c55e;
            }

            .exam-results-icon--warning {
              background: rgba(251, 191, 36, 0.2);
              color: #fbbf24;
            }

            .exam-results-title {
              font-size: 28px;
              font-weight: 600;
              color: #f1f5f9;
              margin: 0 0 8px 0;
            }

            .exam-results-subtitle {
              font-size: 16px;
              color: #94a3b8;
              margin: 0;
            }

            .exam-results-score {
              text-align: center;
              margin-bottom: 32px;
            }

            .exam-results-score-circle {
              width: 120px;
              height: 120px;
              margin: 0 auto 16px;
              border-radius: 50%;
              background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2));
              border: 3px solid rgba(251, 191, 36, 0.5);
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .exam-results-score-number {
              font-size: 32px;
              font-weight: 700;
              color: #fbbf24;
            }

            .exam-results-score-text {
              font-size: 14px;
              color: #94a3b8;
            }

            .exam-results-actions {
              display: flex;
              gap: 12px;
              margin-bottom: 40px;
            }

            .exam-results-btn {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              padding: 14px 24px;
              border-radius: 12px;
              font-size: 15px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s ease;
            }

            .exam-results-btn--primary {
              background: linear-gradient(135deg, #fbbf24, #f59e0b);
              color: #0f172a;
              border: none;
            }

            .exam-results-btn--primary:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 24px rgba(251, 191, 36, 0.3);
            }

            .exam-results-btn--secondary {
              background: rgba(255, 255, 255, 0.05);
              color: #e2e8f0;
              border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .exam-results-btn--secondary:hover {
              background: rgba(255, 255, 255, 0.1);
            }

            .exam-results-details {
              border-top: 1px solid rgba(255, 255, 255, 0.1);
              padding-top: 32px;
            }

            .exam-results-details-title {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 16px;
              font-weight: 600;
              color: #f1f5f9;
              margin: 0 0 24px 0;
            }

            .exam-results-details-title svg {
              color: #fbbf24;
            }

            .exam-results-list {
              display: flex;
              flex-direction: column;
              gap: 16px;
            }

            .exam-result-item {
              background: rgba(255, 255, 255, 0.03);
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 12px;
              padding: 20px;
            }

            .exam-result-item--correct {
              border-color: rgba(34, 197, 94, 0.3);
            }

            .exam-result-item--incorrect {
              border-color: rgba(239, 68, 68, 0.3);
            }

            .exam-result-item-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 12px;
            }

            .exam-result-item-number {
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: #94a3b8;
            }

            .exam-result-item-icon--correct {
              color: #22c55e;
            }

            .exam-result-item-icon--incorrect {
              color: #ef4444;
            }

            .exam-result-item-question {
              font-size: 15px;
              font-weight: 500;
              color: #e2e8f0;
              margin: 0 0 12px 0;
            }

            .exam-result-item-answer {
              display: flex;
              gap: 8px;
              margin-bottom: 8px;
            }

            .exam-result-item-answer-label {
              font-size: 13px;
              color: #94a3b8;
            }

            .exam-result-item-answer-text {
              font-size: 14px;
              color: #e2e8f0;
            }

            .exam-result-item-answer-text--correct {
              color: #22c55e;
            }

            .exam-result-item-answer-text--incorrect {
              color: #ef4444;
            }

            .exam-result-item-correct {
              display: flex;
              gap: 8px;
              margin-bottom: 12px;
            }

            .exam-result-item-correct-label {
              font-size: 13px;
              color: #94a3b8;
            }

            .exam-result-item-correct-text {
              font-size: 14px;
              color: #22c55e;
            }

            .exam-result-item-explanation {
              padding-top: 12px;
              border-top: 1px solid rgba(255, 255, 255, 0.05);
            }

            .exam-result-item-explanation-label {
              font-size: 13px;
              color: #94a3b8;
            }

            .exam-result-item-explanation-text {
              font-size: 14px;
              color: #cbd5e1;
              margin: 4px 0 0 0;
              line-height: 1.6;
            }

            /* ── Responsive ── */
            @media (max-width: 768px) {
              .exam-page {
                padding: 12px;
                flex: 1;
              }

              .exam-header {
                padding: 14px 16px;
                margin-bottom: 12px;
                border-radius: 14px;
              }

              .exam-header-content {
                flex-direction: row;
                flex-wrap: wrap;
                align-items: flex-start;
                gap: 12px;
              }

              .exam-back-btn {
                padding: 8px 12px;
                font-size: 12px;
                order: 0;
              }

              .exam-back-btn span {
                display: none;
              }

              .exam-title {
                gap: 10px;
                order: 1;
                flex: 1 1 100%;
              }

              .exam-title svg {
                width: 20px;
                height: 20px;
              }

              .exam-title h1 {
                font-size: 15px;
                line-height: 1.3;
              }

              .exam-title p {
                font-size: 11px;
                margin-top: 2px;
                display: none;
              }

              .exam-progress {
                margin-top: 12px;
                padding-top: 12px;
                border-top: 1px solid rgba(255,255,255,0.06);
              }

              .exam-progress-bar {
                width: 100%;
                height: 6px;
              }

              .exam-progress-text {
                font-size: 11px;
                white-space: nowrap;
              }

              .exam-question-card {
                padding: 20px 16px;
                border-radius: 14px;
              }

              .exam-question-header {
                margin-bottom: 16px;
              }

              .exam-question-number {
                font-size: 11px;
              }

              .exam-question-text {
                font-size: 17px;
                margin-bottom: 20px;
                line-height: 1.5;
              }

              .exam-options {
                gap: 10px;
              }

              .exam-option {
                padding: 14px 14px;
                gap: 12px;
                border-radius: 10px;
                min-height: 52px;
              }

              .exam-option-letter {
                width: 30px;
                height: 30px;
                font-size: 13px;
                flex-shrink: 0;
              }

              .exam-option-text {
                font-size: 14px;
                line-height: 1.4;
              }

              .exam-navigation {
                margin-top: 20px;
                padding-top: 16px;
                gap: 10px;
                flex-direction: column;
              }

              .exam-nav-btn {
                width: 100%;
                padding: 14px 20px;
                font-size: 14px;
                justify-content: center;
              }

              .exam-nav-btn--prev {
                order: 2;
              }

              .exam-nav-btn--next {
                order: 1;
              }

              .exam-results-card {
                padding: 24px 16px;
                border-radius: 14px;
              }

              .exam-results-header {
                margin-bottom: 20px;
              }

              .exam-results-icon {
                width: 60px;
                height: 60px;
                margin-bottom: 14px;
              }

              .exam-results-icon svg {
                width: 32px;
                height: 32px;
              }

              .exam-results-title {
                font-size: 22px;
              }

              .exam-results-subtitle {
                font-size: 14px;
              }

              .exam-results-score {
                margin-bottom: 20px;
              }

              .exam-results-score-circle {
                width: 96px;
                height: 96px;
                margin-bottom: 12px;
              }

              .exam-results-score-number {
                font-size: 26px;
              }

              .exam-results-score-text {
                font-size: 13px;
                padding: 0 8px;
              }

              .exam-results-actions {
                flex-direction: column;
                gap: 10px;
                margin-bottom: 28px;
              }

              .exam-results-btn {
                padding: 14px 20px;
                font-size: 14px;
              }

              .exam-results-details {
                padding-top: 24px;
              }

              .exam-results-details-title {
                font-size: 14px;
                margin-bottom: 16px;
              }

              .exam-results-list {
                gap: 12px;
              }

              .exam-result-item {
                padding: 14px;
              }

              .exam-result-item-header {
                margin-bottom: 8px;
              }

              .exam-result-item-question {
                font-size: 13px;
                margin-bottom: 8px;
                line-height: 1.5;
              }

              .exam-result-item-answer {
                flex-direction: column;
                gap: 2px;
                margin-bottom: 6px;
              }

              .exam-result-item-answer-label {
                font-size: 11px;
              }

              .exam-result-item-answer-text {
                font-size: 13px;
              }

              .exam-result-item-correct {
                flex-direction: column;
                gap: 2px;
                margin-bottom: 8px;
              }

              .exam-result-item-correct-label {
                font-size: 11px;
              }

              .exam-result-item-correct-text {
                font-size: 13px;
              }

              .exam-result-item-explanation-label {
                font-size: 11px;
              }

              .exam-result-item-explanation-text {
                font-size: 13px;
              }
            }

            @media (max-width: 400px) {
              .exam-page {
                padding: 8px;
              }

              .exam-question-card {
                padding: 16px 12px;
                border-radius: 12px;
              }

              .exam-question-text {
                font-size: 15px;
              }

              .exam-option {
                padding: 12px 12px;
                min-height: 46px;
              }

              .exam-option-text {
                font-size: 13px;
              }

              .exam-results-card {
                padding: 20px 12px;
              }

              .exam-results-title {
                font-size: 19px;
              }

              .exam-results-score-circle {
                width: 80px;
                height: 80px;
              }

              .exam-results-score-number {
                font-size: 22px;
              }

              .exam-result-item {
                padding: 12px;
              }
            }
          `}</style>
        </main>
      </div>
    </SidebarProvider>
  );
}
