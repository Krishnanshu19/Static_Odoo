'use client';

import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, ThumbsUp, ThumbsDown, Eye, User, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: {
    username: string;
    avatar?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  votes: number;
  answers: number;
  views: number;
  hasAcceptedAnswer?: boolean;
  previewAnswer?: {
    id: string;
    content: string;
    author: {
      username: string;
      avatar?: string;
    };
    votes: number;
    isAccepted?: boolean;
  };
}

interface QuestionCardProps {
  question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const handleVote = (type: 'up' | 'down', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`${type}vote question ${question.id}`);
  };

  return (
    <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <Link href={`/questions/${question.id}`} className="flex-1">
            <h3 className="text-lg font-medium text-white hover:text-blue-400 transition-colors line-clamp-2">
              {question.title}
            </h3>
          </Link>
          <div className="flex items-center space-x-4 ml-4 text-sm text-gray-400">
            <span className="bg-gray-700 px-2 py-1 rounded text-xs font-medium">
              {question.answers} ans
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-3">
              {question.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-gray-700 text-gray-300 hover:bg-gray-600">
                  {tag}
                </Badge>
              ))}
            </div>

            <p className="text-gray-300 text-sm line-clamp-2 mb-3">
              {question.description.replace(/<[^>]*>/g, '').substring(0, 150)}...
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleVote('up', e)}
                    className="p-1 h-auto hover:bg-gray-700"
                  >
                    <ThumbsUp className="w-4 h-4 hover:text-green-400" />
                  </Button>
                  <span className="font-medium">{question.votes}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleVote('down', e)}
                    className="p-1 h-auto hover:bg-gray-700"
                  >
                    <ThumbsDown className="w-4 h-4 hover:text-red-400" />
                  </Button>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{question.answers}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{question.views}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-400">
                {question.author.avatar ? (
                  <img
                    src={question.author.avatar}
                    alt={question.author.username}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <User className="w-4 h-4" />
                )}
                <span>{question.author.username}</span>
                <span>•</span>
                <span>{formatDistanceToNow(question.createdAt, { addSuffix: true })}</span>
              </div>
            </div>

            {/* Preview Answer */}
            {question.previewAnswer && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-start space-x-3">
                  <div className="flex flex-col items-center space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto"
                    >
                      <ThumbsUp className="w-3 h-3 text-gray-500" />
                    </Button>
                    <span className="text-xs text-gray-500">{question.previewAnswer.votes}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto"
                    >
                      <ThumbsDown className="w-3 h-3 text-gray-500" />
                    </Button>
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm text-gray-300 line-clamp-2 mb-2">
                      {question.previewAnswer.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        {question.previewAnswer.author.avatar ? (
                          <img
                            src={question.previewAnswer.author.avatar}
                            alt={question.previewAnswer.author.username}
                            className="w-4 h-4 rounded-full"
                          />
                        ) : (
                          <User className="w-3 h-3" />
                        )}
                        <span>{question.previewAnswer.author.username}</span>
                        {question.previewAnswer.isAccepted && (
                          <Badge className="bg-green-600 text-white text-xs px-1 py-0">
                            ✓
                          </Badge>
                        )}
                      </div>
                      
                      <Link href={`/questions/${question.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs text-blue-400 hover:text-blue-300 p-1 h-auto">
                          <ChevronDown className="w-3 h-3 mr-1" />
                          See all answers
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;