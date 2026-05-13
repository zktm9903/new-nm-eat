import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.toast.com',
      },
      {
        protocol: 'https',
        hostname: 'images.steamusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'zwavfmnwtqohwkdylpmm.supabase.co',
      },
    ],
  },
};

export default nextConfig;
