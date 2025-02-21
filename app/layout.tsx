import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { ModeToggle } from "../components/mode-toggle";
import SearchBar from "../components/search-bar";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Blog",
  description: "A simple blog built with Next.js and Tailwind CSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <Link
                  href="/"
                  className="text-2xl font-bold text-purple-600 dark:text-purple-400 hover:scale-105 transition-transform duration-200"
                >
                  My Blog
                </Link>
                <nav className="hidden md:flex items-center space-x-6">
                  {["Home", "About", "Contact"].map((item) => (
                    <Link
                      key={item}
                      href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                      className="relative text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200
                               after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-purple-600 dark:after:bg-purple-400
                               after:left-0 after:bottom-0 after:rounded-full after:origin-left after:scale-x-0 hover:after:scale-x-100
                               after:transition-transform after:duration-300"
                    >
                      {item}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="mt-4 flex items-center justify-end space-x-4">
                <SearchBar />
                <ModeToggle />
              </div>
            </div>
          </header>
          <main className="container mx-auto px-4 py-12">{children}</main>
          <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md mt-12">
            <div className="container mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-400">
              <p>&copy; 2023 My Blog. All rights reserved.</p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
