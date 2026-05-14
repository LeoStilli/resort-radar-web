"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySessionToken } from "@/lib/auth";
import { findUserById } from "@/lib/users";
import { addReview } from "@/lib/reviews";

export type ReviewState = { error?: string; success?: boolean } | undefined;

export async function submitReview(
  resortId: string,
  _prev: ReviewState,
  formData: FormData
): Promise<ReviewState> {
  const jar = await cookies();
  const token = jar.get("session")?.value;
  const session = token ? verifySessionToken(token) : null;
  if (!session) redirect("/login");

  const user = await findUserById(session.userId);
  if (!user) redirect("/login");

  const rating = parseInt(formData.get("rating") as string, 10);
  const text = ((formData.get("text") as string | null) ?? "").trim();

  if (!text) return { error: "Please write something before submitting." };
  if (isNaN(rating) || rating < 1 || rating > 5) return { error: "Please select a star rating." };

  addReview(resortId, session.userId, user.name, rating, text);
  revalidatePath(`/resorts/${resortId}`);
  return { success: true };
}
