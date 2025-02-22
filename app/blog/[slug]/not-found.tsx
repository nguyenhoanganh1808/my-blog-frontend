import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto text-center py-16">
      <FileQuestion className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Post Not Found
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Sorry, the blog post you&apos;re looking for doesn&apos;t exist or has
        been removed.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center h-10 px-6 font-medium 
                 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                 transition-colors duration-200"
      >
        Return Home
      </Link>
    </div>
  );
}
