import { cookies } from 'next/headers'
import { verifySessionToken } from '@/lib/auth'
import { searchUsers, findUserById } from '@/lib/users'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') ?? ''

  const jar = await cookies()
  const token = jar.get('session')?.value
  const session = token ? verifySessionToken(token) : null
  if (!session) return Response.json([], { status: 401 })

  const currentUser = await findUserById(session.userId)
  const following = new Set(currentUser?.following ?? [])

  const results = (await searchUsers(q, session.userId)).map((u) => ({
    ...u,
    isFollowing: following.has(u.id),
  }))

  return Response.json(results)
}
