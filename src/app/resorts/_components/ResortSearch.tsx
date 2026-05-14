'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useMemo, useRef } from 'react'
import { getOpenStats } from '@/lib/resorts'
import type { Resort, ResortWeather } from '@/lib/resorts'
import type { SearchFilter } from '@/src/app/api/search/route'

type ResortWithWeather = Resort & { weather: ResortWeather | null }

const STATES = ['All', 'CO', 'WY', 'UT', 'CA', 'MT', 'VT']

const SORTS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'snow', label: 'Most Snow' },
  { value: 'lifts', label: 'Most Lifts Open' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
]

const PASS_FILTERS = [
  { id: 'epic', label: 'Epic Pass', activeClass: 'bg-sky-500 text-white', dotClass: 'bg-sky-400' },
  { id: 'ikon', label: 'Ikon Pass', activeClass: 'bg-blue-600 text-white', dotClass: 'bg-blue-400' },
  { id: 'mountain-collective', label: 'Mountain Collective', activeClass: 'bg-emerald-600 text-white', dotClass: 'bg-emerald-400' },
]

const PASS_BADGE_STYLES: Record<string, { bg: string; text: string; ring: string }> = {
  'epic': { bg: 'bg-sky-500/15', text: 'text-sky-300', ring: 'ring-sky-500/30' },
  'ikon': { bg: 'bg-blue-500/15', text: 'text-blue-300', ring: 'ring-blue-500/30' },
  'mountain-collective': { bg: 'bg-emerald-500/15', text: 'text-emerald-300', ring: 'ring-emerald-500/30' },
}

const PASS_SHORT: Record<string, string> = {
  'epic': 'Epic',
  'ikon': 'Ikon',
  'mountain-collective': 'MC',
}

const DIFFICULTY_THRESHOLDS: Record<string, (d: { green: number; blue: number; black: number }) => boolean> = {
  beginner: (d) => d.green >= 17,
  intermediate: (d) => d.blue >= 35,
  advanced: (d) => d.black >= 40,
  expert: (d) => d.black >= 50,
}

interface StarRatingProps {
  rating: number
}

function StarRating({ rating }: StarRatingProps) {
  const filled = Math.round(rating)
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            viewBox="0 0 20 20"
            className={`h-3.5 w-3.5 ${star <= filled ? 'fill-gold text-gold' : 'fill-white/15 text-white/15'}`}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-white/40">{rating.toFixed(1)}</span>
    </div>
  )
}

interface PriceLevelProps {
  level: number
  price: number
}

function PriceLevel({ level, price }: PriceLevelProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={`text-sm font-medium ${i <= level ? 'text-gold' : 'text-white/20'}`}>
            $
          </span>
        ))}
      </div>
      <span className="text-xs text-white/40">${price}/day</span>
    </div>
  )
}

interface ResortCardProps {
  resort: ResortWithWeather
  userPasses: string[]
}

