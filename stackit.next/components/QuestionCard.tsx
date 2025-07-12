"use client";
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, ThumbsUp, ThumbsDown, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Question } from "@/types/apis";
import { useQuestion } from "@/hooks/useStackitApi";
import QuestionDetailsModal from "@/components/QuestionDetailsModal";
import { toast } from "sonner";

interface QuestionCardProps {
  question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const { vote } = useQuestion(question._id);
  const [modalOpen, setModalOpen] = useState(false);
  const initialVotes =
    (question.upvoteCount || 0) - (question.downvoteCount || 0);
  const [localVotes, setLocalVotes] = useState(initialVotes);

  const handleVote = async (type: "up" | "down", e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const result = await vote({
        targetType: "question",
        targetId: question._id,
        voteType: type,
      });
      if (result && result.message === "Already voted") {
        toast.error("You have already voted.");
        // Do not update the count
      } else {
        setLocalVotes((prev) => prev + (type === "up" ? 1 : -1));
      }
    } catch (error) {
      toast.error("Voting failed.");
      console.error("Error voting:", error);
    }
  };

  return (
    <>
      <Card
        className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
        onClick={() => setModalOpen(true)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-medium text-white hover:text-blue-400 transition-colors line-clamp-2">
              {question.title}
            </h3>
            <div className="flex items-center space-x-4 ml-4 text-sm text-gray-400">
              {typeof question.answerCount === "number" &&
              typeof question.totalReplies === "number" ? (
                <span className="bg-gray-700 px-2 py-1 rounded text-xs font-medium">
                  {question.answerCount} answers • {question.totalReplies}{" "}
                  replies
                </span>
              ) : typeof question.answerCount === "number" ? (
                <span className="bg-gray-700 px-2 py-1 rounded text-xs font-medium">
                  {question.answerCount} answers
                </span>
              ) : (
                <span className="bg-gray-700 px-2 py-1 rounded text-xs font-medium">
                  {question.totalReplies} replies
                </span>
              )}
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
                    <span className="font-medium">{localVotes}</span>
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
                    <span>
                      {typeof question.answerCount === "number"
                        ? question.answerCount
                        : question.totalReplies}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <User className="w-4 h-4" />
                  <span>{question.username || "Unknown"}</span>
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(new Date(question.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <QuestionDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        questionId={question._id}
      />
    </>
  );
};

export default QuestionCard;
