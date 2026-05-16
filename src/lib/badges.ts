import { RESORTS } from "@/lib/resorts";
import type { User } from "@/lib/users";

export type BadgeTier = "bronze" | "silver" | "gold" | "special";

export interface Badge {
  id: string;
  name: string;
  description: string;
  requirement: string;
  tier: BadgeTier;
  icon: string;
}

export const ALL_BADGES: Badge[] = [
  // Bronze — first steps
  {
    id: "first-review",
    name: "Trailblazer",
    description: "Left your first review",
    requirement: "Leave 1 review",
    tier: "bronze",
    icon: "✍️",
  },
  {
    id: "first-like",
    name: "Mountain Fan",
    description: "Liked your first resort",
    requirement: "Like 1 resort",
    tier: "bronze",
    icon: "❤️",
  },
  {
    id: "skill-set",
    name: "Know Your Level",
    description: "Set your riding skill level",
    requirement: "Set a skill level",
    tier: "bronze",
    icon: "🎿",
  },
  {
    id: "profile-complete",
    name: "All Set",
    description: "Added an avatar and bio to your profile",
    requirement: "Add an avatar URL and bio",
    tier: "bronze",
    icon: "⭐",
  },
  // Silver — building momentum
  {
    id: "reviewer-3",
    name: "Resort Critic",
    description: "You know what you're talking about",
    requirement: "Leave 3 reviews",
    tier: "silver",
    icon: "📝",
  },
  {
    id: "liked-5",
    name: "Ridge Chaser",
    description: "You love the mountains — plural",
    requirement: "Like 5 resorts",
    tier: "silver",
    icon: "❄️",
  },
  {
    id: "favorites-5",
    name: "Bucket List",
    description: "You have big plans",
    requirement: "Save 5 favorite resorts",
    tier: "silver",
    icon: "📌",
  },
  {
    id: "multi-state",
    name: "State Hopper",
    description: "You don't limit yourself to one mountain",
    requirement: "Like resorts in 3+ states",
    tier: "silver",
    icon: "🗺️",
  },
  // Gold — serious dedication
  {
    id: "reviewer-10",
    name: "Mountain Authority",
    description: "The community trusts your opinion",
    requirement: "Leave 10 reviews",
    tier: "gold",
    icon: "🏆",
  },
  {
    id: "liked-10",
    name: "Peak Collector",
    description: "You've explored every resort on the radar",
    requirement: "Like all 10 resorts",
    tier: "gold",
    icon: "⛰️",
  },
  {
    id: "east-west",
    name: "Coast to Coast",
    description: "East and West, you've done both",
    requirement: "Like a resort from the East and West coast",
    tier: "gold",
    icon: "🌊",
  },
  // Special
  {
    id: "slopes-connected",
    name: "Slopes Connected",
    description: "Linked your Slopes app account",
    requirement: "Connect your Slopes account in settings",
    tier: "special",
    icon: "🔗",
  },
  {
    id: "email-verified",
    name: "Verified Member",
    description: "Confirmed your email address",
    requirement: "Verify your email from your profile",
    tier: "special",
    icon: "✉️",
  },
];

const TIER_ORDER: BadgeTier[] = ["bronze", "silver", "gold", "special"];

export function computeEarnedBadgeIds(user: User, reviewCount: number): Set<string> {
  const liked = user.likedResorts ?? [];
  const favorites = user.favoriteResorts ?? [];
  const earned = new Set<string>();

  if (reviewCount >= 1) earned.add("first-review");
  if (reviewCount >= 3) earned.add("reviewer-3");
  if (reviewCount >= 10) earned.add("reviewer-10");

  if (liked.length >= 1) earned.add("first-like");
  if (liked.length >= 5) earned.add("liked-5");
  if (liked.length >= 10) earned.add("liked-10");

  if (favorites.length >= 5) earned.add("favorites-5");
  if (user.skillLevel) earned.add("skill-set");
  if (user.avatarUrl && user.bio) earned.add("profile-complete");
  if (user.slopesConnected) earned.add("slopes-connected");
  if (user.emailVerified) earned.add("email-verified");

  const likedDetails = RESORTS.filter((r) => liked.includes(r.id));
  const states = new Set(likedDetails.map((r) => r.state));
  if (states.size >= 3) earned.add("multi-state");

  const eastStates = new Set(["VT", "NH", "ME", "NY", "PA", "WV"]);
  const westStates = new Set(["CA", "OR", "WA", "NV"]);
  const hasEast = likedDetails.some((r) => eastStates.has(r.state));
  const hasWest = likedDetails.some((r) => westStates.has(r.state));
  if (hasEast && hasWest) earned.add("east-west");

  return earned;
}

export function sortBadges(badges: Badge[]): Badge[] {
  return [...badges].sort(
    (a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier)
  );
}
