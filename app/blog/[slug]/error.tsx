"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500 dark:text-red-400" />
        <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4">
          Something went wrong!
        </h2>
        <p className="text-red-600 dark:text-red-400 mb-6">
          An error occurred while loading this blog post.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center h-10 px-6 font-medium 
                   bg-red-600 text-white rounded-lg hover:bg-red-700 
                   transition-colors duration-200"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
