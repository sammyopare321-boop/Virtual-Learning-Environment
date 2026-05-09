import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from Cloudinary
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  // Proxy API calls in development to avoid CORS issues locally
  async rewrites() {
    return process.env.NODE_ENV === 'development' ? [
      {
        source: '/api/:path*',
        destination: 'https://virtual-learning-environment-th7m.onrender.com/api/:path*',
      },
    ] : [];
  },
};

export default nextConfig;
