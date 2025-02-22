"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import BlogPost from "./blog-post";
import Sidebar from "../components/sidebar";
import Pagination from "../components/pagination";
import PostsLoading from "./posts-loading";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Search, X } from "lucide-react";

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

export interface Post {
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

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

  // Get current search params
  const currentPage = Number(searchParams.get("page")) || 1;
  const currentSearch = searchParams.get("search") || "";
  const currentTag = searchParams.get("tags") || "";

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      });

      return current.toString();
    },
    [searchParams]
  );

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryString = createQueryString({
        page: currentPage,
        limit: POSTS_PER_PAGE,
        search: currentSearch || null,
        tags: currentTag || null,
      });
      const response = await fetch(`${API_URL}/posts?${queryString}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

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
  }, [currentPage, currentSearch, currentTag, createQueryString]);

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
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    fetchSidebarData();
  }, [fetchSidebarData]);

  const handleSearch = useDebouncedCallback((term: string) => {
    startTransition(() => {
      const queryString = createQueryString({
        search: term || null,
        page: 1, // Reset to first page on new search
        tags: currentTag, // Maintain current tag filter
      });
      router.push(`?${queryString}`);
    });
  }, 300);

  const handleTagClick = (tagSlug: string) => {
    startTransition(() => {
      const queryString = createQueryString({
        tags: tagSlug === currentTag ? null : tagSlug, // Toggle tag filter
        page: 1, // Reset to first page on tag change
        search: currentSearch, // Maintain current search term
      });
      router.push(`?${queryString}`);
    });
  };

  const handlePageChange = (page: number) => {
    startTransition(() => {
      const queryString = createQueryString({
        page,
        search: currentSearch,
        tags: currentTag,
      });
      router.push(`?${queryString}`);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    startTransition(() => {
      router.push("/");
    });
  };

  const handleRetry = () => {
    if (error) {
      fetchPosts();
    }
    if (sidebarError) {
      fetchSidebarData();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      <div className="lg:w-2/3">
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Latest Posts
            </h2>
            {(currentSearch || currentTag) && (
              <button
                onClick={clearFilters}
                className="flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 
                         dark:hover:text-gray-200 transition-colors duration-200"
              >
                <X className="w-4 h-4 mr-1" />
                Clear filters
              </button>
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="search"
              placeholder="Search posts..."
              defaultValue={currentSearch}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                       focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 
                       focus:border-transparent outline-none transition duration-200"
            />
          </div>

          {(currentSearch || currentTag) && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Filters:</span>
              {currentSearch && (
                <span
                  className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 
                               dark:text-purple-300 rounded-full text-xs"
                >
                  Search: {currentSearch}
                </span>
              )}
              {currentTag && (
                <span
                  className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 
                               dark:text-purple-300 rounded-full text-xs"
                >
                  Tag: {currentTag}
                </span>
              )}
            </div>
          )}
        </div>

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
          {isLoading || isPending ? (
            <PostsLoading />
          ) : (
            <motion.div
              key={`${currentPage}-${currentSearch}-${currentTag}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid gap-8 md:grid-cols-2"
            >
              {posts.map((post) => (
                <BlogPost
                  key={post.id}
                  {...post}
                  onTagClick={handleTagClick}
                  activeTag={currentTag}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!isLoading && !isPending && !error && posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No posts found
              {currentSearch || currentTag ? " matching your filters" : ""}.
            </p>
          </div>
        )}

        {!isLoading && !isPending && !error && posts.length > 0 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      <div className="lg:w-1/3">
        <Sidebar
          tags={tags}
          recentPosts={recentPosts}
          isLoading={isSidebarLoading}
          error={sidebarError}
          onRetry={handleRetry}
          onTagClick={handleTagClick}
          activeTag={currentTag}
        />
      </div>
    </div>
  );
}
