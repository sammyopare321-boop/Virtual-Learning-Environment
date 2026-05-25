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
