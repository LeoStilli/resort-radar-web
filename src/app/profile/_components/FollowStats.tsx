"use client";

import { useState } from "react";

export interface FollowUser {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface FollowStatsProps {
  reviewCount: number;
  likedCount: number;
  followers: FollowUser[];
  following: FollowUser[];
}

function UserRow({ user }: { user: FollowUser }) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-3 py-3">
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user.name}
          className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-sm font-bold text-gold ring-1 ring-gold/20">
          {initials}
        </div>
      )}
      <span className="text-sm font-medium text-white">{user.name}</span>
    </div>
  );
}

export function FollowStats({ reviewCount, likedCount, followers, following }: FollowStatsProps) {
  const [open, setOpen] = useState<"followers" | "following" | null>(null);

  const list = open === "followers" ? followers : following;
  const title = open === "followers" ? "Followers" : "Following";

  return (
    <>
      <div className="mt-4 flex flex-wrap gap-6 pt-2">
        {/* Non-clickable stats */}
        <div>
          <span className="text-xl font-bold text-white">{reviewCount}</span>
          <span className="ml-1.5 text-sm text-white/35">Reviews</span>
        </div>
        <div>
          <span className="text-xl font-bold text-white">{likedCount}</span>
          <span className="ml-1.5 text-sm text-white/35">Liked</span>
        </div>

        {/* Clickable stats */}
        <button
          onClick={() => setOpen("followers")}
          className="group text-left transition hover:opacity-80"
        >
          <span className="text-xl font-bold text-white">{followers.length}</span>
          <span className="ml-1.5 text-sm text-white/35 underline-offset-2 group-hover:underline group-hover:text-white/60">
            Followers
          </span>
        </button>
        <button
          onClick={() => setOpen("following")}
          className="group text-left transition hover:opacity-80"
        >
          <span className="text-xl font-bold text-white">{following.length}</span>
          <span className="ml-1.5 text-sm text-white/35 underline-offset-2 group-hover:underline group-hover:text-white/60">
            Following
          </span>
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-navy/80 backdrop-blur-sm"
            onClick={() => setOpen(null)}
          />

          {/* Panel */}
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-[#0c1a2a] p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <button
                onClick={() => setOpen(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/40 transition hover:bg-white/10 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {list.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-white/35">
                  {open === "followers"
                    ? "Nobody is following you yet."
                    : "You're not following anyone yet."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/8">
                {list.map((u) => (
                  <UserRow key={u.id} user={u} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
