"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import QuestionCard from "@/components/QuestionCard";
import FilterTabs from "@/components/FilterTabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuestions } from "@/hooks/useStackitApi";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const { questions, isLoading, error } = useQuestions(activeFilter);

  console.log("questions", questions);
  console.log("isLoading", isLoading);
  console.log("error", error);

  const questionsPerPage = 10;
  const totalPages = Math.ceil((questions?.length || 0) / questionsPerPage);

  // Filter questions based on active filter
  const getFilteredQuestions = () => {
    if (!questions) return [];

    switch (activeFilter) {
      case "popular":
        return [...questions].sort(
          (a, b) => (b.upvoteCount || 0) - (a.upvoteCount || 0)
        );
      case "unanswered":
        // If answers are not present, use totalReplies
        return questions.filter((q) => !q.totalReplies || q.totalReplies === 0);
      case "newest":
      default:
        return [...questions].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  };

  const filteredQuestions = getFilteredQuestions();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-red-400">
            <h2 className="text-xl font-semibold mb-2">
              Error loading questions
            </h2>
            <p>Please try again later.</p>
          </div>
        </main>
      </div>
    );
  }

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
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                  >
                    <div className="flex items-start space-x-4">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <div className="flex space-x-2">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : filteredQuestions.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center text-gray-400">
                  <h3 className="text-lg font-semibold mb-2">
                    No questions found
                  </h3>
                  <p>Be the first to ask a question!</p>
                </div>
              ) : (
                filteredQuestions.map((question) => (
                  <QuestionCard key={question._id} question={question} />
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  let pageNum: number;
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
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-[2.5rem] ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "border-gray-600 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
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
            {/* Popular Tags section - only show on md and up */}
            <div className="hidden md:block">
              <section className="mt-8 bg-gray-800 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Popular Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {[
                    "javascript",
                    "react",
                    "python",
                    "sql",
                    "nodejs",
                    "css",
                    "html",
                    "typescript",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
