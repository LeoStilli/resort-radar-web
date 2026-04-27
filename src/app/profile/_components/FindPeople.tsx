'use client'

import { useState, useTransition, useRef, useEffect, useCallback } from 'react'
import { toggleFollow } from '@/lib/actions/follow'

interface SearchResult {
  id: string
  name: string
  avatarUrl?: string
  skillLevel?: string
  isFollowing: boolean
}

const SKILL_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
}

function UserRow({ user, onToggle }: { user: SearchResult; onToggle: (id: string) => void }) {
  const [pending, startTransition] = useTransition()

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  function handleFollow() {
    onToggle(user.id)
    startTransition(async () => {
      await toggleFollow(user.id)
    })
  }

  return (
    <div className="flex items-center gap-3 py-2.5">
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user.name}
          className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-white/10"
        />
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-sm font-bold text-gold ring-1 ring-gold/20">
          {initials}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{user.name}</p>
        {user.skillLevel && (
          <p className="text-xs text-white/35">{SKILL_LABELS[user.skillLevel] ?? user.skillLevel}</p>
        )}
      </div>
      <button
        onClick={handleFollow}
        disabled={pending}
        className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition disabled:opacity-60 ${
          user.isFollowing
            ? 'bg-white/10 text-white/60 hover:bg-red-500/15 hover:text-red-400'
            : 'bg-gold text-navy hover:bg-amber-400'
        }`}
      >
        {user.isFollowing ? 'Following' : 'Follow'}
      </button>
    </div>
  )
}

export function FindPeople() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(q)}`)
      if (res.ok) setResults(await res.json() as SearchResult[])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(query), 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, search])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
    else {
      setQuery('')
      setResults([])
    }
  }, [open])

  function handleToggle(id: string) {
    setResults((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isFollowing: !u.isFollowing } : u))
    )
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/60 transition hover:border-gold/30 hover:bg-gold/10 hover:text-gold"
      >
        <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M15 15l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M9 6v6M6 9h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Find Skiers
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <div
            className="absolute inset-0 bg-navy/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-[#0c1a2a] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/8 px-5 pt-5 pb-4">
              <h3 className="text-base font-bold text-white">Find Skiers</h3>
              <button
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-white/40 transition hover:bg-white/10 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Search input */}
            <div className="px-5 pt-4 pb-3">
              <div className="flex items-center gap-2.5 rounded-xl bg-white/8 px-3.5 py-2.5 ring-1 ring-white/10 focus-within:ring-gold/40">
                {loading ? (
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 animate-spin text-white/30">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeDashoffset="12" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-white/30">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name…"
                  className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="text-white/30 transition hover:text-white">
                    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Results */}
            <div className="max-h-72 overflow-y-auto px-5 pb-5">
              {query.length < 2 ? (
                <p className="py-8 text-center text-sm text-white/25">Type at least 2 characters to search</p>
              ) : results.length === 0 && !loading ? (
                <p className="py-8 text-center text-sm text-white/25">No users found for &ldquo;{query}&rdquo;</p>
              ) : (
                <div className="divide-y divide-white/8">
                  {results.map((user) => (
                    <UserRow key={user.id} user={user} onToggle={handleToggle} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
