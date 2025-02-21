"use client";

import { useEffect, useState, useCallback } from "react";
import BlogPost from "./blog-posts";
import Sidebar from "../components/sidebar";
import Pagination from "../components/pagination";
import PostsLoading from "./posts-loading";
import { motion, AnimatePresence } from "framer-motion";

export interface Author {
  id: number;
  name: string;
  email: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: Author;
  slug: string;
  coverPhoto: string;
  tags: Tag[];
}

interface Pagination {
  page: number;
  totalPages: number;
  totalPosts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ApiResponse {
  data: Post[];
  pagination: Pagination;
}

const POSTS_PER_PAGE = 6;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    totalPages: 1,
    totalPosts: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarLoading, setIsSidebarLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarError, setSidebarError] = useState<string | null>(null);

  const fetchPosts = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_URL}/posts?page=${page}&limit=${POSTS_PER_PAGE}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      setPosts(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSidebarData = useCallback(async () => {
    setIsSidebarLoading(true);
    setSidebarError(null);

    try {
      // Fetch tags and recent posts in parallel
      const [tagsResponse, recentPostsResponse] = await Promise.all([
        fetch(`${API_URL}/tags`, {
          headers: {
            "Content-Type": "application/json",
          },
        }),
        fetch(`${API_URL}/posts/recent`, {
          headers: {
            "Content-Type": "application/json",
          },
        }),
      ]);

      if (!tagsResponse.ok || !recentPostsResponse.ok) {
        throw new Error("Failed to fetch sidebar data");
      }

      const tagsData = await tagsResponse.json();
      const recentPostsData = await recentPostsResponse.json();

      setTags(tagsData.data);
      setRecentPosts(recentPostsData.data);
    } catch (error) {
      console.error("Error fetching sidebar data:", error);
      setSidebarError("Failed to load sidebar data. Please try again later.");
    } finally {
      setIsSidebarLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(1);
    fetchSidebarData();
  }, [fetchPosts, fetchSidebarData]);

  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchPosts(page);
  };

  const handleRetry = () => {
    if (error) {
      fetchPosts(pagination.page);
    }
    if (sidebarError) {
      fetchSidebarData();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      <div className="lg:w-2/3">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
          Latest Posts
          {!isLoading && !error && (
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-4">
              Page {pagination.page} of {pagination.totalPages}
            </span>
          )}
        </h2>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
            <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
            <button
              onClick={handleRetry}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline"
            >
              Try again
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {isLoading ? (
            <PostsLoading />
          ) : (
            <motion.div
              key={pagination.page}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid gap-8 md:grid-cols-2"
            >
              {posts.map((post) => (
                <BlogPost key={post.id} {...post} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!isLoading && !error && posts.length > 0 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {!isLoading && !error && posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No posts found.</p>
          </div>
        )}
      </div>
      <div className="lg:w-1/3">
        <Sidebar
          tags={tags}
          recentPosts={recentPosts}
          isLoading={isSidebarLoading}
          error={sidebarError}
          onRetry={handleRetry}
        />
      </div>
    </div>
  );
}
