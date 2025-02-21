"use client";

import Link from "next/link";
import { Tag, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface SidebarProps {
  categories: string[];
  recentPosts: { title: string; slug: string }[];
}

export default function Sidebar({ categories, recentPosts }: SidebarProps) {
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
          Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/category/${category.toLowerCase()}`}
                className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full text-sm 
                         hover:bg-purple-200 dark:hover:bg-purple-800 transition-all duration-200 hover:shadow-md inline-block"
              >
                {category}
              </Link>
            </motion.div>
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
              key={post.slug}
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
