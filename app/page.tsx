import BlogPost from "@/components/blog-posts";
import Sidebar from "@/components/sidebar";

const blogPosts = [
  {
    title: "Getting Started with Next.js",
    excerpt:
      "Learn how to build modern web applications with Next.js, a powerful React framework.",
    date: "May 15, 2023",
    author: "John Doe",
    slug: "getting-started-with-nextjs",
    imageUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    tags: ["Next.js", "React", "Web Development"],
  },
  {
    title: "Mastering Tailwind CSS",
    excerpt:
      "Discover the power of utility-first CSS with Tailwind and create beautiful, responsive designs.",
    date: "May 10, 2023",
    author: "Jane Smith",
    slug: "mastering-tailwind-css",
    imageUrl:
      "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    tags: ["CSS", "Tailwind", "Design"],
  },
  {
    title: "The Future of Web Development",
    excerpt:
      "Explore emerging trends and technologies that will shape the future of web development.",
    date: "May 5, 2023",
    author: "Alex Johnson",
    slug: "future-of-web-development",
    imageUrl:
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    tags: ["Web Development", "Technology", "Trends"],
  },
];

const categories = ["Web Development", "Design", "Technology", "Programming"];

const recentPosts = [
  {
    title: "Getting Started with Next.js",
    slug: "getting-started-with-nextjs",
  },
  { title: "Mastering Tailwind CSS", slug: "mastering-tailwind-css" },
  { title: "The Future of Web Development", slug: "future-of-web-development" },
];

export default function Home() {
  return (
    <div className="flex flex-col lg:flex-row gap-12">
      <div className="lg:w-2/3">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
          Latest Posts
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          {blogPosts.map((post) => (
            <BlogPost key={post.slug} {...post} />
          ))}
        </div>
      </div>
      <div className="lg:w-1/3">
        <Sidebar categories={categories} recentPosts={recentPosts} />
      </div>
    </div>
  );
}
