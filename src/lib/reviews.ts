import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");

export interface Review {
  id: string;
  resortId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  createdAt: string;
}

function readReviews(): Review[] {
  if (!fs.existsSync(REVIEWS_FILE)) return [];
  return JSON.parse(fs.readFileSync(REVIEWS_FILE, "utf-8")) as Review[];
}

function writeReviews(reviews: Review[]): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
}

export function getResortReviews(resortId: string): Review[] {
  return readReviews()
    .filter((r) => r.resortId === resortId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addReview(
  resortId: string,
  userId: string,
  userName: string,
  rating: number,
  text: string
): Review {
  const reviews = readReviews();
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
  writeReviews(reviews);
  return review;
}

export function hasUserReviewed(resortId: string, userId: string): boolean {
  return readReviews().some((r) => r.resortId === resortId && r.userId === userId);
}

export function getUserReviews(userId: string): Review[] {
  return readReviews()
    .filter((r) => r.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
