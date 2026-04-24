import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth";
import { findUserById } from "@/lib/users";
import { fetchAllResortWeather } from "@/lib/resorts";
import { Nav } from "@/components/Nav";
import { ResortSearch } from "./_components/ResortSearch";

export default async function ResortsPage() {
  const jar = await cookies();
  const token = jar.get("session")?.value;
  const session = token ? verifySessionToken(token) : null;
  const user = session ? findUserById(session.userId) : null;

  const resorts = await fetchAllResortWeather();

  return (
    <main className="min-h-screen bg-cream">
      <Nav user={session} />
      <ResortSearch resorts={resorts} userPasses={user?.skiPasses ?? []} />
    </main>
  );
}
