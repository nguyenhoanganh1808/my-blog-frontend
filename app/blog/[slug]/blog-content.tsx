"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
// import DOMPurify from "dompurify";

import parse, {
  domToReact,
  type HTMLReactParserOptions,
  Element,
  attributesToProps,
  DOMNode,
} from "html-react-parser";

interface BlogContentProps {
  content: string;
  className?: string;
}

const BlogContent: React.FC<BlogContentProps> = ({
  content,
  className = "",
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const [sanitizedContent, setSanitizedContent] = useState<string>("");

  useEffect(() => {
    const sanitizeContent = async () => {
      const DOMPurify = (await import("dompurify")).default;
      const sanitized = DOMPurify.sanitize(content, {
        ADD_TAGS: ["iframe"],
        ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
      });
      setSanitizedContent(sanitized);
    };

    sanitizeContent();
  }, [content]);

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.name === "pre") {
        const codeElement = domNode.children.find(
          (child): child is Element =>
            child instanceof Element && child.name === "code"
        );

        if (codeElement) {
          const className = codeElement.attribs.class || "";
          const language = className.replace("language-", "") || "javascript";
          const codeContent = domToReact(
            codeElement.children as unknown as DOMNode[],
            options
          ).toString();

          return (
            <div className="relative my-6 rounded-lg overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-bl-lg font-mono z-10">
                {language}
              </div>
              <SyntaxHighlighter
                language={language}
                style={atomDark}
                showLineNumbers={true}
                lineNumberStyle={{ minWidth: "2.5em" }}
                lineProps={{ style: { display: "block" } }}
                wrapLines={true}
                customStyle={{
                  margin: 0,
                  borderRadius: "0.5rem",
                  padding: "1.5rem 1rem",
                  fontSize: "0.875rem",
                }}
                lineNumberContainerStyle={{
                  float: "left",
                  paddingRight: "0.5em",
                  userSelect: "none",
                }}
                showInlineLineNumbers={true}
                // renderlinenumber={(lineNumber: number) => (
                //   <LineNumber lineNumber={lineNumber} />
                // )}
              >
                {codeContent}
              </SyntaxHighlighter>
            </div>
          );
        }
      }

      if (domNode instanceof Element && domNode.name === "img") {
        const props = attributesToProps(domNode.attribs);
        const caption = props.alt;

        return (
          <figure className="my-6">
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img
                {...props}
                className="rounded-lg my-4 max-w-full h-auto"
                alt={(props.alt as string) || ""}
              />
            }
            {caption && (
              <figcaption className="text-center text-sm text-muted-foreground mt-2 italic">
                {caption}
              </figcaption>
            )}
          </figure>
        );
      }

      if (domNode instanceof Element && domNode.name === "a") {
        const props = attributesToProps(domNode.attribs);
        const isExternal =
          props.href &&
          typeof props.href === "string" &&
          !props.href.startsWith("/") &&
          !props.href.startsWith("#");

        if (isExternal) {
          return (
            <a
              {...props}
              className="text-primary hover:text-primary/80 underline transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {domToReact(domNode.children as unknown as DOMNode[], options)}
            </a>
          );
        }

        return (
          <a
            {...props}
            className="text-primary hover:text-primary/80 underline transition-colors"
          >
            {domToReact(domNode.children as unknown as DOMNode[], options)}
          </a>
        );
      }

      if (domNode instanceof Element && /^h[1-6]$/.test(domNode.name)) {
        const level = Number.parseInt(domNode.name.substring(1));
        const props = attributesToProps(domNode.attribs);
        const content = domToReact(
          domNode.children as unknown as DOMNode[],
          options
        );
        const id =
          props.id ||
          (typeof content === "string"
            ? content
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^\w-]+/g, "")
            : "");

        const headingClasses = `
          mt-8 mb-4 font-bold tracking-tight
          ${level === 1 ? "text-4xl" : ""}
          ${level === 2 ? "text-3xl" : ""}
          ${level === 3 ? "text-2xl" : ""}
          ${level === 4 ? "text-xl" : ""}
          ${level === 5 ? "text-lg" : ""}
          ${level === 6 ? "text-base" : ""}
        `;

        const HeadingTag = domNode.name as keyof HTMLElementTagNameMap;

        return (
          <HeadingTag id={id as string} className={headingClasses}>
            {content}
            <a
              href={`#${id}`}
              className="ml-2 text-muted-foreground opacity-0 hover:opacity-100 transition-opacity"
            >
              #
            </a>
          </HeadingTag>
        );
      }

      if (
        domNode instanceof Element &&
        (domNode.name === "ul" || domNode.name === "ol")
      ) {
        const props = attributesToProps(domNode.attribs);
        const listClasses = `my-4 pl-6 ${
          domNode.name === "ul" ? "list-disc" : "list-decimal"
        }`;

        const ListTag = domNode.name as keyof HTMLElementTagNameMap;

        return (
          <ListTag {...props} className={listClasses}>
            {domToReact(domNode.children as unknown as DOMNode[], options)}
          </ListTag>
        );
      }

      if (domNode instanceof Element && domNode.name === "blockquote") {
        return (
          <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
            {domToReact(domNode.children as unknown as DOMNode[], options)}
          </blockquote>
        );
      }

      if (domNode instanceof Element && domNode.name === "table") {
        return (
          <div className="overflow-x-auto my-6">
            <table className="min-w-full divide-y divide-border">
              {domToReact(domNode.children as unknown as DOMNode[], options)}
            </table>
          </div>
        );
      }

      if (domNode instanceof Element && domNode.name === "thead") {
        return (
          <thead className="bg-muted">
            {domToReact(domNode.children as unknown as DOMNode[], options)}
          </thead>
        );
      }

      if (domNode instanceof Element && domNode.name === "tbody") {
        return (
          <tbody className="divide-y divide-border">
            {domToReact(domNode.children as unknown as DOMNode[], options)}
          </tbody>
        );
      }

      if (domNode instanceof Element && domNode.name === "tr") {
        const props = attributesToProps(domNode.attribs);
        const index = props["data-index"]
          ? Number.parseInt(props["data-index"] as string)
          : 0;
        const rowClass = index % 2 === 0 ? "bg-background" : "bg-muted/50";

        return (
          <tr className={rowClass}>
            {domToReact(domNode.children as unknown as DOMNode[], options)}
          </tr>
        );
      }

      if (domNode instanceof Element && domNode.name === "th") {
        return (
          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {domToReact(domNode.children as unknown as DOMNode[], options)}
          </th>
        );
      }

      if (domNode instanceof Element && domNode.name === "td") {
        return (
          <td className="px-4 py-2 text-sm">
            {domToReact(domNode.children as unknown as DOMNode[], options)}
          </td>
        );
      }
      return null;
    },
  };

  // Process table rows to add index for zebra striping
  useEffect(() => {
    if (!contentRef.current) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitizedContent, "text/html");

    // Add data-index to table rows for zebra striping
    const tableRows = doc.querySelectorAll("tbody tr");
    tableRows.forEach((row, index) => {
      row.setAttribute("data-index", index.toString());
    });

    // Instead of replacing content, just update tables inside the existing DOM
    tableRows.forEach((row, index) => {
      const existingRow = contentRef.current?.querySelector(
        `tbody tr:nth-child(${index + 1})`
      );
      if (existingRow) {
        existingRow.setAttribute("data-index", index.toString());
      }
    });
  }, [sanitizedContent]);

  return (
    <div
      className={`blog-content prose prose-stone dark:prose-invert max-w-none ${className}`}
    >
      {parse(content, options)}
    </div>
  );
};

export default BlogContent;
