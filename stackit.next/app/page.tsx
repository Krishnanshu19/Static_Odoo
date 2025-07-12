'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { QuestionList } from '@/components/questions/QuestionList';
import { AuthModal } from '@/components/auth/AuthModal';
import { AskQuestionModal } from '@/components/questions/AskQuestionModal';
import { useAuth } from '@/hooks/useAuth';
import { Question } from '@/types';
import { mockQuestions } from '@/lib/mockData';

export default function Home() {
  const { user, login, logout, register } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'unanswered'>('recent');

  useEffect(() => {
    setQuestions(mockQuestions);
  }, []);

  const handleAskQuestion = (questionData: Omit<Question, 'id' | 'authorId' | 'author' | 'createdAt' | 'votes' | 'answers'>) => {
    if (!user) return;

    const newQuestion: Question = {
      id: Date.now().toString(),
      authorId: user.id,
      author: user,
      createdAt: new Date(),
      votes: 0,
      answers: [],
      ...questionData,
    };

    setQuestions(prev => [newQuestion, ...prev]);
    setAskModalOpen(false);
  };

  const sortedQuestions = [...questions].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.votes - a.votes;
      case 'unanswered':
        return a.answers.length - b.answers.length;
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

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
        onAskQuestion={() => setAskModalOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h1 className="text-2xl font-bold text-slate-900">All Questions</h1>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSortBy('recent')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        sortBy === 'recent'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      Recent
                    </button>
                    <button
                      onClick={() => setSortBy('popular')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        sortBy === 'popular'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      Popular
                    </button>
                    <button
                      onClick={() => setSortBy('unanswered')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        sortBy === 'unanswered'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      Unanswered
                    </button>
                  </div>
                </div>
              </div>
              <QuestionList questions={sortedQuestions} currentUser={user} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Welcome to StackIt</h2>
              <p className="text-sm text-slate-600 mb-4">
                A minimal Q&A platform for collaborative learning and knowledge sharing.
              </p>
              {!user && (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setAuthModalOpen(true);
                    }}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    Join the Community
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setAuthModalOpen(true);
                    }}
                    className="w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-50 transition-colors font-medium"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'JavaScript', 'TypeScript', 'Next.js', 'Node.js', 'CSS', 'HTML', 'Python'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-slate-200 cursor-pointer transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onLogin={login}
        onRegister={register}
        onSwitchMode={(mode) => setAuthMode(mode)}
      />

      <AskQuestionModal
        isOpen={askModalOpen}
        onClose={() => setAskModalOpen(false)}
        onSubmit={handleAskQuestion}
        user={user}
      />
    </div>
  );
}