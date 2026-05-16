'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { verifySessionToken } from '@/lib/auth'
import { findUserById, findUserByVerificationToken, updateUser } from '@/lib/users'

export type VerificationState =
  | { error?: string; success?: boolean; verifyUrl?: string }
  | undefined

export async function requestEmailVerification(
  _prev: VerificationState,
  _formData: FormData
): Promise<VerificationState> {
  const jar = await cookies()
  const rawToken = jar.get('session')?.value
  const session = rawToken ? verifySessionToken(rawToken) : null
  if (!session) redirect('/login')

  const user = findUserById(session.userId)
  if (!user) redirect('/login')

  if (user.emailVerified) return { error: 'Email is already verified.' }

  const part1 = crypto.randomUUID().replace(/-/g, '')
  const part2 = crypto.randomUUID().replace(/-/g, '')
  const verificationToken = part1 + part2
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

  updateUser(session.userId, {
    verificationToken,
    verificationTokenExpiry: expiry
  })

  revalidatePath('/profile')
  return { success: true, verifyUrl: `/verify-email?token=${verificationToken}` }
}

export async function verifyEmailToken(
  token: string
): Promise<{ success: boolean; error?: string }> {
  if (!token) return { success: false, error: 'No token provided.' }

  const user = findUserByVerificationToken(token)
  if (!user) return { success: false, error: 'This link is invalid or has already been used.' }

  if (
    !user.verificationTokenExpiry ||
    new Date(user.verificationTokenExpiry) < new Date()
  ) {
    return {
      success: false,
      error: 'This link has expired. Please request a new one from your profile.'
    }
  }

  updateUser(user.id, {
    emailVerified: true,
    verificationToken: undefined,
    verificationTokenExpiry: undefined
  })

  return { success: true }
}
