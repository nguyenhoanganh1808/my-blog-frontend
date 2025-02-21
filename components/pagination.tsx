"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show only 5 page numbers at a time
  const getVisiblePages = () => {
    if (totalPages <= 5) return pages;

    if (currentPage <= 3) return pages.slice(0, 5);
    if (currentPage >= totalPages - 2) return pages.slice(totalPages - 5);

    return pages.slice(currentPage - 3, currentPage + 2);
  };

  return (
    <motion.div
      className="flex items-center justify-center space-x-2 my-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 
                 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-100 
                 dark:hover:bg-purple-900 transition-colors duration-200"
        aria-label="Previous page"
      >
        <ChevronLeft size={20} />
      </button>

      {getVisiblePages().map((page) => (
        <motion.button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors duration-200
                    ${
                      currentPage === page
                        ? "bg-purple-600 text-white"
                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900"
                    }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {page}
        </motion.button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 
                 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-100 
                 dark:hover:bg-purple-900 transition-colors duration-200"
        aria-label="Next page"
      >
        <ChevronRight size={20} />
      </button>
    </motion.div>
  );
}
