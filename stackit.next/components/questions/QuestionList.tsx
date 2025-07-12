'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ChevronUp, ChevronDown, MessageSquare, Check } from 'lucide-react';
import { Question, User } from '@/types';

interface QuestionListProps {
  questions: Question[];
  currentUser: User | null;
}

export function QuestionList({ questions, currentUser }: QuestionListProps) {
  if (questions.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">No questions found. Be the first to ask one!</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-200">
      {questions.map((question) => (
        <div key={question.id} className="p-6 hover:bg-slate-50 transition-colors">
          <div className="flex gap-4">
            {/* Vote and Stats */}
            <div className="flex flex-col items-center space-y-2 text-sm text-slate-500 min-w-0">
              <div className="flex items-center space-x-1">
                <ChevronUp className="w-4 h-4" />
                <span className="font-medium">{question.votes}</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-4 h-4" />
                <span>{question.answers.length}</span>
              </div>
              {question.acceptedAnswerId && (
                <Check className="w-4 h-4 text-green-600" />
              )}
            </div>

            {/* Question Content */}
            <div className="flex-1 min-w-0">
              <Link 
                href={`/questions/${question.id}`}
                className="block group"
              >
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {question.title}
                </h3>
              </Link>
              
              <div 
                className="mt-2 text-slate-600 line-clamp-2"
                dangerouslySetInnerHTML={{ __html: question.description }}
              />

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {question.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-md hover:bg-blue-200 cursor-pointer transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Author and Date */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {question.author.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-slate-700 font-medium">{question.author.username}</span>
                  <span className="text-sm text-slate-500">
                    {question.author.reputation} reputation
                  </span>
                </div>
                <span className="text-sm text-slate-500">
                  asked {formatDistanceToNow(question.createdAt, { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}