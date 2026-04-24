"use client";

import { useState } from "react";

interface ShareButtonProps {
  resortId: string;
  resortName: string;
}

export function ShareButton({ resortId, resortName }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `${window.location.origin}/resorts/${resortId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleShare}
      title={`Share ${resortName}`}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
        copied
          ? "bg-emerald-500/20 text-emerald-300"
          : "bg-white/8 text-white/50 hover:bg-gold/15 hover:text-gold"
      }`}
    >
      {copied ? (
        <>
          <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 6l-4-4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Broadcast
        </>
      )}
    </button>
  );
}
