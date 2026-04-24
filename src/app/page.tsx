import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth";
import { fetchAllResortWeather, type Resort, type ResortWeather } from "@/lib/resorts";
import { Nav } from "@/components/Nav";
import { Chatbot } from "@/components/Chatbot";
import { ResortMapLoader } from "@/components/ResortMapLoader";
import type { MapResort } from "@/components/ResortMap";

type ResortWithWeather = Resort & { weather: ResortWeather | null };

function ConditionBadge({ condition }: { condition: string }) {
  const isPowder =
    condition.toLowerCase().includes("powder") ||
    condition.toLowerCase().includes("snowing");
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isPowder ? "bg-sky-400/20 text-sky-200" : "bg-white/15 text-white/80"
      }`}
    >
      {condition}
    </span>
  );
}

function ResortCard({ resort }: { resort: ResortWithWeather }) {
  const w = resort.weather;
  return (
    <Link href={`/resorts/${resort.id}`} className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={resort.image}
          alt={resort.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-navy/70 to-transparent" />
        {w && (
          <div className="absolute top-3 right-3">
            <ConditionBadge condition={w.condition} />
          </div>
        )}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-base font-semibold text-white">{resort.name}</h3>
          <p className="text-xs text-white/60">{resort.location}</p>
        </div>
      </div>
      {w ? (
        <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100 text-center">
          <div className="px-3 py-3">
            <p className="text-xs text-foreground/40">New Snow</p>
            <p className="text-sm font-semibold text-foreground">
              {w.snowfallTodayIn > 0 ? `${w.snowfallTodayIn}"` : "—"}
            </p>
          </div>
          <div className="px-3 py-3">
            <p className="text-xs text-foreground/40">Depth</p>
            <p className="text-sm font-semibold text-foreground">
              {w.snowDepthFt > 0 ? `${w.snowDepthFt} ft` : "—"}
            </p>
          </div>
          <div className="px-3 py-3">
            <p className="text-xs text-foreground/40">Temp</p>
            <p className="text-sm font-semibold text-foreground">{w.tempF}°F</p>
          </div>
        </div>
      ) : (
        <div className="border-t border-gray-100 px-4 py-3 text-center text-xs text-foreground/30">
          Conditions unavailable
        </div>
      )}
    </Link>
  );
}

