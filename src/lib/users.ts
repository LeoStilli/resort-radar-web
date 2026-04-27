import fs from "node:fs";
import path from "node:path";
import { hashPassword } from "./auth";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  slopesConnected?: boolean;
  skillLevel?: SkillLevel;
  favoriteResorts?: string[];
  likedResorts?: string[];
  followers?: string[];
  following?: string[];
  skiPasses?: string[];
}

function readUsers(): User[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8")) as User[];
}

function writeUsers(users: User[]): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export function findUserByEmail(email: string): User | undefined {
  return readUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
}

export function findUserById(id: string): User | undefined {
  return readUsers().find((u) => u.id === id);
}

export interface PublicUser {
  id: string;
  name: string;
  avatarUrl?: string;
  skillLevel?: SkillLevel;
}

export function searchUsers(query: string, excludeId: string): PublicUser[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return readUsers()
    .filter((u) => u.id !== excludeId && u.name.toLowerCase().includes(q))
    .slice(0, 10)
    .map(({ id, name, avatarUrl, skillLevel }) => ({ id, name, avatarUrl, skillLevel }));
}

export function getResortLikeCount(resortId: string): number {
  return readUsers().filter((u) => u.likedResorts?.includes(resortId) ?? false).length;
}

export async function createUser(
  email: string,
  name: string,
  password: string
): Promise<User> {
  const users = readUsers();
  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(password);
  const user: User = {
    id,
    email,
    name,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeUsers(users);
  return user;
}

export function updateUser(
  id: string,
  updates: Partial<Pick<User, "name" | "bio" | "avatarUrl" | "coverUrl" | "slopesConnected" | "skillLevel" | "favoriteResorts" | "likedResorts" | "followers" | "following" | "skiPasses">>
): User | undefined {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return undefined;
  users[idx] = { ...users[idx], ...updates };
  writeUsers(users);
  return users[idx];
}
