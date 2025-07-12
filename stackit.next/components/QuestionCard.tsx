"use client";

import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Eye,
  User,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Question } from "@/types/apis";
import { useQuestion } from "@/hooks/useStackitApi";

interface QuestionCardProps {
  question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const { vote } = useQuestion(question._id);

  const handleVote = async (type: "up" | "down", e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await vote({
        targetType: "question",
        targetId: question._id,
        voteType: type,
      });
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const answersCount = question.answers?.length || 0;
  const totalVotes = (question.upvotes || 0) - (question.downvotes || 0);

  return (
    <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <Link href={`/questions/${question._id}`} className="flex-1">
            <h3 className="text-lg font-medium text-white hover:text-blue-400 transition-colors line-clamp-2">
              {question.title}
            </h3>
          </Link>
          <div className="flex items-center space-x-4 ml-4 text-sm text-gray-400">
            <span className="bg-gray-700 px-2 py-1 rounded text-xs font-medium">
              {answersCount} ans
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-3">
              {question.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-gray-700 text-gray-300 hover:bg-gray-600"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <p className="text-gray-300 text-sm line-clamp-2 mb-3">
              {question.description.replace(/<[^>]*>/g, "").substring(0, 150)}
              ...
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleVote("up", e)}
                    className="p-1 h-auto hover:bg-gray-700"
                  >
                    <ThumbsUp className="w-4 h-4 hover:text-green-400" />
                  </Button>
                  <span className="font-medium">{totalVotes}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleVote("down", e)}
                    className="p-1 h-auto hover:bg-gray-700"
                  >
                    <ThumbsDown className="w-4 h-4 hover:text-red-400" />
                  </Button>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{answersCount}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{question.views || 0}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <User className="w-4 h-4" />
                <span>{question.author.username}</span>
                <span>•</span>
                <span>
                  {formatDistanceToNow(new Date(question.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>

            {/* Preview Answer */}
            {question.answers && question.answers.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-start space-x-3">
                  <div className="flex flex-col items-center space-y-1">
                    <Button variant="ghost" size="sm" className="p-1 h-auto">
                      <ThumbsUp className="w-3 h-3 text-gray-500" />
                    </Button>
                    <span className="text-xs text-gray-500">
                      {(question.answers[0].upvotes || 0) -
                        (question.answers[0].downvotes || 0)}
                    </span>
                    <Button variant="ghost" size="sm" className="p-1 h-auto">
                      <ThumbsDown className="w-3 h-3 text-gray-500" />
                    </Button>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-gray-300 line-clamp-2 mb-2">
                      {question.answers[0].content
                        .replace(/<[^>]*>/g, "")
                        .substring(0, 120)}
                      ...
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <User className="w-3 h-3" />
                        <span>{question.answers[0].author.username}</span>
                      </div>

                      <Link href={`/questions/${question._id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-blue-400 hover:text-blue-300 p-1 h-auto"
                        >
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
