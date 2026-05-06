"use client";

import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import ImpersonationBanner from "@/components/admin/ImpersonationBanner";

export default function AppShell({ children }) {
  return (
    <div className="app-shell">
      <ImpersonationBanner />
      <Navbar />
      <main className="main">{children}</main>
      <Footer />
    </div>
  );
}
