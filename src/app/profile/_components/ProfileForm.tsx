"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { updateProfile, type ProfileState } from "@/lib/actions/profile";
import { RESORTS } from "@/lib/resorts";
import type { User } from "@/lib/users";

const SKI_PASSES = [
  {
    id: "epic",
    name: "Epic Pass",
    desc: "Unlimited access to Vail, Breckenridge, Park City, Mammoth + 40 more resorts worldwide",
    color: "sky",
  },
  {
    id: "ikon",
    name: "Ikon Pass",
    desc: "Unlimited or limited days at Steamboat, Big Sky, Aspen, Jackson Hole, Telluride, Killington + more",
    color: "blue",
  },
  {
    id: "mountain-collective",
    name: "Mountain Collective",
    desc: "2 days each at Jackson Hole, Big Sky, Aspen, Telluride + other independent resorts",
    color: "emerald",
  },
];

const SKILL_LEVELS = [
  {
    value: "beginner",
    label: "Beginner",
    desc: "Learning the basics",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9 9h.01M15 9h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: "intermediate",
    label: "Intermediate",
    desc: "Comfortable on blues",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d="M3 17l6-8 5 6 3-4 4 6H3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    value: "advanced",
    label: "Advanced",
    desc: "Tackling blacks & steeps",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d="M12 2L4 20h16L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 14l4-5 4 5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    value: "expert",
    label: "Expert",
    desc: "Off-piste, no limits",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d="M12 2L4 20h16L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 14l4-5 4 5M12 9v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 19l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

interface Props {
  user: User;
}

export function ProfileForm({ user }: Props) {
  const [state, action, pending] = useActionState<ProfileState, FormData>(
    updateProfile,
    undefined
  );

  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? "");
  const [coverUrl, setCoverUrl] = useState(user.coverUrl ?? "");
  const [skillLevel, setSkillLevel] = useState(user.skillLevel ?? "");
  const [slopesConnected, setSlopesConnected] = useState(user.slopesConnected ?? false);
  const [passes, setPasses] = useState<Set<string>>(
    new Set(user.skiPasses ?? [])
  );
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(user.favoriteResorts ?? [])
  );

  function togglePass(id: string) {
    setPasses((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <form action={action} className="space-y-10">
      {[...favorites].map((id) => (
        <input key={id} type="hidden" name="favoriteResorts" value={id} />
      ))}
      {[...passes].map((id) => (
        <input key={id} type="hidden" name="skiPasses" value={id} />
      ))}
      <input type="hidden" name="slopesConnected" value={slopesConnected ? "true" : "false"} />

      {state?.error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          Profile saved successfully.
        </div>
      )}

      {/* Identity */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-widest text-white/35">
            Display Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-gold/40 focus:bg-white/8"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="bio" className="block text-xs font-semibold uppercase tracking-widest text-white/35">
            Bio
          </label>
          <input
            id="bio"
            name="bio"
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A sentence about you…"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-gold/40 focus:bg-white/8"
          />
        </div>
      </div>

      {/* Profile images */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="avatarUrl" className="block text-xs font-semibold uppercase tracking-widest text-white/35">
            Avatar URL
          </label>
          <input
            id="avatarUrl"
            name="avatarUrl"
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://…"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-gold/40 focus:bg-white/8"
          />
          {avatarUrl && (
            <div className="mt-2 flex items-center gap-3">
              <img
                src={avatarUrl}
                alt="Avatar preview"
                className="h-12 w-12 rounded-full object-cover ring-2 ring-gold/30"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="text-xs text-white/35">Preview</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="coverUrl" className="block text-xs font-semibold uppercase tracking-widest text-white/35">
            Cover Image URL
          </label>
          <input
            id="coverUrl"
            name="coverUrl"
            type="url"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            placeholder="https://…"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-gold/40 focus:bg-white/8"
          />
          {coverUrl && (
            <div className="mt-2 overflow-hidden rounded-xl">
              <img
                src={coverUrl}
                alt="Cover preview"
                className="h-16 w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Skill level */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/35">Skill Level</p>
        <input type="hidden" name="skillLevel" value={skillLevel} />
        <div className="grid grid-cols-2 gap-3">
          {SKILL_LEVELS.map((level) => {
            const selected = skillLevel === level.value;
            return (
              <button
                key={level.value}
                type="button"
                onClick={() => setSkillLevel(level.value)}
                className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                  selected
                    ? "border-gold/50 bg-gold/10 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:border-white/20"
                }`}
              >
                <span className={selected ? "text-gold" : "text-white/40"}>{level.icon}</span>
                <div>
                  <p className="text-sm font-semibold">{level.label}</p>
                  <p className={`text-xs ${selected ? "text-white/55" : "text-white/30"}`}>
                    {level.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slopes integration */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/35">Integrations</p>
        <button
          type="button"
          onClick={() => setSlopesConnected(!slopesConnected)}
          className={`flex w-full items-center justify-between rounded-2xl border p-4 transition ${
            slopesConnected
              ? "border-purple-400/40 bg-purple-500/10"
              : "border-white/10 bg-white/5 hover:border-white/20"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🔗</span>
            <div className="text-left">
              <p className={`text-sm font-semibold ${slopesConnected ? "text-purple-300" : "text-white/70"}`}>
                Slopes App
              </p>
              <p className="text-xs text-white/30">
                {slopesConnected ? "Connected — earns you the Slopes Connected badge" : "Connect to track your runs and earn a badge"}
              </p>
            </div>
          </div>
          <div
            className={`flex h-6 w-10 items-center rounded-full transition-colors ${
              slopesConnected ? "bg-purple-500 justify-end" : "bg-white/15 justify-start"
            }`}
          >
            <div className="mx-0.5 h-5 w-5 rounded-full bg-white shadow-sm" />
          </div>
        </button>
      </div>

      {/* Ski passes */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/35">
          Ski Passes
          <span className="ml-2 font-normal normal-case text-white/20">
            — see which resorts are free with your pass
          </span>
        </p>
        <div className="space-y-2">
          {SKI_PASSES.map((pass) => {
            const selected = passes.has(pass.id);
            return (
              <button
                key={pass.id}
                type="button"
                onClick={() => togglePass(pass.id)}
                className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition ${
                  selected
                    ? "border-gold/40 bg-gold/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold ${selected ? "text-gold" : "text-white/75"}`}>
                    {pass.name}
                  </p>
                  <p className="mt-0.5 text-xs text-white/30">{pass.desc}</p>
                </div>
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                    selected ? "border-gold bg-gold" : "border-white/20"
                  }`}
                >
                  {selected && (
                    <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
                      <path d="M2 6l3 3 5-5" stroke="#0c1a2a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Favourite resorts */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/35">
          Favourite Resorts
          <span className="ml-2 font-normal normal-case text-white/20">
            — for AI recommendations
          </span>
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {RESORTS.map((resort) => {
            const selected = favorites.has(resort.id);
            return (
              <button
                key={resort.id}
                type="button"
                onClick={() => toggleFavorite(resort.id)}
                className={`group flex items-center gap-3 overflow-hidden rounded-2xl border p-3 text-left transition ${
                  selected
                    ? "border-gold/40 bg-gold/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={resort.image}
                    alt={resort.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-semibold ${selected ? "text-gold" : "text-white/70"}`}>
                    {resort.name}
                  </p>
                  <p className="truncate text-xs text-white/30">{resort.location}</p>
                </div>
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                    selected ? "border-gold bg-gold" : "border-white/20"
                  }`}
                >
                  {selected && (
                    <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
                      <path d="M2 6l3 3 5-5" stroke="#0c1a2a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-navy transition hover:bg-amber-400 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
