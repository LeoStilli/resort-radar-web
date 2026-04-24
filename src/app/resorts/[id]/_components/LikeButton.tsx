"use client";

import { useTransition, useState } from "react";

interface LikeButtonProps {
  toggleAction: (() => Promise<void>) | null;
  initialLiked: boolean;
  initialCount: number;
}

export function LikeButton({ toggleAction, initialLiked, initialCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!toggleAction) {
      window.location.href = "/login";
      return;
    }
    const wasLiked = liked;
    setLiked(!wasLiked);
    setCount(wasLiked ? count - 1 : count + 1);
    startTransition(async () => {
      await toggleAction();
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`group flex items-center gap-3 rounded-2xl border px-6 py-4 text-left transition-all disabled:opacity-70 ${
        liked
          ? "border-rose-500/40 bg-rose-500/10 text-rose-400"
          : "border-white/15 bg-white/5 text-white/60 hover:border-rose-500/30 hover:bg-rose-500/5 hover:text-rose-400"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-6 w-6 transition-transform group-hover:scale-110 ${liked ? "fill-rose-500 text-rose-500" : "fill-none"}`}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
      <div>
        <p className="text-sm font-semibold">
          {liked ? "Liked" : (toggleAction ? "Like this resort" : "Sign in to like")}
        </p>
        <p className="text-xs opacity-60">{count} {count === 1 ? "person likes this" : "people like this"}</p>
      </div>
    </button>
  );
}
