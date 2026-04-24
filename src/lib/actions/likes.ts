"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySessionToken } from "@/lib/auth";
import { findUserById, updateUser } from "@/lib/users";

export async function toggleLike(resortId: string): Promise<void> {
  const jar = await cookies();
  const token = jar.get("session")?.value;
  const session = token ? verifySessionToken(token) : null;
  if (!session) redirect("/login");

  const user = findUserById(session.userId);
  if (!user) redirect("/login");

  const liked = user.likedResorts ?? [];
  const newLiked = liked.includes(resortId)
    ? liked.filter((id) => id !== resortId)
    : [...liked, resortId];

  updateUser(session.userId, { likedResorts: newLiked });
  revalidatePath(`/resorts/${resortId}`);
}
