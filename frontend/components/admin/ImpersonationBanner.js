"use client";

import { adminApi } from "@/utils/api/adminApi";

export default function ImpersonationBanner() {
  if (typeof document === "undefined" || !document.cookie.includes("impersonating=true")) return null;

  const exit = async () => {
    const response = await adminApi.exitImpersonation();
    const token = response.data?.token;
    if (token) document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    document.cookie = "impersonating=; path=/; max-age=0";
    window.location.href = "/dashboard/admin";
  };

  return (
    <div className="impersonation">
      <div className="impersonation-inner">
        <strong>Impersonation session active</strong>
        <button className="btn secondary" type="button" onClick={exit}>Exit impersonation</button>
      </div>
    </div>
  );
}
