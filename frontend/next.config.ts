import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from Cloudinary
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  // Proxy /api/* to the backend in both development and production.
  // API_URL is a server-side env var pointing to the backend service URL.
  // This keeps the backend URL private and avoids circular requests when
  // NEXT_PUBLIC_API_URL was mistakenly set to the frontend's own domain.
  async rewrites() {
    const backendUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
    if (!backendUrl) return [];
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Scripts: self + Jitsi external API
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://meet.jit.si",
              // Styles
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fonts
              "font-src 'self' https://fonts.gstatic.com",
              // Images
              "img-src 'self' data: blob: https://res.cloudinary.com https://*.jit.si",
              // Media (camera/mic streams)
              "media-src 'self' blob: mediastream:",
              // Frames: allow Jitsi iframe
              "frame-src 'self' https://meet.jit.si https://*.jit.si",
              // Connections: API, sockets, Jitsi WebRTC/WebSocket
              "connect-src 'self' https://*.onrender.com wss://*.onrender.com https://meet.jit.si wss://meet.jit.si https://*.jit.si wss://*.jit.si stun:* turn:*",
              // Workers for WebRTC
              "worker-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
