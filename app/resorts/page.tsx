import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth";
import { fetchAllResortWeather } from "@/lib/resorts";
import Nav from "@/components/nav";
import ResortSearch from "./resort-search";

export default async function ResortsPage() {
  const jar = await cookies();
  const token = jar.get("session")?.value;
  const user = token ? verifySessionToken(token) : null;

  const resorts = await fetchAllResortWeather();

  return (
    <main className="min-h-screen bg-cream">
      <Nav user={user} />
      <ResortSearch resorts={resorts} />
    </main>
  );
}
