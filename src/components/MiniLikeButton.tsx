"use client";

import { useTransition, useState } from "react";

interface MiniLikeButtonProps {
  toggleAction: (() => Promise<void>) | null;
  initialLiked: boolean;
}

export function MiniLikeButton({ toggleAction, initialLiked }: MiniLikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [isPending, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!toggleAction) {
      window.location.href = "/login";
      return;
    }
    setLiked(!liked);
    startTransition(async () => {
      await toggleAction();
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-label={liked ? "Unlike resort" : "Like resort"}
      className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all disabled:opacity-60 ${
        liked
          ? "bg-rose-500/40 text-rose-300"
          : "bg-navy/60 text-white/60 hover:bg-rose-500/30 hover:text-rose-300"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-4 w-4 transition-transform hover:scale-110 ${liked ? "fill-rose-400 stroke-rose-400" : "fill-none stroke-current"}`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    </button>
  );
}
