"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useQuestions } from "@/hooks/useStackitApi";
import Header from "@/components/Header";
import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "sonner";

export default function AskQuestion() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { createQuestion, createState } = useQuestions();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  if (!isAuthenticated) {
    router.push("/");
    return null;
  }

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || tags.length === 0) {
      return;
    }

    try {
      await createQuestion({
        title: title.trim(),
        description: description.trim(),
        tags,
      });
      toast.success("Question submitted successfully!");
      router.push("/");
    } catch (error: any) {
      console.error("Failed to submit question:", error);
      toast.error(error.data?.message || "Failed to submit question");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Ask a Question</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-white">
                Title <span className="text-red-400">*</span>
              </Label>
              <p className="text-sm text-gray-400 mb-2">
                Be specific and imagine you&apos;re asking a question to another
                person
              </p>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How to join two tables in SQL?"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>

            <div>
              <Label className="text-white">
                Description <span className="text-red-400">*</span>
              </Label>
              <p className="text-sm text-gray-400 mb-2">
                Include all the information someone would need to answer your
                question
              </p>
              <RichTextEditor
                content={description}
                onChange={setDescription}
                placeholder="Describe your problem in detail..."
              />
            </div>

            <div>
              <Label className="text-white">
                Tags <span className="text-red-400">*</span>
              </Label>
              <p className="text-sm text-gray-400 mb-2">
                Add up to 5 tags to describe what your question is about
              </p>

              <div className="space-y-3">
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-blue-600 text-white flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:bg-blue-700 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  onBlur={() => tagInput && addTag(tagInput)}
                  placeholder="Enter tags (press Enter or comma to add)"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  disabled={tags.length >= 5}
                />

                <div className="text-sm text-gray-400">
                  Popular tags:
                  {["javascript", "react", "python", "sql", "nodejs"].map(
                    (tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addTag(tag)}
                        className="ml-2 text-blue-400 hover:text-blue-300"
                        disabled={tags.includes(tag) || tags.length >= 5}
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <Button
                type="submit"
                disabled={
                  createState.isLoading ||
                  !title.trim() ||
                  !description.trim() ||
                  tags.length === 0
                }
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createState.isLoading ? "Submitting..." : "Submit Question"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
