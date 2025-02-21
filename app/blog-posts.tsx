"use client";

import Image from "next/image";
import Link from "next/link";
import { Tag } from "lucide-react";
import { motion } from "framer-motion";
import { Tag as TagType } from "./page";
import { Author } from "next/dist/lib/metadata/types/metadata-types";
import { formatPostDate } from "@/lib/utils";

interface BlogPostProps {
  title: string;
  content: string;
  createdAt: string;
  author: Author;
  slug: string;
  coverPhoto: string;
  tags: TagType[];
}

export default function BlogPost({
  title,
  content,
  createdAt,
  author,
  slug,
  coverPhoto,
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
          src={coverPhoto || "/placeholder.svg"}
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
              key={tag.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full text-xs flex items-center
                       hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors duration-200 cursor-pointer"
            >
              <Tag size={12} className="mr-1" />
              {tag.name}
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
          {content}
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center text-sm text-gray-500 dark:text-gray-400"
        >
          <Image
            src={`https://ui-avatars.com/api/?name=${author.name}&background=random`}
            alt={author.name || "Author"}
            width={24}
            height={24}
            className="rounded-full mr-2"
          />
          <span>{author.name}</span>
          <span className="mx-2">•</span>
          <time>{formatPostDate(createdAt)}</time>
        </motion.div>
      </div>
    </motion.article>
  );
}
