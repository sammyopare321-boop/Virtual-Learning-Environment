import type { Metadata } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "UniLearn | The Intelligent Academic Workspace",
  description: "Experience the future of education with UniLearn. A premium, enterprise-grade SaaS platform for students, educators, and institutions.",
  keywords: ["LMS", "University Management", "SaaS", "Education Technology", "Academic Analytics"],
  openGraph: {
    title: "UniLearn | The Intelligent Academic Workspace",
    description: "Experience the future of education with UniLearn. A premium, enterprise-grade SaaS platform for students, educators, and institutions.",
    url: "https://unilearn.edu",
    siteName: "UniLearn",
    images: [
      {
        url: "https://unilearn.edu/og-image.png",
        width: 1200,
        height: 630,
        alt: "UniLearn Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UniLearn | The Intelligent Academic Workspace",
    description: "The intelligent academic workspace for modern institutions.",
    images: ["https://unilearn.edu/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  }
};

import { SocketProvider } from "@/context/SocketContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { SentinelProvider } from "@/context/SentinelContext";
import ThemeToggle from "@/components/shared/ThemeToggle";
import CommandPalette from "@/components/shared/CommandPalette";
import SentinelWrapper from "../components/shared/SentinelWrapper";
import ImpersonationBanner from "@/components/shared/ImpersonationBanner";
import QueryProvider from "@/components/providers/QueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="font-sans antialiased">
        <AuthProvider>
          <QueryProvider>
            <SocketProvider>
              <ThemeProvider>
                <SentinelProvider>
                  <ImpersonationBanner />
                  <ThemeToggle />
                  <SentinelWrapper />
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      className: 'react-hot-toast',
                      style: {
                        borderRadius: '12px',
                        background: '#fff',
                        color: '#0f172a',
                        fontSize: '14px',
                        fontWeight: '500',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      },
                    }}
                  />
                  {children}
                </SentinelProvider>
              </ThemeProvider>
            </SocketProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
