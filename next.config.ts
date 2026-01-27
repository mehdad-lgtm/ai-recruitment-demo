import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  
  // Configure external packages for server components
  serverExternalPackages: ["argon2"],
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
    // Cloudflare Pages handles images efficiently
    unoptimized: false,
  },

  // Cloudflare optimizations
  swcMinify: true,
  compress: true,
  
  // Static generation timeout
  staticPageGenerationTimeout: 120,
  
  // Optimize for edge deployment
  onDemandEntries: {
    maxInactiveAge: 25 * 60 * 1000,
    pagesBufferLength: 5,
  },
};

export default nextConfig;
