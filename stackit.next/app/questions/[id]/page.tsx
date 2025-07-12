'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import RichTextEditor from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Check, 
  User, 
  Calendar,
  Eye,
  MessageSquare
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Mock data
const mockQuestion = {
  id: '1',
  title: 'How to join 2 columns in a data set to make a separate column in SQL',
  description: `<p>I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing <strong>First name</strong>, and column 2 consists of <strong>last name</strong> I want a column to combine both first name and last name.</p>
  
  <p>For example:</p>
  <ul>
    <li>Column 1: John</li>
    <li>Column 2: Doe</li>
    <li>Result Column: John Doe</li>
  </ul>
  
  <p>How can I achieve this in SQL? Any help would be appreciated!</p>`,
  tags: ['sql', 'database'],
  author: {
    username: 'john_doe',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
  },
  createdAt: new Date(Date.now() - 3600000),
  votes: 5,
  views: 128,
  answers: [
    {
      id: '1',
      content: `<p>You can use the <strong>CONCAT</strong> function or the <strong>||</strong> operator to join columns in SQL.</p>
      
      <p>Here are a few methods:</p>
      
      <h3>Method 1: Using CONCAT function</h3>
      <pre><code>SELECT CONCAT(first_name, ' ', last_name) AS full_name
FROM your_table;</code></pre>

      <h3>Method 2: Using || operator (PostgreSQL, SQLite)</h3>
      <pre><code>SELECT first_name || ' ' || last_name AS full_name
FROM your_table;</code></pre>`,
      author: {
        username: 'sql_expert',
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
      },
      createdAt: new Date(Date.now() - 1800000),
      votes: 8,
      isAccepted: true
    },
    {
      id: '2',
      content: `<p>Another approach is to use the <strong>+</strong> operator if you're using SQL Server:</p>
      
      <pre><code>SELECT first_name + ' ' + last_name AS full_name
FROM your_table;</code></pre>
      
      <p>Just make sure to handle NULL values properly!</p>`,
      author: {
        username: 'db_developer',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
      },
      createdAt: new Date(Date.now() - 900000),
      votes: 3,
      isAccepted: false
    }
  ]
};

