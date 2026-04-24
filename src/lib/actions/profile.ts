"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySessionToken } from "@/lib/auth";
import { updateUser, type SkillLevel } from "@/lib/users";

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
  const bio = (formData.get("bio") as string | null)?.trim() ?? "";
  const avatarUrl = (formData.get("avatarUrl") as string | null)?.trim() ?? "";
  const coverUrl = (formData.get("coverUrl") as string | null)?.trim() ?? "";
  const skillLevel = (formData.get("skillLevel") as string | null) as SkillLevel | null;
  const favoriteResorts = formData.getAll("favoriteResorts") as string[];
  const skiPasses = formData.getAll("skiPasses") as string[];
  const slopesConnected = formData.get("slopesConnected") === "true";

  if (!name) return { error: "Name is required." };

  updateUser(session.userId, {
    name,
    bio: bio || undefined,
    avatarUrl: avatarUrl || undefined,
    coverUrl: coverUrl || undefined,
    skillLevel: skillLevel ?? undefined,
    favoriteResorts,
    skiPasses,
    slopesConnected,
  });

  revalidatePath("/profile");
  return { success: true };
}
