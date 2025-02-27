import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Tag, Calendar, User } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Comments from "./comments";
import { ApiResponse, Post } from "@/lib/types";
import { API_URL } from "@/lib/constants";
import BlogContent from "./blog-content";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const data: ApiResponse = await fetch(`${API_URL}/posts`).then((res) =>
    res.json()
  );

  return data.data.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = await getPost(params.slug);

    return {
      title: `${post.title} | My Blog`,
      description: post.content.slice(0, 160),
      openGraph: {
        title: post.title,
        description: post.content.slice(0, 160),
        images: [{ url: post.coverPhoto }],
      },
    };
  } catch (error) {
    console.log(error);
    return {
      title: "Post Not Found | My Blog",
      description: "The requested blog post could not be found.",
    };
  }
}

async function getPost(slug: string): Promise<Post> {
  const res = await fetch(`${API_URL}/posts/slug/${slug}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    notFound();
  }

  return res.json();
}

export default async function BlogPost({ params }: Props) {
  const post = await getPost(params.slug);
  const formattedDate = formatDate(post.createdAt);

  return (
    <article className="max-w-4xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 
                 dark:hover:text-purple-300 transition-colors duration-200 mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" />
        Back to posts
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        <div className="relative h-[400px] w-full">
          <Image
            src={post.coverPhoto || "/placeholder.svg"}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        </div>

        <div className="p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/?tag=${tag.slug}`}
                className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 
                         rounded-full text-sm flex items-center hover:bg-purple-200 dark:hover:bg-purple-800 
                         transition-colors duration-200"
              >
                <Tag size={14} className="mr-1" />
                {tag.name}
              </Link>
            ))}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-gray-600 dark:text-gray-400 mb-8">
            <div className="flex items-center">
              <User size={20} className="mr-2" />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={20} className="mr-2" />
              <time dateTime={post.createdAt}>{formattedDate}</time>
            </div>
          </div>

          <BlogContent content={post.content} />

          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <Comments postId={post.id} />
          </div>
        </div>
      </div>
    </article>
  );
}
