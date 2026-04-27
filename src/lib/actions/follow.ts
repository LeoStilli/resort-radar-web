'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { verifySessionToken } from '@/lib/auth'
import { findUserById, updateUser } from '@/lib/users'

export async function toggleFollow(targetUserId: string): Promise<void> {
  const jar = await cookies()
  const token = jar.get('session')?.value
  const session = token ? verifySessionToken(token) : null
  if (!session) redirect('/login')

  const currentId = session.userId
  if (currentId === targetUserId) return

  const current = findUserById(currentId)
  const target = findUserById(targetUserId)
  if (!current || !target) return

  const alreadyFollowing = (current.following ?? []).includes(targetUserId)

  if (alreadyFollowing) {
    updateUser(currentId, {
      following: (current.following ?? []).filter((id) => id !== targetUserId),
    })
    updateUser(targetUserId, {
      followers: (target.followers ?? []).filter((id) => id !== currentId),
    })
  } else {
    updateUser(currentId, {
      following: [...(current.following ?? []), targetUserId],
    })
    updateUser(targetUserId, {
      followers: [...(target.followers ?? []), currentId],
    })
  }

  revalidatePath('/profile')
}
