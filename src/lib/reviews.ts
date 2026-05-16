import { Redis } from '@upstash/redis'

// Redis client setup with fallback for local development
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN
    })
  : null

// In-memory fallback for local development
let memoryReviews: Review[] = []

export interface Review {
  id: string;
  resortId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  createdAt: string;
}

async function readReviews(): Promise<Review[]> {
  if (redis) {
    try {
      const reviews = await redis.get('reviews')
      return reviews ? JSON.parse(reviews as string) : []
    } catch (error) {
      console.error('Redis error:', error)
      return []
    }
  }
  return memoryReviews
}

async function writeReviews(reviews: Review[]): Promise<void> {
  if (redis) {
    try {
      await redis.set('reviews', JSON.stringify(reviews))
    } catch (error) {
      console.error('Redis write error:', error)
    }
  } else {
    memoryReviews = reviews
  }
}

export async function getResortReviews(resortId: string): Promise<Review[]> {
  const reviews = await readReviews()
  return reviews
    .filter((r) => r.resortId === resortId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function addReview(
  resortId: string,
  userId: string,
  userName: string,
  rating: number,
  text: string
): Promise<Review> {
  const reviews = await readReviews();
  const review: Review = {
    id: crypto.randomUUID(),
    resortId,
    userId,
    userName,
    rating,
    text,
    createdAt: new Date().toISOString(),
  };
  reviews.push(review);
  await writeReviews(reviews);
  return review;
}

export async function hasUserReviewed(resortId: string, userId: string): Promise<boolean> {
  const reviews = await readReviews()
  return reviews.some((r) => r.resortId === resortId && r.userId === userId);
}

export async function getUserReviews(userId: string): Promise<Review[]> {
  const reviews = await readReviews()
  return reviews
    .filter((r) => r.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