export default function QuestionDetail() {
  const params = useParams();
  const { user, isAuthenticated } = useAuth();
  const [newAnswer, setNewAnswer] = useState('');
  const [voting, setVoting] = useState<{ [key: string]: boolean }>({});

  const handleVote = async (type: 'up' | 'down', targetId: string, targetType: 'question' | 'answer') => {
    if (!isAuthenticated) return;
    
    setVoting(prev => ({ ...prev, [targetId]: true }));
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Vote submitted:', { type, targetId, targetType });
    } catch (error) {
      console.error('Failed to vote:', error);
    } finally {
      setVoting(prev => ({ ...prev, [targetId]: false }));
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
    if (!isAuthenticated) return;
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Answer accepted:', answerId);
    } catch (error) {
      console.error('Failed to accept answer:', error);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim() || !isAuthenticated) return;

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Answer submitted:', newAnswer);
      setNewAnswer('');
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  const breadcrumbs = [
    { label: 'Questions', href: '/' },
    { label: mockQuestion.title.substring(0, 50) + '...', href: '#' }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>&gt;</span>}
              <a href={crumb.href} className="hover:text-blue-400">
                {crumb.label}
              </a>
            </React.Fragment>
          ))}
        </nav>

        <div className="flex gap-8">
          {/* Main content */}
          <div className="flex-1">
            {/* Question */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
              <h1 className="text-2xl font-bold text-white mb-4">{mockQuestion.title}</h1>
              
              <div className="flex items-center space-x-4 text-sm text-gray-400 mb-6">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Asked {formatDistanceToNow(mockQuestion.createdAt, { addSuffix: true })}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{mockQuestion.views} views</span>
                </div>
              </div>

              <div className="flex gap-6">
                {/* Voting */}
                <div className="flex flex-col items-center space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote('up', mockQuestion.id, 'question')}
                    disabled={!isAuthenticated || voting[mockQuestion.id]}
                    className="p-2 hover:bg-gray-700"
                  >
                    <ThumbsUp className="w-6 h-6 text-gray-400 hover:text-green-400" />
                  </Button>
                  <span className="text-lg font-semibold text-white">{mockQuestion.votes}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote('down', mockQuestion.id, 'question')}
                    disabled={!isAuthenticated || voting[mockQuestion.id]}
                    className="p-2 hover:bg-gray-700"
                  >
                    <ThumbsDown className="w-6 h-6 text-gray-400 hover:text-red-400" />
                  </Button>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div 
                    className="prose prose-invert max-w-none mb-6"
                    dangerouslySetInnerHTML={{ __html: mockQuestion.description }}
                  />
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {mockQuestion.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-blue-600 text-white">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-end">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      {mockQuestion.author.avatar ? (
                        <img
                          src={mockQuestion.author.avatar}
                          alt={mockQuestion.author.username}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <User className="w-6 h-6" />
                      )}
                      <span>{mockQuestion.author.username}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Answers */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                {mockQuestion.answers.length} Answer{mockQuestion.answers.length !== 1 ? 's' : ''}
              </h2>
              
              <div className="space-y-6">
                {mockQuestion.answers.map((answer) => (
                  <div
                    key={answer.id}
                    className={`bg-gray-800 rounded-lg border p-6 ${
                      answer.isAccepted ? 'border-green-500' : 'border-gray-700'
                    }`}
                  >
                    <div className="flex gap-6">
                      {/* Voting */}
                      <div className="flex flex-col items-center space-y-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote('up', answer.id, 'answer')}
                          disabled={!isAuthenticated || voting[answer.id]}
                          className="p-2 hover:bg-gray-700"
                        >
                          <ThumbsUp className="w-5 h-5 text-gray-400 hover:text-green-400" />
                        </Button>
                        <span className="text-lg font-semibold text-white">{answer.votes}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote('down', answer.id, 'answer')}
                          disabled={!isAuthenticated || voting[answer.id]}
                          className="p-2 hover:bg-gray-700"
                        >
                          <ThumbsDown className="w-5 h-5 text-gray-400 hover:text-red-400" />
                        </Button>
                        
                        {/* Accept answer button (only for question owner) */}
                        {user?.username === mockQuestion.author.username && !answer.isAccepted && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAcceptAnswer(answer.id)}
                            className="p-2 hover:bg-gray-700 mt-2"
                            title="Accept this answer"
                          >
                            <Check className="w-5 h-5 text-gray-400 hover:text-green-400" />
                          </Button>
                        )}
                        
                        {answer.isAccepted && (
                          <div className="mt-2">
                            <Check className="w-5 h-5 text-green-400" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div 
                          className="prose prose-invert max-w-none mb-4"
                          dangerouslySetInnerHTML={{ __html: answer.content }}
                        />
                        
                        <div className="flex items-center justify-between">
                          {answer.isAccepted && (
                            <Badge className="bg-green-600 text-white">
                              Accepted Answer
                            </Badge>
                          )}
                          
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            {answer.author.avatar ? (
                              <img
                                src={answer.author.avatar}
                                alt={answer.author.username}
                                className="w-6 h-6 rounded-full"
                              />
                            ) : (
                              <User className="w-4 h-4" />
                            )}
                            <span>{answer.author.username}</span>
                            <span>•</span>
                            <span>{formatDistanceToNow(answer.createdAt, { addSuffix: true })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Answer */}
            {isAuthenticated ? (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Submit Your Answer</h3>
                <form onSubmit={handleSubmitAnswer}>
                  <RichTextEditor
                    content={newAnswer}
                    onChange={setNewAnswer}
                    placeholder="Write your answer here..."
                  />
                  <div className="mt-4">
                    <Button
                      type="submit"
                      disabled={!newAnswer.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Submit Answer
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center">
                <p className="text-gray-300 mb-4">Please log in to submit an answer.</p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Log In
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-80 hidden lg:block">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Related Questions</h3>
              <div className="space-y-3">
                {[
                  'How to concatenate strings in MySQL?',
                  'SQL INNER JOIN vs LEFT JOIN',
                  'Best practices for SQL naming conventions'
                ].map((title, index) => (
                  <a
                    key={index}
                    href="#"
                    className="block text-blue-400 hover:text-blue-300 text-sm"
                  >
                    {title}
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}