import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "@/lib/auth";
import { findUserById } from "@/lib/users";
import { getUserReviews } from "@/lib/reviews";
import { fetchAllResortWeather } from "@/lib/resorts";
import { ALL_BADGES, computeEarnedBadgeIds, sortBadges, type BadgeTier } from "@/lib/badges";
import { Nav } from "@/components/Nav";
import { Chatbot } from "@/components/Chatbot";
import { ProfileForm } from "./_components/ProfileForm";
import { ShareButton } from "./_components/ShareButton";
import { FollowStats, type FollowUser } from "./_components/FollowStats";
import { FindPeople } from "./_components/FindPeople";

export const metadata: Metadata = {
  title: "Your Profile — Resort Radar",
};

const SKILL_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};

const TIER_STYLES: Record<BadgeTier, { ring: string; bg: string; text: string; dot: string }> = {
  bronze: {
    ring: "ring-amber-700/50",
    bg: "bg-amber-900/20",
    text: "text-amber-400",
    dot: "bg-amber-500",
  },
  silver: {
    ring: "ring-slate-400/40",
    bg: "bg-slate-700/20",
    text: "text-slate-300",
    dot: "bg-slate-400",
  },
  gold: {
    ring: "ring-yellow-400/50",
    bg: "bg-yellow-500/10",
    text: "text-yellow-300",
    dot: "bg-yellow-400",
  },
  special: {
    ring: "ring-purple-400/40",
    bg: "bg-purple-500/10",
    text: "text-purple-300",
    dot: "bg-purple-400",
  },
};

