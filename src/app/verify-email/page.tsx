import type { Metadata } from 'next'
import Link from 'next/link'
import { Nav } from '@/components/Nav'
import { verifyEmailToken } from '@/lib/actions/verification'

export const metadata: Metadata = {
  title: 'Verify Email — Resort Radar'
}

interface Props {
  searchParams: Promise<{ token?: string }>
}

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { token } = await searchParams

  if (!token) {
    return (
      <main className='min-h-screen bg-navy'>
        <Nav user={null} />
        <div className='flex min-h-screen items-center justify-center px-6'>
          <ResultCard
            icon='⚠️'
            title='Missing Token'
            message='This verification link is incomplete. Please use the exact link from your profile page.'
            ctaHref='/profile'
            ctaLabel='Go to Profile'
            isError
          />
        </div>
      </main>
    )
  }

  const result = await verifyEmailToken(token)

  return (
    <main className='min-h-screen bg-navy'>
      <Nav user={null} />
      <div className='flex min-h-screen items-center justify-center px-6'>
        {result.success ? (
          <ResultCard
            icon='✉️'
            title='Email Verified!'
            message="Your email has been confirmed. You're now a verified member of Resort Radar — and you've earned a new badge."
            ctaHref='/profile'
            ctaLabel='View My Profile →'
          />
        ) : (
          <ResultCard
            icon='❌'
            title='Verification Failed'
            message={result.error ?? 'Something went wrong. Please try again.'}
            ctaHref='/profile'
            ctaLabel='Back to Profile'
            isError
          />
        )}
      </div>
    </main>
  )
}

interface ResultCardProps {
  icon: string
  title: string
  message: string
  ctaHref: string
  ctaLabel: string
  isError?: boolean
}

function ResultCard({ icon, title, message, ctaHref, ctaLabel, isError = false }: ResultCardProps) {
  return (
    <div className='w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 text-center'>
      <div className='mb-5 flex justify-center'>
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl ${
            isError ? 'bg-red-500/10' : 'bg-gold/10'
          }`}
        >
          {icon}
        </div>
      </div>
      <h1 className='text-xl font-bold text-white'>{title}</h1>
      <p className='mt-3 text-sm leading-relaxed text-white/50'>{message}</p>
      <Link
        href={ctaHref}
        className={`mt-7 inline-block rounded-full px-6 py-2.5 text-sm font-semibold transition ${
          isError
            ? 'border border-white/20 text-white/70 hover:border-white/40 hover:text-white'
            : 'bg-gold text-navy hover:bg-amber-400'
        }`}
      >
        {ctaLabel}
      </Link>
    </div>
  )
}
