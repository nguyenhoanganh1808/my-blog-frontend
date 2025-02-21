"use client";

import Image from "next/image";
import Link from "next/link";
import { Tag } from "lucide-react";
import { motion } from "framer-motion";

interface BlogPostProps {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  slug: string;
  imageUrl: string;
  tags: string[];
}

export default function BlogPost({
  title,
  excerpt,
  date,
  author,
  slug,
  imageUrl,
  tags,
}: BlogPostProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden group"
    >
      <Link
        href={`/blog/${slug}`}
        className="block relative h-48 md:h-64 w-full overflow-hidden"
      >
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="transition-transform duration-500 group-hover:scale-110"
        />
      </Link>
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, index) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full text-xs flex items-center
                       hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors duration-200 cursor-pointer"
            >
              <Tag size={12} className="mr-1" />
              {tag}
            </motion.span>
          ))}
        </div>
        <h2 className="text-xl font-bold mb-2">
          <Link
            href={`/blog/${slug}`}
            className="text-gray-800 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
          >
            {title}
          </Link>
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
          {excerpt}
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center text-sm text-gray-500 dark:text-gray-400"
        >
          <Image
            src={`https://ui-avatars.com/api/?name=${author}&background=random`}
            alt={author}
            width={24}
            height={24}
            className="rounded-full mr-2"
          />
          <span>{author}</span>
          <span className="mx-2">•</span>
          <time>{date}</time>
        </motion.div>
      </div>
    </motion.article>
  );
}