export default async function ProfilePage() {
  const jar = await cookies();
  const token = jar.get("session")?.value;
  const session = token ? verifySessionToken(token) : null;
  if (!session) redirect("/login");

  const user = findUserById(session.userId);
  if (!user) redirect("/login");

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const userReviews = getUserReviews(session.userId);
  const allResorts = await fetchAllResortWeather()
  const likedResorts = allResorts.filter((r) => (user.likedResorts ?? []).includes(r.id))

  const earnedIds = computeEarnedBadgeIds(user, userReviews.length);
  const allSorted = sortBadges(ALL_BADGES);
  const earnedBadges = allSorted.filter((b) => earnedIds.has(b.id));
  const lockedBadges = allSorted.filter((b) => !earnedIds.has(b.id));

  const toFollowUser = (id: string): FollowUser | null => {
    const u = findUserById(id);
    if (!u) return null;
    return { id: u.id, name: u.name, avatarUrl: u.avatarUrl };
  };

  const followerUsers: FollowUser[] = (user.followers ?? [])
    .map(toFollowUser)
    .filter((u): u is FollowUser => u !== null);

  const followingUsers: FollowUser[] = (user.following ?? [])
    .map(toFollowUser)
    .filter((u): u is FollowUser => u !== null);

  return (
    <main className="min-h-screen bg-navy">
      <Nav user={session} />

      {/* ── Cover + Avatar ── */}
      {/*
        The section has NO overflow-hidden so the avatar (absolute bottom-0 translate-y-1/2)
        can visually extend below the section without being clipped.
        overflow-hidden lives on an inner wrapper that only clips the background image/SVG.
      */}
      <section className="relative h-52 md:h-64">
        {/* Inner clipping wrapper for the background only */}
        <div className="absolute inset-0 overflow-hidden">
          {user.coverUrl ? (
            <img
              src={user.coverUrl}
              alt="Profile cover"
              className="h-full w-full object-cover"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-linear-to-br from-navy-light via-[#0a1628] to-navy" />
              <svg
                className="absolute inset-0 h-full w-full opacity-10"
                viewBox="0 0 1200 300"
                preserveAspectRatio="xMidYMid slice"
              >
                <path d="M0 280L150 120L300 200L450 80L600 160L750 60L900 140L1050 40L1200 120V300H0Z" fill="white" />
                <path d="M0 300L200 160L350 220L500 100L650 180L800 80L950 160L1100 60L1200 140V300H0Z" fill="white" opacity="0.5" />
              </svg>
            </>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-navy via-navy/20 to-transparent" />
        </div>

        {/* Avatar — centered on cover/content border, NOT inside overflow-hidden */}
        <div className="absolute bottom-0 left-6 z-20 translate-y-1/2 md:left-10">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-28 w-28 rounded-full object-cover ring-4 ring-gold/60 md:h-32 md:w-32"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-navy-light text-3xl font-bold text-gold ring-4 ring-gold/60 md:h-32 md:w-32">
              {initials}
            </div>
          )}
        </div>

        {/* Edit button — top right, clear of fixed nav */}
        <div className="absolute right-6 top-20 z-20 md:right-10">
          <a
            href="#settings"
            className="rounded-full border border-white/25 bg-navy/50 px-5 py-2 text-sm font-medium text-white/80 backdrop-blur-sm transition hover:border-white/50 hover:text-white"
          >
            Edit Profile
          </a>
        </div>
      </section>

      {/* ── Profile info — pt-16/pt-20 clears the half-avatar that extends below the cover ── */}
      <div className="border-b border-white/10 bg-navy">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="pt-16 md:pt-20" />

          {/* Name / bio / skill */}
          <div className="pb-6 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                {user.name}
              </h1>
              {user.skillLevel && (
                <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-0.5 text-xs font-semibold text-gold">
                  {SKILL_LABELS[user.skillLevel] ?? user.skillLevel}
                </span>
              )}
            </div>
            {user.bio && (
              <p className="max-w-xl text-white/55">{user.bio}</p>
            )}
            <p className="text-sm text-white/30">{user.email}</p>

            {/* Stats row — Followers/Following are clickable */}
            <FollowStats
              reviewCount={userReviews.length}
              likedCount={likedResorts.length}
              followers={followerUsers}
              following={followingUsers}
            />

            <div className="pt-1">
              <FindPeople />
            </div>
          </div>
        </div>
      </div>

      {/* ── Badges ── */}
      <section className="border-b border-white/10 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gold">Achievements</p>
              <h2 className="mt-1 text-2xl font-bold text-white">Badges</h2>
            </div>
            <span className="text-sm text-white/30">
              {earnedBadges.length} / {ALL_BADGES.length} earned
            </span>
          </div>

          {earnedBadges.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-3">
              {earnedBadges.map((badge) => {
                const s = TIER_STYLES[badge.tier];
                return (
                  <div
                    key={badge.id}
                    title={badge.description}
                    className={`flex items-center gap-2.5 rounded-2xl px-4 py-2.5 ring-1 ${s.ring} ${s.bg}`}
                  >
                    <span className="text-lg">{badge.icon}</span>
                    <div>
                      <p className={`text-sm font-semibold ${s.text}`}>{badge.name}</p>
                      <p className="text-xs text-white/30">{badge.description}</p>
                    </div>
                    <span className={`ml-1 h-1.5 w-1.5 rounded-full ${s.dot}`} />
                  </div>
                );
              })}
            </div>
          )}

          {lockedBadges.length > 0 && (
            <div>
              <p className="mb-3 text-xs uppercase tracking-widest text-white/20">Locked</p>
              <div className="flex flex-wrap gap-3">
                {lockedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    title={`Unlock: ${badge.requirement}`}
                    className="flex items-center gap-2.5 rounded-2xl bg-white/3 px-4 py-2.5 ring-1 ring-white/8 opacity-50"
                  >
                    <span className="text-lg grayscale">{badge.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-white/40">{badge.name}</p>
                      <p className="text-xs text-white/20">{badge.requirement}</p>
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" className="ml-1 h-4 w-4 text-white/20">
                      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Liked Resorts ── */}
      <section className="border-b border-white/10 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-gold">My Resorts</p>
          <h2 className="mt-1 mb-8 text-2xl font-bold text-white">Liked Resorts</h2>

          {likedResorts.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {likedResorts.map((resort) => (
                <div
                  key={resort.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-gold/20"
                >
                  <Link href={`/resorts/${resort.id}`} className="relative aspect-video block overflow-hidden">
                    <img
                      src={resort.image}
                      alt={resort.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-navy/70 to-transparent" />
                    <div className="absolute bottom-2 left-3 right-3">
                      <p className="text-sm font-semibold text-white">{resort.name}</p>
                      <p className="text-xs text-white/50">{resort.location}</p>
                    </div>
                  </Link>
                  {resort.weather && (
                    <div className="grid grid-cols-4 divide-x divide-white/8 border-t border-white/8">
                      <div className="px-1.5 py-2 text-center">
                        <p className="text-[9px] uppercase tracking-wide text-white/30">Lifts</p>
                        <p className="text-xs font-semibold text-white">
                          {resort.weather.liftsOpen !== null ? `${resort.weather.liftsOpen}/${resort.weather.liftsTotal}` : '—'}
                        </p>
                      </div>
                      <div className="px-1.5 py-2 text-center">
                        <p className="text-[9px] uppercase tracking-wide text-white/30">New</p>
                        <p className="text-xs font-semibold text-white">
                          {resort.weather.snowfallTodayIn > 0 ? `${resort.weather.snowfallTodayIn}"` : '—'}
                        </p>
                      </div>
                      <div className="px-1.5 py-2 text-center">
                        <p className="text-[9px] uppercase tracking-wide text-white/30">Base</p>
                        <p className="text-xs font-semibold text-white">
                          {resort.weather.snowDepthFt > 0 ? `${resort.weather.snowDepthFt}ft` : '—'}
                        </p>
                      </div>
                      <div className="px-1.5 py-2 text-center">
                        <p className="text-[9px] uppercase tracking-wide text-white/30">Temp</p>
                        <p className="text-xs font-semibold text-white">{resort.weather.tempF}°F</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      <svg viewBox="0 0 20 20" className="h-4 w-4 fill-rose-500">
                        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                      </svg>
                      <span className="text-xs text-white/40">Liked</span>
                    </div>
                    <ShareButton resortId={resort.id} resortName={resort.name} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/8 bg-white/3 py-16 text-center">
              <p className="text-white/35">No liked resorts yet.</p>
              <Link
                href="/resorts"
                className="mt-4 inline-block text-sm text-gold transition hover:underline"
              >
                Browse resorts →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── My Reviews ── */}
      <section className="border-b border-white/10 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-gold">Community</p>
          <h2 className="mt-1 mb-8 text-2xl font-bold text-white">My Reviews</h2>

          {userReviews.length > 0 ? (
            <div className="space-y-4">
              {userReviews.map((review) => {
                const resort = allResorts.find((r) => r.id === review.resortId)
                return (
                  <div
                    key={review.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                      <div>
                        {resort ? (
                          <Link
                            href={`/resorts/${resort.id}`}
                            className="text-sm font-semibold text-gold transition hover:underline"
                          >
                            {resort.name}
                          </Link>
                        ) : (
                          <span className="text-sm font-semibold text-white/50">Unknown Resort</span>
                        )}
                        <p className="mt-0.5 text-xs text-white/30">
                          {new Date(review.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            viewBox="0 0 20 20"
                            className={`h-4 w-4 ${star <= review.rating ? "fill-gold" : "fill-white/15"}`}
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-white/60">{review.text}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/8 bg-white/3 py-16 text-center">
              <p className="text-white/35">You haven&apos;t reviewed any resorts yet.</p>
              <Link
                href="/resorts"
                className="mt-4 inline-block text-sm text-gold transition hover:underline"
              >
                Find a resort to review →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Settings ── */}
      <section id="settings" className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-gold">Account</p>
          <h2 className="mt-1 mb-8 text-2xl font-bold text-white">Edit Profile</h2>
          <div className="max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8">
            <ProfileForm user={user} />
          </div>
        </div>
      </section>

      <Chatbot />
    </main>
  );
}
