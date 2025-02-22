export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-8" />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        <div className="h-[400px] bg-gray-200 dark:bg-gray-700 animate-pulse" />

        <div className="p-8">
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
              />
            ))}
          </div>

          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4 w-3/4" />

          <div className="flex items-center gap-6 mb-8">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                style={{ width: `${Math.random() * 40 + 60}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
