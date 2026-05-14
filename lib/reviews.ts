import { Redis } from '@upstash/redis'

// Redis client setup with fallback for local development
// Only create Redis client at runtime, not during build
const getRedisClient = () => {
  if (typeof window !== 'undefined') return null // Client-side
  if (process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV) {
    const url = process.env.UPSTASH_REDIS_REST_URL?.trim()
    const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim()

    if (url && token && url.startsWith('https://')) {
      console.log('Creating Redis client with URL:', url.substring(0, 20) + '...')
      return new Redis({ url, token })
    } else {
      console.warn('Redis credentials missing or invalid:', {
        hasUrl: !!url,
        hasToken: !!token,
        urlStart: url?.substring(0, 10)
      })
    }
  }
  return null
}

// In-memory fallback for local development
let memoryReviews: Review[] = [
  {
    id: '4e7c9e80-9eeb-423f-9d55-c5f6ad41a13f',
    resortId: 'jackson-hole',
    userId: '27f381cd-7fc4-44e5-8cb2-85f808ce9741',
    userName: 'Leo Stilli',
    rating: 5,
    text: 'love this place',
    createdAt: '2026-04-24T06:14:40.329Z'
  }
]

export interface Review {
  id: string
  resortId: string
  userId: string
  userName: string
  rating: number
  text: string
  createdAt: string
}

async function readReviews(): Promise<Review[]> {
  const redis = getRedisClient()
  if (redis) {
    try {
      const reviews = await redis.get('reviews')
      if (!reviews) return []

      // Handle both JSON string and already-parsed object from Redis
      if (typeof reviews === 'string') {
        return JSON.parse(reviews)
      } else if (Array.isArray(reviews)) {
        return reviews as Review[]
      } else {
        console.warn('Unexpected Redis reviews data format:', typeof reviews)
        return []
      }
    } catch (error) {
      console.error('Redis reviews error:', error)
      return []
    }
  }
  return memoryReviews
}

async function writeReviews(reviews: Review[]): Promise<void> {
  const redis = getRedisClient()
  if (redis) {
    try {
      await redis.set('reviews', JSON.stringify(reviews))
    } catch (error) {
      console.error('Redis reviews write error:', error)
    }
  } else {
    memoryReviews = reviews
  }
}

export async function getResortReviews(resortId: string): Promise<Review[]> {
  const reviews = await readReviews()
  return reviews
    .filter((r) => r.resortId === resortId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function addReview(
  resortId: string,
  userId: string,
  userName: string,
  rating: number,
  text: string
): Promise<Review> {
  const reviews = await readReviews()
  const review: Review = {
    id: crypto.randomUUID(),
    resortId,
    userId,
    userName,
    rating,
    text,
    createdAt: new Date().toISOString()
  }
  reviews.push(review)
  await writeReviews(reviews)
  return review
}

export async function hasUserReviewed(resortId: string, userId: string): Promise<boolean> {
  const reviews = await readReviews()
  return reviews.some((r) => r.resortId === resortId && r.userId === userId)
}

export async function getUserReviews(userId: string): Promise<Review[]> {
  const reviews = await readReviews()
  return reviews
    .filter((r) => r.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}
