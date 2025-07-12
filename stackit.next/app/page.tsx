'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import QuestionCard from '@/components/QuestionCard';
import FilterTabs from '@/components/FilterTabs';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Mock data
const mockQuestions = [
  {
    id: '1',
    title: 'How to join 2 columns in a data set to make a separate column in SQL',
    description: 'I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine...',
    tags: ['sql', 'database'],
    author: {
      username: 'john_doe',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
    },
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 3600000),
    votes: 5,
    answers: 3,
    views: 128,
    hasAcceptedAnswer: true,
    previewAnswer: {
      id: 'ans1',
      content: 'You can use the CONCAT function or the || operator to join columns in SQL. Here are a few methods: Method 1: Using CONCAT function SELECT CONCAT(first_name, \' \', last_name) AS full_name FROM your_table;',
      author: {
        username: 'sql_expert',
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
      },
      votes: 8,
      isAccepted: true
    }
  },
  {
    id: '2',
    title: 'React useState hook not updating state immediately',
    description: 'I am facing an issue where useState is not updating the state immediately after calling the setter function. The component is not re-rendering with the new state...',
    tags: ['react', 'javascript', 'hooks'],
    author: {
      username: 'sarah_dev',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
    },
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 7200000),
    votes: 8,
    answers: 2,
    views: 95,
    previewAnswer: {
      id: 'ans2',
      content: 'useState is asynchronous and doesn\'t update immediately. The state update is scheduled and will be reflected in the next render. If you need to perform an action after state update, use useEffect with the state variable as dependency.',
      author: {
        username: 'react_guru',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
      },
      votes: 12,
      isAccepted: false
    }
  },
  {
    id: '3',
    title: 'How to implement authentication in Next.js 13 app router',
    description: 'I want to implement JWT-based authentication in my Next.js 13 application using the new app router. What is the best approach for handling protected routes and server-side authentication?',
    tags: ['nextjs', 'authentication', 'jwt'],
    author: {
      username: 'mike_fullstack',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
    },
    createdAt: new Date(Date.now() - 10800000),
    updatedAt: new Date(Date.now() - 10800000),
    votes: 12,
    answers: 1,
    views: 203,
    previewAnswer: {
      id: 'ans3',
      content: 'For Next.js 13 app router authentication, I recommend using NextAuth.js with JWT strategy. You can protect routes using middleware.ts file and create a custom hook for authentication state management.',
      author: {
        username: 'nextjs_dev',
        avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
      },
      votes: 5,
      isAccepted: false
    }
  }
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;
  const totalPages = Math.ceil(mockQuestions.length / questionsPerPage);

  const filteredQuestions = mockQuestions; // Add filtering logic here

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <h1 className="text-2xl font-bold text-white">Questions</h1>
              <FilterTabs 
                activeFilter={activeFilter} 
                onFilterChange={setActiveFilter}
                className="hidden md:flex"
              />
            </div>

            <div className="space-y-4">
              {filteredQuestions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (currentPage <= 4) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    pageNum = totalPages - 6 + i;
                  } else {
                    pageNum = currentPage - 3 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-[2.5rem] ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4">Popular Tags</h2>
              <div className="flex flex-wrap gap-2">
                {['javascript', 'react', 'python', 'sql', 'nodejs', 'css', 'html', 'typescript'].map((tag) => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}