'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { findUserByEmail, createUser } from '@/lib/users'
import { verifyPassword, createSessionToken } from '@/lib/auth'

export type AuthState = { error: string } | undefined

const SESSION_OPTS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7
}

export async function login(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = (formData.get('email') as string | null)?.trim() ?? ''
  const password = (formData.get('password') as string | null) ?? ''

  if (!email || !password) return { error: 'Email and password are required.' }

  try {
    const user = await findUserByEmail(email)
    if (!user) return { error: 'Invalid email or password.' }

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) return { error: 'Invalid email or password.' }

    const token = createSessionToken(user.id, user.email)
    const jar = await cookies()
    jar.set('session', token, SESSION_OPTS)
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'An error occurred during login. Please try again.' }
  }

  redirect('/')
}

export async function signup(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = (formData.get('email') as string | null)?.trim() ?? ''
  const name = (formData.get('name') as string | null)?.trim() ?? ''
  const password = (formData.get('password') as string | null) ?? ''

  if (!email || !name || !password) return { error: 'All fields are required.' }
  if (password.length < 8)
    return { error: 'Password must be at least 8 characters.' }

  try {
    const existing = await findUserByEmail(email)
    if (existing) return { error: 'An account with this email already exists.' }

    const user = await createUser(email, name, password)
    const token = createSessionToken(user.id, user.email)
    const jar = await cookies()
    jar.set('session', token, SESSION_OPTS)
  } catch (error) {
    console.error('Signup error:', error)
    return { error: 'An error occurred during signup. Please try again.' }
  }

  redirect('/')
}

export async function logout(): Promise<void> {
  try {
    const jar = await cookies()
    jar.delete('session')
    redirect('/')
  } catch (error) {
    console.error('Logout error:', error)
    redirect('/')
  }
}
