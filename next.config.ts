import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: "export",
  images: {
    domains: [
      "images.unsplash.com",
      "ui-avatars.com",
      "res.cloudinary.com",
      "source.unsplash.com",
      "avatars.githubusercontent.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
