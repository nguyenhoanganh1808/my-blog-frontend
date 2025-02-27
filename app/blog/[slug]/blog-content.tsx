"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  tomorrow,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogContentProps {
  content: string;
}

export default function BlogContent({ content }: BlogContentProps) {
  const { theme } = useTheme();

  // Function to determine language from code block
  const getLanguage = (code: string): string => {
    // Check if it's a shell command
    if (
      code.trim().startsWith("$") ||
      code.includes("npm ") ||
      code.includes("curl ") ||
      code.includes("mkdir ") ||
      code.includes("cd ")
    ) {
      return "bash";
    }

    // Check for common languages
    if (code.includes("const ") || code.includes("function "))
      return "javascript";
    if (code.includes("import ") && code.includes("from ")) return "typescript";
    if (code.includes("<") && code.includes(">")) return "markup";

    // Default to plaintext
    return "plaintext";
  };

  const CodeBlock = ({
    code,
    language,
  }: {
    code: string;
    language: string;
  }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="relative group my-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="absolute right-2 top-2 z-10">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCopy}
            className="h-8 w-8 rounded-md bg-gray-800/30 hover:bg-gray-800/50 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4 text-gray-400" />
            )}
            <span className="sr-only">Copy code</span>
          </Button>
        </div>
        <div className="absolute left-2 top-2 z-10">
          <span
            className="px-2 py-1 rounded-md bg-gray-800/30 text-xs text-gray-400 
                         font-mono uppercase opacity-0 group-hover:opacity-100 
                         transition-opacity duration-200"
          >
            {language}
          </span>
        </div>
        <SyntaxHighlighter
          language={language}
          style={theme === "dark" ? tomorrow : oneLight}
          showLineNumbers={true}
          wrapLines={true}
          lineNumberStyle={{
            minWidth: "2.5em",
            paddingRight: "1em",
            color: theme === "dark" ? "#666" : "#999",
            textAlign: "right",
            userSelect: "none",
          }}
          className="rounded-lg !mt-0 !bg-gray-900 dark:!bg-gray-900/50"
          customStyle={{
            padding: "2.5rem 1rem 1rem 1rem",
            fontSize: "0.875rem",
            lineHeight: "1.5",
            margin: 0,
          }}
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    );
  };

  // Process content to enhance code blocks
  const processContent = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Process code blocks
    doc.querySelectorAll("pre code").forEach((block) => {
      const code = block.textContent || "";
      const language = getLanguage(code);

      const wrapper = doc.createElement("div");
      wrapper.className = "code-block my-6";
      wrapper.innerHTML = `
        <CodeBlock code={\`${code}\`} language="${language}" />
      `;

      block.parentElement?.replaceWith(wrapper);
    });

    // Process inline code
    doc.querySelectorAll("code:not(pre code)").forEach((element) => {
      element.className =
        "px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 font-mono text-sm";
    });

    // Remove empty paragraphs
    doc.querySelectorAll("p").forEach((p) => {
      if (p.innerHTML.trim() === "&nbsp;") {
        p.remove();
      }
    });

    return doc.body.innerHTML;
  };

  return (
    <div
      className="prose prose-purple dark:prose-invert max-w-none
                 prose-headings:scroll-mt-20 prose-headings:font-bold
                 prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-7 prose-p:my-6
                 prose-li:text-gray-700 dark:prose-li:text-gray-300
                 prose-code:text-purple-600 dark:prose-code:text-purple-400
                 prose-pre:bg-transparent prose-pre:p-0 prose-pre:my-0
                 prose-ul:my-6 prose-li:my-2
                 prose-strong:text-gray-900 dark:prose-strong:text-gray-100
                 [&_.code-block]:my-6 [&_.code-block]:rounded-lg [&_.code-block]:shadow-lg"
    >
      <div dangerouslySetInnerHTML={{ __html: processContent(content) }} />
    </div>
  );
}
