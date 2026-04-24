"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "../lib/auth";
import { updateUser, type SkillLevel } from "../lib/users";

export type ProfileState = { error?: string; success?: boolean } | undefined;

export async function updateProfile(
  _prev: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const jar = await cookies();
  const token = jar.get("session")?.value;
  const session = token ? verifySessionToken(token) : null;
  if (!session) redirect("/login");

  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const skillLevel = (formData.get("skillLevel") as string | null) as SkillLevel | null;
  const favoritesRaw = formData.getAll("favoriteResorts") as string[];

  if (!name) return { error: "Name is required." };

  updateUser(session.userId, {
    name,
    skillLevel: skillLevel ?? undefined,
    favoriteResorts: favoritesRaw,
  });

  return { success: true };
}
