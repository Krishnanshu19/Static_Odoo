'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ChevronUp, ChevronDown, Check, MessageSquare, Share2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { AuthModal } from '@/components/auth/AuthModal';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { useAuth } from '@/hooks/useAuth';
import { Question, Answer, User } from '@/types';
import { mockQuestions } from '@/lib/mockData';

export default function QuestionDetailPage() {
  const params = useParams();
  const { user, login, logout, register } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [answerContent, setAnswerContent] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  useEffect(() => {
    const questionId = params.id as string;
    const foundQuestion = mockQuestions.find(q => q.id === questionId);
    setQuestion(foundQuestion || null);
  }, [params.id]);

  const handleVote = (targetId: string, targetType: 'question' | 'answer', voteType: 'up' | 'down') => {
    if (!user) {
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }

    if (!question) return;

    if (targetType === 'question') {
      setQuestion(prev => prev ? {
        ...prev,
        votes: prev.votes + (voteType === 'up' ? 1 : -1)
      } : null);
    } else {
      setQuestion(prev => prev ? {
        ...prev,
        answers: prev.answers.map(answer =>
          answer.id === targetId
            ? { ...answer, votes: answer.votes + (voteType === 'up' ? 1 : -1) }
            : answer
        )
      } : null);
    }
  };

  const handleAcceptAnswer = (answerId: string) => {
    if (!user || !question || question.authorId !== user.id) return;

    setQuestion(prev => prev ? {
      ...prev,
      acceptedAnswerId: prev.acceptedAnswerId === answerId ? undefined : answerId,
      answers: prev.answers.map(answer => ({
        ...answer,
        isAccepted: answer.id === answerId ? !answer.isAccepted : false
      }))
    } : null);
  };

  const handleSubmitAnswer = async () => {
    if (!user || !question || !answerContent.trim()) return;

    setIsSubmittingAnswer(true);

    try {
      const newAnswer: Answer = {
        id: Date.now().toString(),
        content: answerContent,
        authorId: user.id,
        author: user,
        questionId: question.id,
        createdAt: new Date(),
        votes: 0,
        isAccepted: false,
      };

      setQuestion(prev => prev ? {
        ...prev,
        answers: [...prev.answers, newAnswer]
      } : null);

      setAnswerContent('');
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  if (!question) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header
          user={user}
          onLogin={() => {
            setAuthMode('login');
            setAuthModalOpen(true);
          }}
          onRegister={() => {
            setAuthMode('register');
            setAuthModalOpen(true);
          }}
          onLogout={logout}
          onAskQuestion={() => {}}
        />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Question not found</h1>
            <p className="text-slate-600">The question you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        user={user}
        onLogin={() => {
          setAuthMode('login');
          setAuthModalOpen(true);
        }}
        onRegister={() => {
          setAuthMode('register');
          setAuthModalOpen(true);
        }}
        onLogout={logout}
        onAskQuestion={() => {}}
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Question */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
          <div className="p-6">
            <div className="flex gap-6">
              {/* Vote buttons */}
              <div className="flex flex-col items-center space-y-2">
                <button
                  onClick={() => handleVote(question.id, 'question', 'up')}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <ChevronUp className="w-6 h-6 text-slate-600" />
                </button>
                <span className="text-lg font-semibold text-slate-900">{question.votes}</span>
                <button
                  onClick={() => handleVote(question.id, 'question', 'down')}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <ChevronDown className="w-6 h-6 text-slate-600" />
                </button>
              </div>

              {/* Question content */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">{question.title}</h1>
                
                <div 
                  className="prose prose-slate max-w-none mb-6"
                  dangerouslySetInnerHTML={{ __html: question.description }}
                />

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {question.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Author info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {question.author.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{question.author.username}</p>
                      <p className="text-xs text-slate-500">
                        asked {formatDistanceToNow(question.createdAt, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Answers */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            {question.answers.length} Answer{question.answers.length !== 1 ? 's' : ''}
          </h2>
          
          <div className="space-y-6">
            {question.answers.map((answer) => (
              <div
                key={answer.id}
                className={`bg-white rounded-lg shadow-sm border border-slate-200 ${
                  answer.isAccepted ? 'ring-2 ring-green-500' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex gap-6">
                    {/* Vote buttons */}
                    <div className="flex flex-col items-center space-y-2">
                      <button
                        onClick={() => handleVote(answer.id, 'answer', 'up')}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                      >
                        <ChevronUp className="w-5 h-5 text-slate-600" />
                      </button>
                      <span className="text-lg font-semibold text-slate-900">{answer.votes}</span>
                      <button
                        onClick={() => handleVote(answer.id, 'answer', 'down')}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                      >
                        <ChevronDown className="w-5 h-5 text-slate-600" />
                      </button>
                      
                      {user?.id === question.authorId && (
                        <button
                          onClick={() => handleAcceptAnswer(answer.id)}
                          className={`p-2 rounded-full transition-colors ${
                            answer.isAccepted
                              ? 'bg-green-100 text-green-600'
                              : 'hover:bg-slate-100 text-slate-600'
                          }`}
                          title={answer.isAccepted ? 'Unaccept answer' : 'Accept answer'}
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {/* Answer content */}
                    <div className="flex-1">
                      {answer.isAccepted && (
                        <div className="flex items-center space-x-2 mb-4">
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-600">Accepted Answer</span>
                        </div>
                      )}
                      
                      <div 
                        className="prose prose-slate max-w-none mb-4"
                        dangerouslySetInnerHTML={{ __html: answer.content }}
                      />

                      {/* Answer author info */}
                      <div className="flex items-center justify-end">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {answer.author.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{answer.author.username}</p>
                            <p className="text-xs text-slate-500">
                              answered {formatDistanceToNow(answer.createdAt, { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Answer form */}
        {user ? (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Answer</h3>
              
              <RichTextEditor
                content={answerContent}
                onChange={setAnswerContent}
                placeholder="Write your answer here..."
              />

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!answerContent.trim() || isSubmittingAnswer}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isSubmittingAnswer ? 'Posting...' : 'Post Your Answer'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 text-center">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Want to answer this question?</h3>
            <p className="text-slate-600 mb-4">
              Sign in to share your knowledge and help the community.
            </p>
            <div className="space-x-3">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setAuthModalOpen(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthMode('register');
                  setAuthModalOpen(true);
                }}
                className="border border-slate-300 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-50 transition-colors font-medium"
              >
                Create Account
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onLogin={login}
        onRegister={register}
        onSwitchMode={(mode) => setAuthMode(mode)}
      />
    </div>
  );
}