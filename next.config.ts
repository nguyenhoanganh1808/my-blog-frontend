import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "ui-avatars.com", "res.cloudinary.com"],
  },
};

export default nextConfig;
