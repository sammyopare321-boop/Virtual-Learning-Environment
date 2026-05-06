"use client";

export function useImpersonation() {
  return {
    isImpersonating: typeof document !== "undefined" && document.cookie.includes("impersonating=true")
  };
}
