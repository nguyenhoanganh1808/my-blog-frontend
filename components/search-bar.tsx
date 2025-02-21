"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative flex items-center">
      <motion.div
        initial={false}
        animate={{
          width: isExpanded ? "300px" : "40px",
        }}
        className="relative"
      >
        <motion.input
          initial={false}
          animate={{
            paddingLeft: isExpanded ? "2.5rem" : "0",
            paddingRight: isExpanded ? "2.5rem" : "0",
            opacity: isExpanded ? 1 : 0,
          }}
          type="text"
          placeholder="Search articles..."
          className="w-full h-10 bg-gray-100 dark:bg-gray-700 rounded-full outline-none transition-shadow duration-200 
                   focus:shadow-[0_0_0_2px] focus:shadow-purple-500 dark:focus:shadow-purple-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-gray-500 dark:text-gray-400
                   hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
        >
          {isExpanded ? <X size={20} /> : <Search size={20} />}
        </button>
        {isExpanded && searchQuery && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-12 left-0 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50"
            >
              <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                Search results for &quot;{searchQuery}&quot;...
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
}
