'use client'

import { useActionState, useEffect, useState } from 'react'
import Link from 'next/link'
import { requestEmailVerification, type VerificationState } from '@/lib/actions/verification'

const PASS_META: { id: string; label: string; color: string }[] = [
  { id: 'epic', label: 'Epic Pass', color: 'sky' },
  { id: 'ikon', label: 'Ikon Pass', color: 'blue' },
  { id: 'mountain-collective', label: 'Mountain Collective', color: 'emerald' }
]

interface VerificationHubProps {
  email: string
  emailVerified: boolean
  hasBio: boolean
  hasAvatar: boolean
  hasSkillLevel: boolean
  hasSkiPass: boolean
  hasLikedResort: boolean
  skiPasses: string[]
}

export function VerificationHub({
  email,
  emailVerified,
  hasBio,
  hasAvatar,
  hasSkillLevel,
  hasSkiPass,
  hasLikedResort,
  skiPasses
}: VerificationHubProps) {
  const [state, formAction, pending] = useActionState<VerificationState, FormData>(
    requestEmailVerification,
    undefined
  )
  const [copied, setCopied] = useState(false)
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  function copyLink() {
    if (!state?.verifyUrl) return
    navigator.clipboard.writeText(origin + state.verifyUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const steps = [
    { label: 'Name set', done: true },
    { label: 'Bio added', done: hasBio },
    { label: 'Avatar set', done: hasAvatar },
    { label: 'Email verified', done: emailVerified },
    { label: 'Skill level', done: hasSkillLevel },
    { label: 'Ski pass linked', done: hasSkiPass },
    { label: 'Liked a resort', done: hasLikedResort }
  ]

  const completedCount = steps.filter((s) => s.done).length
  const percentage = Math.round((completedCount / steps.length) * 100)

  return (
    <section className='border-b border-white/10 py-12'>
      <div className='mx-auto max-w-7xl px-6 lg:px-10'>
        <p className='text-sm font-semibold uppercase tracking-wide text-gold'>Identity & Status</p>
        <h2 className='mt-1 mb-8 text-2xl font-bold text-white'>Account</h2>

        {/* ── Profile completion ── */}
        <div className='mb-6 rounded-2xl border border-white/10 bg-white/5 p-6'>
          <div className='mb-3 flex items-center justify-between'>
            <p className='text-sm font-semibold text-white'>Profile Completion</p>
            <span
              className={`text-sm font-bold tabular-nums ${
                percentage === 100 ? 'text-gold' : 'text-white/45'
              }`}
            >
              {completedCount} / {steps.length}
            </span>
          </div>
          {/* Progress bar */}
          <div className='mb-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10'>
            <div
              className='h-full rounded-full bg-gradient-to-r from-gold/60 to-gold transition-all duration-700'
              style={{ width: `${percentage}%` }}
            />
          </div>
          {/* Step indicators */}
          <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
            {steps.map((step) => (
              <div key={step.label} className='flex items-center gap-2'>
                <div
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition ${
                    step.done ? 'bg-gold' : 'border border-white/15'
                  }`}
                >
                  {step.done && (
                    <svg viewBox='0 0 10 10' fill='none' className='h-2.5 w-2.5'>
                      <path
                        d='M1.5 5l2.5 2.5 4.5-4'
                        stroke='#0c1a2a'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  )}
                </div>
                <span className={`text-xs ${step.done ? 'text-white/65' : 'text-white/22'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          {/* ── Email verification card ── */}
          <div
            className={`rounded-2xl border p-6 transition ${
              emailVerified
                ? 'border-emerald-500/25 bg-emerald-500/5'
                : 'border-white/10 bg-white/5'
            }`}
          >
            <div className='mb-4 flex items-start justify-between gap-3'>
              <div className='min-w-0 flex-1'>
                <p className='text-xs font-semibold uppercase tracking-widest text-white/30'>
                  Email Address
                </p>
                <p className='mt-1 truncate text-sm font-medium text-white'>{email}</p>
              </div>
              {emailVerified ? (
                <span className='flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400'>
                  <svg viewBox='0 0 12 12' fill='none' className='h-3 w-3'>
                    <path
                      d='M2 6l2.5 2.5 5.5-5'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  Verified
                </span>
              ) : (
                <span className='shrink-0 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400'>
                  Unverified
                </span>
              )}
            </div>

            {emailVerified ? (
              <p className='text-xs leading-relaxed text-white/35'>
                Your email is confirmed. You&apos;ve earned the{' '}
                <span className='text-white/55'>Verified Member</span> badge.
              </p>
            ) : state?.verifyUrl ? (
              /* Verification link ready — show copy box */
              <div className='space-y-3'>
                <p className='text-xs leading-relaxed text-white/45'>
                  Your verification link is ready. Copy it and open it in your browser — it
                  expires in 24 hours.
                </p>
                <div className='flex items-center gap-2 overflow-hidden rounded-xl border border-white/10 bg-navy/60 px-3 py-2'>
                  <span className='flex-1 truncate font-mono text-[11px] text-white/35'>
                    {origin}{state.verifyUrl}
                  </span>
                  <button
                    type='button'
                    onClick={copyLink}
                    className='shrink-0 rounded-lg bg-white/8 px-3 py-1 text-xs font-semibold text-white/60 transition hover:bg-white/14 hover:text-white'
                  >
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
                <Link
                  href={state.verifyUrl}
                  className='inline-block text-xs text-gold/70 underline-offset-2 transition hover:text-gold hover:underline'
                >
                  Or click here to verify now →
                </Link>
              </div>
            ) : (
              /* Default state — prompt to verify */
              <>
                {state?.error && (
                  <p className='mb-3 text-xs text-red-400'>{state.error}</p>
                )}
                <p className='mb-4 text-xs leading-relaxed text-white/35'>
                  Verify your email to unlock the{' '}
                  <span className='text-white/55'>Verified Member</span> badge and show others
                  your account is legit.
                </p>
                <form action={formAction}>
                  <button
                    type='submit'
                    disabled={pending}
                    className='rounded-full border border-gold/35 px-4 py-2 text-xs font-semibold text-gold/80 transition hover:border-gold/60 hover:bg-gold/5 hover:text-gold disabled:cursor-not-allowed disabled:opacity-40'
                  >
                    {pending ? 'Generating link…' : 'Get Verification Link'}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* ── Ski passes card ── */}
          <div className='rounded-2xl border border-white/10 bg-white/5 p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <p className='text-xs font-semibold uppercase tracking-widest text-white/30'>
                Ski Passes
              </p>
              <Link
                href='#settings'
                className='text-xs text-gold/60 transition hover:text-gold'
              >
                Manage →
              </Link>
            </div>

            <div className='space-y-2'>
              {PASS_META.map((pass) => {
                const active = skiPasses.includes(pass.id)
                return (
                  <div
                    key={pass.id}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                      active ? 'bg-gold/10' : 'bg-white/3'
                    }`}
                  >
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                        active ? 'bg-gold' : 'border border-white/15'
                      }`}
                    >
                      {active && (
                        <svg viewBox='0 0 10 10' fill='none' className='h-2.5 w-2.5'>
                          <path
                            d='M1.5 5l2.5 2.5 4.5-4'
                            stroke='#0c1a2a'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${active ? 'text-gold' : 'text-white/25'}`}
                    >
                      {pass.label}
                    </span>
                    {active && (
                      <span className='ml-auto text-[10px] font-semibold uppercase tracking-wide text-gold/50'>
                        Linked
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            <p className='mt-4 text-xs leading-relaxed text-white/25'>
              {skiPasses.length === 0
                ? 'No passes linked yet — add yours in settings to see which resorts are covered.'
                : skiPasses.length === 1
                  ? '1 pass linked. Resort pages show your coverage at a glance.'
                  : `${skiPasses.length} passes linked. Resort pages show your coverage at a glance.`}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
