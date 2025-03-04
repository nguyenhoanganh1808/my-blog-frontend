import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import type { Metadata } from "next";

// Metadata
export const metadata: Metadata = {
  title: "About | My Blog",
  description: "Learn more about me and my journey in web development",
};

// Profile Information
const profile = {
  name: "Nguyen Hoang Anh",
  avatar: "https://avatars.githubusercontent.com/u/82761891?v=4",
  coverImage:
    "https://res.cloudinary.com/dz7ufzk3g/image/upload/v1741053817/blog_app/1741053816795-lord-rings-mountains-cast-silhouettes-260nw-2505924549.webp",
  email: "nguyenhoanganh.it2003@gmail.com",
  socialLinks: [
    {
      href: "https://github.com/nguyenhoanganh1808",
      label: "GitHub",
      icon: Github,
    },
    // { href: "https://twitter.com", label: "Twitter", icon: Twitter },
    {
      href: "https://www.linkedin.com/in/anh-nguy%E1%BB%85n-ho%C3%A0ng-41116b314/",
      label: "LinkedIn",
      icon: Linkedin,
    },
  ],
};

// Tech Stack
const techStack = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "Express",
  "PostgreSQL",
  "Docker",
  "Nginx",
  "Redis",
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        {/* Cover Image */}
        <div className="relative h-[300px] md:h-[400px]">
          <Image
            src={profile.coverImage}
            alt="Cover image"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Image */}
            <div className="relative w-32 h-32 md:w-48 md:h-48 -mt-20 md:-mt-24 rounded-xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
              <Image
                src={profile.avatar}
                alt="Profile picture"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {profile.name}
              </h1>

              {/* Social Links */}
              <div className="flex flex-wrap gap-4 mb-6">
                {profile.socialLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </Link>
                ))}
                <Link
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>Email</span>
                </Link>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="prose prose-purple dark:prose-invert max-w-none mt-8">
            <h2>About Me</h2>
            <p>
              Hey there! 👋 I&apos;m a final-year IT student passionate about
              backend development and building scalable systems. I specialize in
              Node.js, TypeScript, Prisma, and Next.js, with experience in
              PostgreSQL, Redis, Docker, and AWS. My goal is to become a backend
              engineer and eventually a Solution Architect. <br />
              <br /> I love coding, games, and movies—follow my journey as I
              share projects and insights!
            </p>

            {/* <h2>My Journey</h2>
            <p>
              My journey in web development started when I built my first
              website using HTML and CSS. Since then, I&apos;ve been constantly
              learning and exploring new technologies. I&apos;ve worked with
              various startups and companies, helping them build scalable web
              applications and improve their user experience.
            </p> */}

            <h2>What I Do</h2>
            <ul>
              <li>Frontend Development with React and Next.js</li>
              <li>API Development with Node.js and Express</li>
              <li>Performance Optimization</li>
              <li>Technical Writing and Documentation</li>
            </ul>

            {/* Tech Stack */}
            <h2>Tech Stack</h2>
            <p>Here are some of the technologies I work with:</p>
            <div className="not-prose grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
              {techStack.map((tech) => (
                <div
                  key={tech}
                  className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-lg text-center"
                >
                  {tech}
                </div>
              ))}
            </div>

            <h2>Let&apos;s Connect</h2>
            <p>
              I&apos;m always interested in new opportunities and
              collaborations. Feel free to reach out to me through any of the
              social links above or visit my{" "}
              <Link href="/contact">contact page</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
