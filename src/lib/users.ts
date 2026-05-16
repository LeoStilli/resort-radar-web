import { Redis } from '@upstash/redis'
import { hashPassword } from './auth'

// Redis client setup with fallback for local development
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN
    })
  : null

// In-memory fallback for local development
let memoryUsers: User[] = [
  {
    id: '27f381cd-7fc4-44e5-8cb2-85f808ce9741',
    email: 'stillileonardo@gmail.com',
    name: 'Leo Stilli',
    passwordHash: 'fd88cb8c7174c4ea57b8caa5986ad304:7f60cf79f7cf3154be0186810f854304ec31cf30943148ce11776e90ea91d2acf0b948cad32640fa2dd1ed3f9ad14c57ade63e49aa4b4d0872d60ad15d0ce182',
    createdAt: '2026-04-23T22:45:05.579Z',
    bio: 'Expert skier',
    avatarUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80',
    skillLevel: 'expert' as SkillLevel,
    favoriteResorts: ['jackson-hole', 'chamonix', 'niseko', 'vail', 'park-city', 'killington'],
    likedResorts: ['jackson-hole', 'vail'],
    slopesConnected: true,
    skiPasses: ['ikon', 'mountain-collective']
  }
]

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export interface User {
  id: string
  email: string
  name: string
  passwordHash: string
  createdAt: string
  bio?: string
  avatarUrl?: string
  coverUrl?: string
  slopesConnected?: boolean
  skillLevel?: SkillLevel
  favoriteResorts?: string[]
  likedResorts?: string[]
  followers?: string[]
  following?: string[]
  skiPasses?: string[]
  emailVerified?: boolean
  verificationToken?: string
  verificationTokenExpiry?: string
}

export interface PublicUser {
  id: string
  name: string
  avatarUrl?: string
  skillLevel?: SkillLevel
}

async function readUsers(): Promise<User[]> {
  if (redis) {
    try {
      const users = await redis.get('users')
      return users ? JSON.parse(users as string) : []
    } catch (error) {
      console.error('Redis error:', error)
      return []
    }
  }
  return memoryUsers
}

async function writeUsers(users: User[]): Promise<void> {
  if (redis) {
    try {
      await redis.set('users', JSON.stringify(users))
    } catch (error) {
      console.error('Redis write error:', error)
    }
  } else {
    memoryUsers = users
  }
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const users = await readUsers()
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase())
}

export async function findUserById(id: string): Promise<User | undefined> {
  const users = await readUsers()
  return users.find((u) => u.id === id)
}

export async function searchUsers(query: string, excludeId: string): Promise<PublicUser[]> {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  const users = await readUsers()
  return users
    .filter((u) => u.id !== excludeId && u.name.toLowerCase().includes(q))
    .slice(0, 10)
    .map(({ id, name, avatarUrl, skillLevel }) => ({ id, name, avatarUrl, skillLevel }))
}

export async function getResortLikeCount(resortId: string): Promise<number> {
  const users = await readUsers()
  return users.filter((u) => u.likedResorts?.includes(resortId) ?? false).length
}

export async function createUser(
  email: string,
  name: string,
  password: string
): Promise<User> {
  const users = await readUsers()
  const id = crypto.randomUUID()
  const passwordHash = await hashPassword(password)
  const user: User = {
    id,
    email,
    name,
    passwordHash,
    createdAt: new Date().toISOString()
  }
  users.push(user)
  await writeUsers(users)
  return user
}

export async function findUserByVerificationToken(token: string): Promise<User | undefined> {
  const users = await readUsers()
  return users.find((u) => u.verificationToken === token)
}

export async function updateUser(
  id: string,
  updates: Partial<Pick<User, 'name' | 'bio' | 'avatarUrl' | 'coverUrl' | 'slopesConnected' | 'skillLevel' | 'favoriteResorts' | 'likedResorts' | 'followers' | 'following' | 'skiPasses' | 'emailVerified' | 'verificationToken' | 'verificationTokenExpiry'>>
): Promise<User | undefined> {
  const users = await readUsers()
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) return undefined
  users[idx] = { ...users[idx], ...updates }
  await writeUsers(users)
  return users[idx]
}
