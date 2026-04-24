"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { updateProfile, type ProfileState } from "@/actions/profile";
import { RESORTS } from "@/lib/resorts";
import type { User } from "@/lib/users";

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

export default function ProfileForm({ user }: Props) {
  const [state, action, pending] = useActionState<ProfileState, FormData>(
    updateProfile,
    undefined
  );

  // Controlled state — fixes the "favorites disappear" bug
  const [name, setName] = useState(user.name);
  const [skillLevel, setSkillLevel] = useState(user.skillLevel ?? "");
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(user.favoriteResorts ?? [])
  );

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
      {/* Hidden inputs for controlled favorites */}
      {[...favorites].map((id) => (
        <input key={id} type="hidden" name="favoriteResorts" value={id} />
      ))}

      {state?.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Profile saved successfully.
        </div>
      )}

      {/* Name */}
      <div className="space-y-2">
        <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-widest text-foreground/40">
          Display Name
        </label>
        <input
          id="name" name="name" type="text" required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-2xl border border-gray-200 bg-cream px-5 py-3.5 text-sm text-foreground outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/10"
        />
      </div>

      {/* Skill level */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">Skill Level</p>
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
                    ? "border-gold bg-navy text-white"
                    : "border-gray-200 bg-cream text-foreground hover:border-navy/30"
                }`}
              >
                <span className={selected ? "text-gold" : "text-navy"}>{level.icon}</span>
                <div>
                  <p className="text-sm font-semibold">{level.label}</p>
                  <p className={`text-xs ${selected ? "text-white/60" : "text-foreground/40"}`}>
                    {level.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Favourite resorts */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
          Favourite Resorts
          <span className="ml-2 font-normal normal-case text-foreground/30">
            — used to personalise AI recommendations
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
                className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl border p-3 text-left transition ${
                  selected
                    ? "border-gold bg-navy"
                    : "border-gray-200 bg-cream hover:border-navy/30"
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
                  <p className={`truncate text-sm font-semibold ${selected ? "text-white" : "text-foreground"}`}>
                    {resort.name}
                  </p>
                  <p className={`truncate text-xs ${selected ? "text-white/50" : "text-foreground/40"}`}>
                    {resort.location}
                  </p>
                </div>
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                    selected ? "border-gold bg-gold" : "border-gray-300"
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
        className="rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-navy transition hover:bg-gold-light disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save Profile"}
      </button>
    </form>
  );
}
