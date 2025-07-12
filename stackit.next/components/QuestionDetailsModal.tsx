import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuestion } from "@/hooks/useStackitApi";
import { Button } from "@/components/ui/button";

interface QuestionDetailsModalProps {
  open: boolean;
  onClose: () => void;
  questionId: string;
}

const QuestionDetailsModal: React.FC<QuestionDetailsModalProps> = ({
  open,
  onClose,
  questionId,
}) => {
  const { question, answers, isLoading, error } = useQuestion(questionId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-600 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Question Details</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-400 py-8">
            Failed to load question.
          </div>
        ) : question ? (
          <div>
            <h2 className="text-xl font-bold mb-2">{question.title}</h2>
            <div className="mb-4 text-gray-300">{question.description}</div>
            <div className="mb-4 text-sm text-gray-400">
              Asked by: {question.author?.username || "Unknown"}
            </div>
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Answers</h3>
              {answers && answers.length > 0 ? (
                answers.map((answer) => (
                  <div
                    key={answer._id}
                    className="mb-4 p-3 bg-gray-700 rounded"
                  >
                    <div className="mb-2 text-gray-200">{answer.content}</div>
                    <div className="text-xs text-gray-400 mb-1">
                      By: {answer.author?.username || "Unknown"}
                    </div>
                    {answer.replies && answer.replies.length > 0 && (
                      <div className="ml-4 mt-2">
                        <div className="font-semibold text-xs mb-1">
                          Replies:
                        </div>
                        {answer.replies.map((reply) => (
                          <div
                            key={reply._id}
                            className="mb-2 p-2 bg-gray-600 rounded"
                          >
                            <div className="text-gray-200">{reply.content}</div>
                            <div className="text-xs text-gray-400">
                              By: {reply.author?.username || "Unknown"}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-gray-400">No answers yet.</div>
              )}
            </div>
          </div>
        ) : null}
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="border-gray-600 text-gray-300 hover:bg-gray-700 mt-4 w-full"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionDetailsModal;