function ResortCard({ resort, userPasses }: ResortCardProps) {
  const w = resort.weather
  const { openRuns, isOpen, isEstimate } = getOpenStats(resort.trails, w ?? null)
  const total = w?.runsTotal ?? resort.trails
  const openPct = total > 0 ? (openRuns / total) * 100 : 0

  const coveredPasses = resort.passes.filter((p) => userPasses.includes(p.passId))
  const allPasses = resort.passes

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
              ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30'
              : 'bg-red-500/20 text-red-300 ring-1 ring-red-500/30'
          }`}
        >
          {isOpen ? '● Open' : '● Closed'}
        </div>

        {coveredPasses.length > 0 && (
          <div className="absolute bottom-14 left-3 flex flex-wrap gap-1">
            {coveredPasses.map((p) => (
              <span
                key={p.passId}
                className="flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm"
              >
                <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
                  <path fillRule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zm3.707-9.293a1 1 0 00-1.414-1.414L7 7.586 5.707 6.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Free with your {PASS_SHORT[p.passId] ?? p.passName}
              </span>
            ))}
          </div>
        )}

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
              {openRuns} / {total} runs open
              {isEstimate && <span className="ml-1 text-white/25">(est.)</span>}
            </span>
            <span className={`font-semibold ${isOpen ? 'text-emerald-400' : 'text-red-400/70'}`}>
              {Math.round(openPct)}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full transition-all ${isOpen ? 'bg-emerald-400' : 'bg-red-400/50'}`}
              style={{ width: `${openPct}%` }}
            />
          </div>
        </div>

        {w ? (
          <div className="grid grid-cols-4 divide-x divide-white/8 rounded-xl bg-white/5 py-2.5">
            <div className="px-2 text-center">
              <p className="text-[10px] uppercase tracking-wide text-white/30">Lifts</p>
              <p className="mt-0.5 text-sm font-semibold text-white">
                {w.liftsOpen !== null ? `${w.liftsOpen}/${w.liftsTotal ?? resort.totalLifts}` : '—'}
              </p>
            </div>
            <div className="px-2 text-center">
              <p className="text-[10px] uppercase tracking-wide text-white/30">New</p>
              <p className="mt-0.5 text-sm font-semibold text-white">
                {w.snowfallTodayIn > 0 ? `${w.snowfallTodayIn}"` : '—'}
              </p>
            </div>
            <div className="px-2 text-center">
              <p className="text-[10px] uppercase tracking-wide text-white/30">Base</p>
              <p className="mt-0.5 text-sm font-semibold text-white">
                {w.snowDepthFt > 0 ? `${w.snowDepthFt}ft` : '—'}
              </p>
            </div>
            <div className="px-2 text-center">
              <p className="text-[10px] uppercase tracking-wide text-white/30">Temp</p>
              <p className="mt-0.5 text-sm font-semibold text-white">{w.tempF}°F</p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-white/5 py-2.5 text-center text-xs text-white/30">
            Conditions unavailable
          </div>
        )}

        {allPasses.length > 0 && (
          <div className="flex flex-wrap gap-1.5 border-t border-white/8 pt-3">
            {allPasses.map((p) => {
              const isOwned = userPasses.includes(p.passId)
              const style = PASS_BADGE_STYLES[p.passId]
              return (
                <span
                  key={p.passId}
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ${
                    isOwned && style
                      ? `${style.bg} ${style.text} ${style.ring}`
                      : 'bg-white/8 text-white/40 ring-white/10'
                  }`}
                >
                  {isOwned ? '✓ ' : ''}{PASS_SHORT[p.passId] ?? p.passName} · {p.access}
                </span>
              )
            })}
          </div>
        )}
      </div>
    </Link>
  )
}

interface ResortSearchProps {
  resorts: ResortWithWeather[]
  userPasses: string[]
}

export function ResortSearch({ resorts, userPasses }: ResortSearchProps) {
  const [stateFilter, setStateFilter] = useState('All')
  const [passFilter, setPassFilter] = useState<string | null>(null)
  const [sort, setSort] = useState('rating')

  const [nlQuery, setNlQuery] = useState('')
  const [aiFilter, setAiFilter] = useState<SearchFilter | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function runAiSearch() {
    const q = nlQuery.trim()
    if (!q) return
    setAiLoading(true)
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      })
      const data = (await res.json()) as SearchFilter
      setAiFilter(data.explanation ? data : null)
    } catch {
      setAiFilter(null)
    } finally {
      setAiLoading(false)
    }
  }

  function clearAiFilter() {
    setAiFilter(null)
    setNlQuery('')
    inputRef.current?.focus()
  }

  const filtered = useMemo(() => {
    let result = resorts

    // Manual state filter
    if (stateFilter !== 'All') {
      result = result.filter((r) => r.state === stateFilter)
    }

    // Manual pass filter
    if (passFilter) {
      result = result.filter((r) => r.passes.some((p) => p.passId === passFilter))
    }

    // AI filters (layered on top of manual)
    if (aiFilter) {
      if (aiFilter.state) {
        result = result.filter((r) => r.state === aiFilter.state)
      }
      if (aiFilter.passFilter) {
        result = result.filter((r) => r.passes.some((p) => p.passId === aiFilter.passFilter))
      }
      if (aiFilter.maxPrice !== null && aiFilter.maxPrice !== undefined) {
        result = result.filter((r) => r.avgTicketPrice <= (aiFilter.maxPrice as number))
      }
      if (aiFilter.difficulty) {
        const check = DIFFICULTY_THRESHOLDS[aiFilter.difficulty]
        if (check) result = result.filter((r) => check(r.difficulty))
      }
    }

    const effectiveSort = aiFilter?.sort ?? sort

    return [...result].sort((a, b) => {
      if (effectiveSort === 'rating') return b.rating - a.rating
      if (effectiveSort === 'snow') return (b.weather?.snowDepthFt ?? 0) - (a.weather?.snowDepthFt ?? 0)
      if (effectiveSort === 'lifts') return (b.weather?.liftsOpen ?? -1) - (a.weather?.liftsOpen ?? -1)
      if (effectiveSort === 'price-asc') return a.avgTicketPrice - b.avgTicketPrice
      if (effectiveSort === 'price-desc') return b.avgTicketPrice - a.avgTicketPrice
      return 0
    })
  }, [resorts, stateFilter, passFilter, aiFilter, sort])

  return (
    <>
      {/* Page header */}
      <div className="bg-navy pb-12 pt-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-gold">US Ski Resorts</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Find Your Mountain
          </h1>
          <p className="mt-3 text-white/50">
            Live lift status · Open runs · Snow depth · Ratings · Ticket prices
          </p>

          {/* AI-powered search bar */}
          <div className="mt-8 flex max-w-xl items-center gap-3 rounded-2xl bg-white/8 px-5 py-3.5 ring-1 ring-white/10 transition focus-within:ring-gold/40">
            {/* Sparkle icon */}
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 text-gold/60">
              <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" fill="currentColor" />
              <path d="M19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75L19 15z" fill="currentColor" opacity="0.5" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={nlQuery}
              onChange={(e) => {
                setNlQuery(e.target.value)
                if (aiFilter) setAiFilter(null)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') runAiSearch()
              }}
              disabled={aiLoading}
              placeholder="Try: beginner-friendly Colorado under $170…"
              className="flex-1 bg-transparent text-white outline-none placeholder:text-white/30 disabled:opacity-50"
            />
            {nlQuery && !aiLoading && (
              <button onClick={clearAiFilter} className="text-white/30 transition hover:text-white">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
            <button
              onClick={runAiSearch}
              disabled={!nlQuery.trim() || aiLoading}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gold/20 text-gold transition hover:bg-gold/30 disabled:opacity-30"
              aria-label="AI search"
            >
              {aiLoading ? (
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 animate-spin">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeDashoffset="12" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
          <p className="mt-2 text-xs text-white/25">
            Describe what you want in plain English, or use the filters below
          </p>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 py-3 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {/* Row 1: state filters + sort */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {STATES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStateFilter(s)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    stateFilter === s
                      ? 'bg-navy text-white shadow-sm'
                      : 'bg-gray-100 text-foreground/60 hover:bg-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground/40">Sort:</span>
              <select
                value={aiFilter?.sort ?? sort}
                onChange={(e) => {
                  setSort(e.target.value)
                  if (aiFilter?.sort) setAiFilter({ ...aiFilter, sort: null })
                }}
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

          {/* Row 2: pass filters */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-foreground/35">Pass:</span>
            <button
              onClick={() => setPassFilter(null)}
              className={`rounded-full px-3.5 py-1 text-xs font-medium transition ${
                passFilter === null
                  ? 'bg-navy text-white shadow-sm'
                  : 'bg-gray-100 text-foreground/60 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {PASS_FILTERS.map((p) => {
              const isOwned = userPasses.includes(p.id)
              const isActive = passFilter === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => setPassFilter(isActive ? null : p.id)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium transition ${
                    isActive
                      ? p.activeClass
                      : 'bg-gray-100 text-foreground/60 hover:bg-gray-200'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-white' : p.dotClass}`} />
                  {p.label}
                  {isOwned && (
                    <span className={`rounded-full px-1.5 py-px text-[10px] font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                      YOURS
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Resort grid */}
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        {/* AI filter banner */}
        {aiFilter?.explanation && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-gold/25 bg-gold/10 px-4 py-3">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0 text-gold">
              <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
            </svg>
            <span className="flex-1 text-sm font-medium text-gold">{aiFilter.explanation}</span>
            <button
              onClick={clearAiFilter}
              className="text-gold/50 transition hover:text-gold"
              aria-label="Clear AI search"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-lg text-foreground/40">No resorts match your search.</p>
            <button
              onClick={() => {
                setStateFilter('All')
                setPassFilter(null)
                clearAiFilter()
              }}
              className="mt-4 text-sm text-gold transition hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-foreground/40">
              {filtered.length} resort{filtered.length !== 1 ? 's' : ''} found
              {(passFilter || (aiFilter?.passFilter)) && (
                <span className="ml-2 text-foreground/30">
                  · filtered by {PASS_FILTERS.find((p) => p.id === (passFilter ?? aiFilter?.passFilter))?.label}
                </span>
              )}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((resort) => (
                <ResortCard key={resort.id} resort={resort} userPasses={userPasses} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
