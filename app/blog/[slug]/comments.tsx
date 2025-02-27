"use client";

import { useCallback, useEffect, useOptimistic, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Loader2, MessageCircle, User } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { API_URL } from "@/lib/constants";
import { Comment, CommentResponse, Pagination } from "@/lib/types";
import CommentPagination from "./comment-pagination";

interface CommentsProps {
  postId: number;
}
const ITEMS_PER_PAGE = 5;

export default function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<Pagination>({
    page: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state: Comment[], newComment: Comment) =>
      [newComment, ...state].slice(0, ITEMS_PER_PAGE)
  );

  const fetchComments = useCallback(
    async (page: number) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_URL}/posts/${postId}/comments?page=${page}&limit=${ITEMS_PER_PAGE}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }

        const data: CommentResponse = await response.json();
        setComments(data.data);
        setMeta(data.pagination);
        setCurrentPage(page);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setError("Failed to load comments. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    },
    [postId]
  );

  useEffect(() => {
    fetchComments(1);
  }, [postId, fetchComments]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        <h2 className="text-xl font-semibold">Comments ({meta.totalItems})</h2>
      </div>

      <CommentForm
        postId={postId}
        addOptimisticComment={addOptimisticComment}
        onCommentAdded={() => fetchComments(1)}
      />

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
          <button
            onClick={() => fetchComments(currentPage)}
            className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline"
          >
            Try again
          </button>
        </div>
      )}

      <AnimatePresence mode="popLayout" initial={false}>
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center py-8"
          >
            <Loader2 className="w-6 h-6 animate-spin text-purple-600 dark:text-purple-400" />
          </motion.div>
        ) : optimisticComments.length > 0 ? (
          <motion.div className="space-y-4">
            {optimisticComments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-1">
                    <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {comment.username}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {comment.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 dark:text-gray-400 py-8"
          >
            No comments yet. Be the first to comment!
          </motion.p>
        )}
      </AnimatePresence>

      {meta.totalPages > 1 && (
        <CommentPagination
          currentPage={currentPage}
          totalPages={meta.totalPages}
          onPageChange={fetchComments}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

function CommentForm({
  postId,
  addOptimisticComment,
  onCommentAdded,
}: {
  postId: number;
  addOptimisticComment: (comment: Comment) => void;
  onCommentAdded: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);

    const username = formData.get("username") as string;
    const text = formData.get("text") as string;

    // Add optimistic update
    addOptimisticComment({
      id: Math.random(), // This will be replaced by the real ID from the server
      username,
      text,
      createdAt: new Date().toISOString(),
    });

    try {
      const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, text }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit comment");
      }

      // Reset form
      const form = document.getElementById("comment-form") as HTMLFormElement;
      form.reset();

      // Refresh comments to get the latest data
      onCommentAdded();
    } catch (error) {
      console.error("Error submitting comment:", error);
      setError("Failed to submit comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form id="comment-form" action={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="username"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          required
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                   focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 
                   focus:border-transparent outline-none transition duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="text"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Comment
        </label>
        <textarea
          id="text"
          name="text"
          required
          disabled={isSubmitting}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                   focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 
                   focus:border-transparent outline-none transition duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 
                 transition-colors duration-200 focus:outline-none focus:ring-2 
                 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
                 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Submitting...
          </span>
        ) : (
          "Submit Comment"
        )}
      </button>
    </form>
  );
}
