import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuestion } from "@/hooks/useStackitApi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  const {
    question,
    answers,
    isLoading,
    error,
    createAnswer,
    createAnswerState,
  } = useQuestion(questionId);
  const [answerContent, setAnswerContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerContent.trim()) {
      toast.error("Answer cannot be empty.");
      return;
    }
    setSubmitting(true);
    try {
      await createAnswer({ content: answerContent });
      setAnswerContent("");
      toast.success("Answer posted successfully!");
    } catch (err) {
      toast.error("Failed to post answer.");
    } finally {
      setSubmitting(false);
    }
  };

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
            <div
              className="mb-4 text-gray-300"
              dangerouslySetInnerHTML={{ __html: question.description }}
            />
            <div className="mb-4 text-sm text-gray-400">
              Asked by: {question.username || "Unknown"}
            </div>
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Answers ({answers.length})</h3>
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
                          Replies ({answer.replies.length}):
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
        <form onSubmit={handleSubmit} className="mt-4">
          <label
            htmlFor="answer"
            className="block mb-2 text-gray-300 font-medium"
          >
            Your Answer
          </label>
          <textarea
            id="answer"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-400 resize-vertical min-h-[80px]"
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
            placeholder="Type your answer here..."
            disabled={submitting || createAnswerState.isLoading}
          />
          <Button
            type="submit"
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={submitting || createAnswerState.isLoading}
          >
            {submitting || createAnswerState.isLoading
              ? "Posting..."
              : "Post Answer"}
          </Button>
        </form>
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
