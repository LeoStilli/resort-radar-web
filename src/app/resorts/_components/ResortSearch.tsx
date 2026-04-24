"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { getOpenStats } from "@/lib/resorts";
import type { Resort, ResortWeather } from "@/lib/resorts";

type ResortWithWeather = Resort & { weather: ResortWeather | null };

const STATES = ["All", "CO", "WY", "UT", "CA", "MT", "VT"];

const SORTS = [
  { value: "rating", label: "Top Rated" },
  { value: "snow", label: "Most Snow" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
];

interface StarRatingProps {
  rating: number;
}

function StarRating({ rating }: StarRatingProps) {
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            viewBox="0 0 20 20"
            className={`h-3.5 w-3.5 ${star <= filled ? "fill-gold text-gold" : "fill-white/15 text-white/15"}`}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-white/40">{rating.toFixed(1)}</span>
    </div>
  );
}

interface PriceLevelProps {
  level: number;
  price: number;
}

function PriceLevel({ level, price }: PriceLevelProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={`text-sm font-medium ${i <= level ? "text-gold" : "text-white/20"}`}>
            $
          </span>
        ))}
      </div>
      <span className="text-xs text-white/40">${price}/day</span>
    </div>
  );
}

interface ResortCardProps {
  resort: ResortWithWeather;
}

function ResortCard({ resort }: ResortCardProps) {
  const w = resort.weather;
  const { openRuns, isOpen } = getOpenStats(resort.trails, w ?? null);
  const openPct = resort.trails > 0 ? (openRuns / resort.trails) * 100 : 0;

  return (
    <Link href={`/resorts/${resort.id}`} className="group flex flex-col overflow-hidden rounded-2xl bg-navy-light ring-1 ring-white/10 transition duration-300 hover:-translate-y-0.5 hover:ring-gold/30 hover:shadow-xl hover:shadow-navy/40">
      <div className="relative aspect-16/9 overflow-hidden">
        <Image
          src={resort.image}
          alt={resort.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-navy via-navy/30 to-transparent" />

        <div className="absolute left-3 top-3 rounded-full bg-navy/80 px-2.5 py-0.5 text-xs font-medium text-white/70 backdrop-blur-sm">
          {resort.state}
        </div>

        <div
          className={`absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm ${
            isOpen
              ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30"
              : "bg-red-500/20 text-red-300 ring-1 ring-red-500/30"
          }`}
        >
          {isOpen ? "● Open" : "● Closed"}
        </div>

        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-lg font-bold tracking-tight text-white">{resort.name}</h3>
          <p className="text-xs text-white/50">{resort.location}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <StarRating rating={resort.rating} />
          <PriceLevel level={resort.priceLevel} price={resort.avgTicketPrice} />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-white/50">
              {openRuns} / {resort.trails} trails open
            </span>
            <span className={`font-semibold ${isOpen ? "text-emerald-400" : "text-red-400/70"}`}>
              {Math.round(openPct)}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full transition-all ${isOpen ? "bg-emerald-400" : "bg-red-400/50"}`}
              style={{ width: `${openPct}%` }}
            />
          </div>
        </div>

        {w ? (
          <div className="grid grid-cols-3 divide-x divide-white/8 rounded-xl bg-white/5 py-2.5">
            <div className="px-3 text-center">
              <p className="text-[10px] uppercase tracking-wide text-white/30">New</p>
              <p className="mt-0.5 text-sm font-semibold text-white">
                {w.snowfallTodayIn > 0 ? `${w.snowfallTodayIn}"` : "—"}
              </p>
            </div>
            <div className="px-3 text-center">
              <p className="text-[10px] uppercase tracking-wide text-white/30">Base</p>
              <p className="mt-0.5 text-sm font-semibold text-white">
                {w.snowDepthFt > 0 ? `${w.snowDepthFt}ft` : "—"}
              </p>
            </div>
            <div className="px-3 text-center">
              <p className="text-[10px] uppercase tracking-wide text-white/30">Temp</p>
              <p className="mt-0.5 text-sm font-semibold text-white">{w.tempF}°F</p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-white/5 py-2.5 text-center text-xs text-white/30">
            Conditions unavailable
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {resort.terrain.slice(0, 3).map((t) => (
            <span key={t} className="rounded-full bg-white/8 px-2.5 py-0.5 text-[11px] text-white/50">
              {t}
            </span>
          ))}
          {resort.terrain.length > 3 && (
            <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] text-white/30">
              +{resort.terrain.length - 3}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

interface ResortSearchProps {
  resorts: ResortWithWeather[];
}

export function ResortSearch({ resorts }: ResortSearchProps) {
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("All");
  const [sort, setSort] = useState("rating");

  const filtered = useMemo(() => {
    let result = resorts;

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.terrain.some((t) => t.toLowerCase().includes(q)) ||
          r.state.toLowerCase().includes(q)
      );
    }

    if (stateFilter !== "All") {
      result = result.filter((r) => r.state === stateFilter);
    }

    return [...result].sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "snow") return (b.weather?.snowDepthFt ?? 0) - (a.weather?.snowDepthFt ?? 0);
      if (sort === "price-asc") return a.avgTicketPrice - b.avgTicketPrice;
      if (sort === "price-desc") return b.avgTicketPrice - a.avgTicketPrice;
      return 0;
    });
  }, [resorts, query, stateFilter, sort]);

  return (
    <>
      {/* Page header — pt-24 clears the fixed nav (~64 px) */}
      <div className="bg-navy pb-12 pt-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-gold">US Ski Resorts</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Find Your Mountain
          </h1>
          <p className="mt-3 text-white/50">
            Live conditions · Ratings · Trail status · Ticket prices
          </p>

          <div className="mt-8 flex max-w-xl items-center gap-3 rounded-2xl bg-white/8 px-5 py-3.5 ring-1 ring-white/10 transition focus-within:ring-gold/40">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 text-white/30">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by resort, state, or terrain…"
              className="flex-1 bg-transparent text-white outline-none placeholder:text-white/30"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-white/30 transition hover:text-white">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 py-3.5 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 lg:px-10">
          <div className="flex flex-wrap gap-2">
            {STATES.map((s) => (
              <button
                key={s}
                onClick={() => setStateFilter(s)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  stateFilter === s
                    ? "bg-navy text-white shadow-sm"
                    : "bg-gray-100 text-foreground/60 hover:bg-gray-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground/40">Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-foreground/70 outline-none transition hover:border-gray-300"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resort grid */}
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-lg text-foreground/40">No resorts match your search.</p>
            <button
              onClick={() => {
                setQuery("");
                setStateFilter("All");
              }}
              className="mt-4 text-sm text-gold transition hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-foreground/40">
              {filtered.length} resort{filtered.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((resort) => (
                <ResortCard key={resort.id} resort={resort} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
