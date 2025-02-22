"use client";

import type React from "react";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { useDebouncedCallback } from "use-debounce";

export default function SearchBar() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useDebouncedCallback((term: string) => {
    if (term) {
      startTransition(() => {
        router.push(`/?search=${encodeURIComponent(term)}`);
      });
    } else {
      startTransition(() => {
        router.push("/");
      });
    }
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleSearch(value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsExpanded(false);
    startTransition(() => {
      router.push("/");
    });
  };

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
          className={`w-full h-10 bg-gray-100 dark:bg-gray-700 rounded-full outline-none transition-shadow duration-200 
                   focus:shadow-[0_0_0_2px] focus:shadow-purple-500 dark:focus:shadow-purple-400 px-10
                   ${isPending ? "text-gray-400 dark:text-gray-500" : ""}`}
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsExpanded(true)}
        />
        {isPending ? (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 border-2 border-purple-500 dark:border-purple-400 rounded-full border-t-transparent animate-spin" />
          </div>
        ) : (
          <Search
            size={20}
            className={`absolute left-3 top-1/2 -translate-y-1/2 transition-opacity duration-200
                     ${isExpanded ? "opacity-100" : "opacity-0"}
                     text-gray-500 dark:text-gray-400`}
          />
        )}

        <button
          onClick={isExpanded ? clearSearch : () => setIsExpanded(true)}
          className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-gray-500 dark:text-gray-400
                   hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
        >
          {isExpanded ? <X size={20} /> : <Search size={20} />}
        </button>
      </motion.div>
    </div>
  );
}