export default async function HomePage() {
  const jar = await cookies();
  const token = jar.get("session")?.value;
  const user = token ? verifySessionToken(token) : null;

  const resorts = await fetchAllResortWeather();

  const ticker = resorts.map((r) => ({
    resort: r.name.split(" ")[0],
    snow: r.weather
      ? r.weather.snowfallTodayIn > 0
        ? `${r.weather.snowfallTodayIn}" new`
        : `${r.weather.snowDepthFt} ft base`
      : "—",
    status: r.weather?.condition ?? "—",
  }));

  const deepestBase = Math.max(...resorts.map((r) => r.weather?.snowDepthFt ?? 0));

  const mapResorts: MapResort[] = resorts.map((r) => ({
    id: r.id,
    name: r.name,
    location: r.location,
    lat: r.lat,
    lon: r.lon,
    trails: r.trails,
    vertical: r.vertical,
    weather: r.weather
      ? {
          tempF: r.weather.tempF,
          snowDepthFt: r.weather.snowDepthFt,
          snowfallTodayIn: r.weather.snowfallTodayIn,
          condition: r.weather.condition,
        }
      : null,
  }));

  return (
    <main className="bg-cream">
      <Nav user={user} />

      {/* ── Hero ── */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt="Mountain panorama at sunrise"
          fill className="object-cover" priority
        />
        <div className="absolute inset-0 bg-navy/50" />
        <div className="absolute inset-0 bg-linear-to-b from-navy/30 via-transparent to-navy/80" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <p className="animate-fade-in-up mb-4 inline-block rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm font-medium tracking-wide text-gold uppercase">
            Real-time mountain intelligence
          </p>
          <h1 className="animate-fade-in-up-delay text-5xl leading-tight font-bold tracking-tight text-white md:text-7xl md:leading-tight">
            Every mountain.
            <br />Every condition.
            <br /><span className="text-gold">One radar.</span>
          </h1>
          <p className="animate-fade-in-up-delay-2 mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70 md:text-xl">
            Live snow reports, trail conditions, and resort insights — so you always know where the best turns are.
          </p>
          <div className="animate-fade-in-up-delay-2 mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="#resorts" className="rounded-full bg-gold px-8 py-3.5 text-base font-semibold text-navy transition hover:bg-gold-light">
              Explore Resorts
            </a>
            <a href="#map" className="rounded-full border border-white/25 px-8 py-3.5 text-base font-semibold text-white transition hover:border-white/50 hover:bg-white/10">
              View Map
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white/50">
            <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* ── Conditions ticker ── */}
      <section id="conditions" className="overflow-hidden border-b border-white/10 bg-navy py-4">
        <div className="animate-ticker flex w-max gap-12">
          {[...ticker, ...ticker].map((c, i) => (
            <div key={i} className="flex shrink-0 items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-sm font-medium text-white">{c.resort}</span>
              <span className="text-sm text-white/50">{c.snow}</span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/70">{c.status}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-navy-light">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-white/10 md:grid-cols-4">
          {[
            { value: "2,800+", label: "Resorts Worldwide" },
            { value: "24 / 7", label: "Live Updates" },
            { value: "50+", label: "Countries Covered" },
            { value: `${deepestBase.toFixed(1)} ft`, label: "Deepest Base Right Now" },
          ].map((stat) => (
            <div key={stat.label} className="px-6 py-8 text-center md:py-10">
              <p className="text-2xl font-bold tracking-tight text-white md:text-3xl">{stat.value}</p>
              <p className="mt-1 text-sm text-white/40">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Resorts ── */}
      <section id="resorts" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-12 flex items-end justify-between">
            <div className="max-w-xl">
              <p className="text-sm font-semibold tracking-wide text-gold uppercase">Trending Resorts</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Where the snow is best right now
              </h2>
              <p className="mt-3 text-foreground/50">
                Live conditions from Open-Meteo, updated every 15 minutes.
              </p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {resorts.map((resort) => (
              <ResortCard key={resort.id} resort={resort} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Map ── */}
      <section id="map" className="bg-navy py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-10">
            <p className="text-sm font-semibold tracking-wide text-gold uppercase">Interactive Map</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Find your mountain
            </h2>
            <p className="mt-3 text-white/50">
              Click any marker to see live conditions. Pan and zoom to explore.
            </p>
          </div>
          <div className="h-125 overflow-hidden rounded-2xl border border-white/10">
            <ResortMapLoader resorts={mapResorts} />
          </div>
        </div>
      </section>

      {/* ── Photo break ── */}
      <section className="relative h-[50vh] min-h-80 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1920&q=80"
          alt="Skier carving through fresh powder"
          fill className="object-cover" sizes="100vw"
        />
        <div className="absolute inset-0 bg-navy/40" />
        <div className="relative z-10 flex h-full items-center justify-center px-6">
          <blockquote className="max-w-2xl text-center">
            <p className="text-2xl leading-relaxed font-light text-white md:text-3xl">
              &ldquo;The mountain doesn&apos;t care about your plans.
              <br /><span className="font-semibold text-gold">Go where the snow is.</span>&rdquo;
            </p>
          </blockquote>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-16 text-center">
            <p className="text-sm font-semibold tracking-wide text-gold uppercase">Why Resort Radar</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Everything you need, nothing you don&apos;t
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-gold"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" /><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
                title: "Real-Time Conditions",
                description: "Live snowfall, snow depth, temperature, and wind — pulled from Open-Meteo every 15 minutes for each resort.",
              },
              {
                icon: <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-gold"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
                title: "AI Resort Advisor",
                description: "Chat with our AI advisor. Tell it your skill level and it matches you to the best resort with the best conditions right now.",
              },
              {
                icon: <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-gold"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
                title: "Powder Alerts",
                description: "Set your thresholds, pick your resorts. Get notified the moment conditions line up — so you never miss a powder day.",
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-navy">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-foreground">{feature.title}</h3>
                <p className="mt-2 leading-relaxed text-foreground/50">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-navy py-20 lg:py-28">
        <div className="absolute inset-0 opacity-20">
          <Image src="https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=1920&q=80" alt="" fill className="object-cover" sizes="100vw" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            Stop scrolling weather apps.
            <br /><span className="text-gold">Start riding.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/60">
            Join thousands of skiers and riders who use Resort Radar to find the best conditions — every single day of the season.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {user ? (
              <Link href="/profile" className="rounded-full bg-gold px-8 py-3.5 text-base font-semibold text-navy transition hover:bg-gold-light">
                Set Up Your Profile
              </Link>
            ) : (
              <>
                <Link href="/signup" className="rounded-full bg-gold px-8 py-3.5 text-base font-semibold text-navy transition hover:bg-gold-light">
                  Create Your Account
                </Link>
                <Link href="/login" className="rounded-full border border-white/20 px-8 py-3.5 text-base font-semibold text-white transition hover:border-white/40 hover:bg-white/5">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2.5">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="text-navy">
                <path d="M16 3L4 27h24L16 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M10 20l6-7 6 7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
              <span className="text-lg font-semibold tracking-tight text-navy">Resort Radar</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-foreground/40">
              <a href="#" className="transition hover:text-foreground">About</a>
              <a href="#" className="transition hover:text-foreground">Privacy</a>
              <a href="#" className="transition hover:text-foreground">Terms</a>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-100 pt-6 text-center text-sm text-foreground/30">
            &copy; 2026 Resort Radar. Conditions powered by{" "}
            <a href="https://open-meteo.com" className="underline underline-offset-2 hover:text-foreground/60">
              Open-Meteo
            </a>. Map by{" "}
            <a href="https://carto.com" className="underline underline-offset-2 hover:text-foreground/60">CARTO</a>.
          </div>
        </div>
      </footer>

      <Chatbot />
    </main>
  );
}
