import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "@/lib/auth";
import { findUserById } from "@/lib/users";
import { Nav } from "@/components/Nav";
import { Chatbot } from "@/components/Chatbot";
import { ProfileForm } from "./_components/ProfileForm";

export const metadata: Metadata = {
  title: "Your Profile — Resort Radar",
};

const SKILL_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
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

  return (
    <main className="min-h-screen bg-cream">
      <Nav user={session} />

      {/* Header banner */}
      <div className="bg-navy pt-24 pb-16">
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-white/40 transition hover:text-white/70"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to home
          </Link>

          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold/40 bg-navy-light text-xl font-bold text-gold">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">{user.name}</h1>
              <p className="mt-0.5 text-sm text-white/50">{user.email}</p>
              {user.skillLevel && (
                <span className="mt-1.5 inline-block rounded-full border border-gold/30 bg-gold/10 px-3 py-0.5 text-xs font-medium text-gold">
                  {SKILL_LABELS[user.skillLevel] ?? user.skillLevel}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-2xl px-6 py-12 lg:px-8">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="mb-8 border-b border-gray-100 pb-6">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Preferences</h2>
            <p className="mt-1 text-sm text-foreground/50">
              These help personalise your AI resort recommendations.
            </p>
          </div>
          <ProfileForm user={user} />
        </div>
      </div>

      <Chatbot />
    </main>
  );
}
