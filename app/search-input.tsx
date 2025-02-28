import { useSearchParams } from "next/navigation";
import { ChangeEventHandler } from "react";

interface SearchInputProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export default function SearchInput({ onChange }: SearchInputProps) {
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") || "";

  return (
    <input
      type="search"
      placeholder="Search posts..."
      onChange={onChange}
      defaultValue={currentSearch}
      className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg 
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                       focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 
                       focus:border-transparent outline-none transition duration-200"
    />
  );
}
