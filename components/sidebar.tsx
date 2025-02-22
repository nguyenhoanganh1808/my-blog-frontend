"use client";

import Link from "next/link";
import { Tag, Clock, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Tag as TagType } from "@/lib/types";

interface RecentPost {
  id: number;
  title: string;
  slug: string;
}

interface SidebarProps {
  tags: TagType[];
  recentPosts: RecentPost[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onTagClick: (tagSlug: string) => void;
  activeTag: string;
}

export default function Sidebar({
  tags,
  recentPosts,
  isLoading,
  error,
  onTagClick,
  activeTag,
  onRetry,
}: SidebarProps) {
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="inline-flex items-center text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
        >
          <RefreshCw size={16} className="mr-2" />
          Try again
        </button>
      </div>
    );
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
      >
        <h3 className="text-xl font-bold mb-4 text-purple-600 dark:text-purple-400 flex items-center">
          <Tag className="mr-2" />
          Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <motion.button
              key={tag.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onTagClick(tag.slug)}
              className={`px-3 py-1 rounded-full text-sm transition-all duration-200 hover:shadow-md
              ${
                tag.slug === activeTag
                  ? "bg-purple-600 text-white dark:bg-purple-500"
                  : "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800"
              }`}
            >
              {tag.name}
            </motion.button>
          ))}
        </div>
      </motion.div>
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
      >
        <h3 className="text-xl font-bold mb-4 text-purple-600 dark:text-purple-400 flex items-center">
          <Clock className="mr-2" />
          Recent Posts
        </h3>
        <ul className="space-y-4">
          {recentPosts.map((post, index) => (
            <motion.li
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-b border-gray-200 dark:border-gray-700 pb-2 last:border-b-0"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 
                       transition-colors duration-200 block hover:translate-x-1 transform"
              >
                {post.title}
              </Link>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.aside>
  );
}
