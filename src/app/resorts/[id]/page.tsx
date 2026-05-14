import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { RESORTS, fetchResortWeather, getOpenStats } from "@/lib/resorts";
import { verifySessionToken } from "@/lib/auth";
import { getResortReviews, hasUserReviewed } from "@/lib/reviews";
import { getResortLikeCount, findUserById } from "@/lib/users";
import { toggleLike } from "@/lib/actions/likes";
import { submitReview } from "@/lib/actions/reviews";
import { Nav } from "@/components/Nav";
import { Chatbot } from "@/components/Chatbot";
import { LikeButton } from "./_components/LikeButton";
import { ReviewForm } from "./_components/ReviewForm";
import { TrailMap } from "./_components/TrailMap";

function StarRow({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "lg" ? "h-6 w-6" : size === "md" ? "h-5 w-5" : "h-4 w-4";
  const filled = Math.round(rating);
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          viewBox="0 0 20 20"
          className={`${sizeClass} ${star <= filled ? "fill-gold text-gold" : "fill-white/15 text-white/15"}`}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default async function ResortPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const resort = RESORTS.find((r) => r.id === id);
  if (!resort) notFound();

  const [weather, jar] = await Promise.all([
    fetchResortWeather(resort.lat, resort.lon),
    cookies(),
  ]);

  const token = jar.get("session")?.value;
  const session = token ? verifySessionToken(token) : null;

  const reviews = getResortReviews(id);
  const likeCount = await getResortLikeCount(id);

  let initialLiked = false;
  let userHasReviewed = false;
  let userPasses: string[] = [];

  if (session) {
    const user = await findUserById(session.userId);
    initialLiked = user?.likedResorts?.includes(id) ?? false;
    userHasReviewed = hasUserReviewed(id, session.userId);
    userPasses = user?.skiPasses ?? [];
  }

  const coveredByPasses = resort.passes.filter((p) => userPasses.includes(p.passId));

  const { openRuns, isOpen, isEstimate } = getOpenStats(resort.trails, weather)
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : null;

  const boundToggle = session ? toggleLike.bind(null, id) : null;
  const boundSubmit = submitReview.bind(null, id);

  const starCounts = [5, 4, 3, 2, 1].map((n) => ({
    star: n,
    count: reviews.filter((r) => r.rating === n).length,
  }));

  return (
    <main className="min-h-screen bg-navy">
      <Nav user={session} />

      {/* ── Hero ── */}
      <section className="relative h-[68vh] min-h-[520px] overflow-hidden">
        <Image
          src={resort.image}
          alt={resort.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-b from-navy/40 via-navy/10 to-navy" />

        {/* Breadcrumb — pushed below the fixed nav (~64 px) */}
        <div className="absolute left-6 top-20 z-10 md:left-10">
          <Link
            href="/resorts"
            className="flex items-center gap-2 rounded-full bg-navy/60 px-4 py-2 text-sm text-white/70 backdrop-blur-sm transition hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path
                d="M19 12H5M12 5l-7 7 7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            All Resorts
          </Link>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 md:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold ring-1 ring-gold/30">
                    {resort.region}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 backdrop-blur-sm">
                    {resort.state}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isOpen
                        ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30"
                        : "bg-red-500/20 text-red-300 ring-1 ring-red-500/30"
                    }`}
                  >
                    {isOpen ? "● Open" : "● Closed"}
                  </span>
                  {coveredByPasses.length > 0 && (
                    <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold ring-1 ring-gold/30">
                      ✓ Pass Covered
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-md md:text-6xl">
                  {resort.name}
                </h1>
                <p className="mt-2 text-lg text-white/60">{resort.location}</p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-navy/60 px-5 py-3 backdrop-blur-sm">
                <StarRow rating={resort.rating} size="lg" />
                <span className="text-2xl font-bold text-white">{resort.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pass Coverage Banner ── */}
      {coveredByPasses.length > 0 && (
        <section className="border-b border-emerald-500/20 bg-emerald-500/10">
          <div className="mx-auto max-w-7xl px-6 py-4 lg:px-10">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0 text-emerald-400">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-bold text-emerald-300">You can ski here with your pass</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {coveredByPasses.map((p) => (
                  <div key={p.passId} className="flex items-center gap-2 rounded-xl bg-emerald-500/15 px-4 py-1.5 ring-1 ring-emerald-500/30">
                    <span className="text-sm font-semibold text-white">{p.passName}</span>
                    <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-xs font-bold text-emerald-300">
                      {p.access}
                    </span>
                    {p.blackouts && (
                      <span className="text-xs text-emerald-400/50">· holiday blackouts apply</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Live Conditions Bar ── */}
      {weather && (
        <section className="border-b border-white/10 bg-navy-light">
          <div className="mx-auto max-w-7xl px-6 py-5 lg:px-10">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30">Condition</p>
                <p className="mt-0.5 text-sm font-semibold text-white">
                  {weather.overallCondition ?? weather.condition}
                </p>
                {weather.overallCondition && (
                  <p className="text-[10px] text-white/30">{weather.condition}</p>
                )}
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30">Temperature</p>
                <p className="mt-0.5 text-sm font-semibold text-white">
                  {weather.tempF}°F
                  <span className="ml-1.5 text-xs font-normal text-white/40">
                    feels {weather.feelsLikeF}°
                  </span>
                </p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30">Snow Depth</p>
                <p className="mt-0.5 text-sm font-semibold text-white">
                  {weather.snowDepthFt > 0 ? `${weather.snowDepthFt} ft` : "—"}
                </p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30">New Today</p>
                <p className="mt-0.5 text-sm font-semibold text-white">
                  {weather.snowfallTodayIn > 0 ? `${weather.snowfallTodayIn}"` : "—"}
                </p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30">48h Snow</p>
                <p className="mt-0.5 text-sm font-semibold text-white">
                  {weather.snowfall48hIn > 0 ? `${weather.snowfall48hIn}"` : "—"}
                </p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30">72h Snow</p>
                <p className="mt-0.5 text-sm font-semibold text-white">
                  {weather.snowfall72hIn > 0 ? `${weather.snowfall72hIn}"` : "—"}
                </p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30">Wind</p>
                <p className="mt-0.5 text-sm font-semibold text-white">
                  {weather.windMph} mph
                  <span className="ml-1.5 text-xs font-normal text-white/40">
                    gusts {weather.windGustsMph}
                  </span>
                </p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30">Runs Open</p>
                <p className="mt-0.5 text-sm font-semibold text-white">
                  {openRuns} / {weather.runsTotal ?? resort.trails}
                  {isEstimate && (
                    <span className="ml-1.5 text-[10px] font-normal text-white/25">est.</span>
                  )}
                </p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30">Lifts Open</p>
                <p className="mt-0.5 text-sm font-semibold text-white">
                  {weather.liftsOpen !== null
                    ? `${weather.liftsOpen} / ${weather.liftsTotal ?? resort.totalLifts}`
                    : '—'}
                </p>
              </div>
              <div className="ml-auto hidden text-xs text-white/20 sm:block">
                Updated {weather.updatedAt}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Mountain Snow Depths ── */}
      {weather && (weather.snowDepthTopFt !== null || weather.snowDepthMidFt !== null) && (
        <section className="border-b border-white/10 bg-navy-light/30">
          <div className="mx-auto max-w-7xl px-6 py-4 lg:px-10">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <p className="text-[10px] uppercase tracking-widest text-white/25">Snow Depth by Elevation</p>
              {weather.snowDepthTopFt !== null && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wide text-white/30">Summit</span>
                  <span className="text-sm font-semibold text-white">{weather.snowDepthTopFt} ft</span>
                </div>
              )}
              {weather.snowDepthMidFt !== null && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wide text-white/30">Mid</span>
                  <span className="text-sm font-semibold text-white">{weather.snowDepthMidFt} ft</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wide text-white/30">Base</span>
                <span className="text-sm font-semibold text-white">
                  {weather.snowDepthFt > 0 ? `${weather.snowDepthFt} ft` : '—'}
                </span>
              </div>
              {weather.overallCondition && (
                <span className="rounded-full bg-sky-500/15 px-3 py-0.5 text-xs font-semibold text-sky-300 ring-1 ring-sky-500/25">
                  {weather.overallCondition}
                </span>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── 7-Day Snowfall Outlook ── */}
      {weather && weather.forecast.length > 0 && (
        <section className="border-b border-white/10 bg-navy-light/50">
          <div className="mx-auto max-w-7xl px-6 py-6 lg:px-10">
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <p className="text-[10px] uppercase tracking-widest text-white/30">7-Day Snowfall Outlook</p>
              {weather.snowfall7dIn > 0 && (
                <span className="text-xs text-sky-400">
                  {weather.snowfall7dIn}" forecast total
                </span>
              )}
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {weather.forecast.map((day) => {
                const label = new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'numeric',
                  day: 'numeric'
                })
                const hasSnow = day.snowfallIn > 0
                return (
                  <div
                    key={day.date}
                    className={`flex min-w-[90px] shrink-0 flex-col items-center gap-1.5 rounded-2xl px-3 py-3.5 text-center ring-1 transition ${
                      hasSnow
                        ? 'bg-sky-500/10 ring-sky-500/25'
                        : 'bg-white/5 ring-white/8'
                    }`}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-white/40">
                      {label}
                    </p>
                    {hasSnow ? (
                      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-sky-400" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v20M12 2l-3 3m3-3l3 3M12 22l-3-3m3 3l3-3M2 12h20M2 12l3-3m-3 3l3 3M22 12l-3-3m3 3l-3 3M5.636 5.636l12.728 12.728M5.636 5.636l1.06 4.243m-1.06-4.243l4.243 1.06M18.364 18.364l-1.06-4.243m1.06 4.243l-4.243-1.06M18.364 5.636L5.636 18.364M18.364 5.636l-4.243 1.06m4.243-1.06l-1.06 4.243M5.636 18.364l4.243-1.06m-4.243 1.06l1.06-4.243" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white/20" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" />
                      </svg>
                    )}
                    <p className={`text-xs font-bold ${hasSnow ? 'text-sky-300' : 'text-white/25'}`}>
                      {hasSnow ? `${day.snowfallIn}"` : '—'}
                    </p>
                    <p className="text-[10px] text-white/30 leading-tight">{day.condition}</p>
                    <p className="text-[10px] text-white/40">{day.highF}° / {day.lowF}°</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Main Content ── */}
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px]">

          {/* Left column */}
          <div className="space-y-12">

            {/* About */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-white">About {resort.name}</h2>
              <p className="leading-relaxed text-white/60">{resort.description}</p>
            </section>

            {/* Stats grid */}
            <section>
              <h2 className="mb-5 text-2xl font-bold text-white">Mountain Stats</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  {
                    label: weather && !isEstimate ? "Runs Open" : "Total Runs",
                    value: weather && !isEstimate
                      ? `${openRuns} / ${weather.runsTotal ?? resort.trails}`
                      : resort.trails.toString(),
                  },
                  {
                    label: weather?.liftsOpen != null ? "Lifts Open" : "Total Lifts",
                    value: weather?.liftsOpen != null
                      ? `${weather.liftsOpen} / ${weather.liftsTotal ?? resort.totalLifts}`
                      : resort.totalLifts.toString(),
                  },
                  { label: "Vertical Drop", value: resort.vertical },
                  { label: "Avg Ticket", value: `$${resort.avgTicketPrice}` },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl bg-white/5 p-5 text-center ring-1 ring-white/10"
                  >
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="mt-1.5 text-xs text-white/35">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Terrain & difficulty */}
            <section>
              <h2 className="mb-5 text-2xl font-bold text-white">Terrain</h2>
              <div className="space-y-3.5">
                {[
                  { label: "Green — Beginner", pct: resort.difficulty.green, color: "bg-emerald-400" },
                  { label: "Blue — Intermediate", pct: resort.difficulty.blue, color: "bg-sky-400" },
                  { label: "Black — Expert", pct: resort.difficulty.black, color: "bg-white/60" },
                ].map((d) => (
                  <div key={d.label}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="text-white/55">{d.label}</span>
                      <span className="font-semibold text-white">{d.pct}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full transition-all ${d.color}`}
                        style={{ width: `${d.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {resort.terrain.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-white/8 px-3.5 py-1.5 text-sm text-white/55 ring-1 ring-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>

            {/* Trail Map */}
            {resort.trailMap && (
              <section>
                <h2 className="mb-5 text-2xl font-bold text-white">Trail Map</h2>
                <TrailMap src={resort.trailMap} resortName={resort.name} />
                <p className="mt-3 text-xs text-white/25">
                  Click the map to view full size. Trail map provided by {resort.name}.
                </p>
              </section>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {resort.passes.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                  Accepted Passes
                </p>
                <div className="space-y-2.5">
                  {resort.passes.map((p) => {
                    const owned = userPasses.includes(p.passId);
                    return (
                      <div
                        key={p.passId}
                        className={`flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 ring-1 transition ${
                          owned
                            ? "bg-emerald-500/10 ring-emerald-500/30"
                            : "bg-white/5 ring-white/8"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {owned ? (
                            <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 shrink-0 text-emerald-400">
                              <path fillRule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zm3.707-9.293a1 1 0 00-1.414-1.414L5 8.586 3.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4 shrink-0 text-white/25">
                              <rect x="2" y="2" width="12" height="12" rx="6" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                          )}
                          <div>
                            <p className={`text-sm font-semibold ${owned ? "text-emerald-300" : "text-white/60"}`}>
                              {p.passName}
                            </p>
                            {p.blackouts && (
                              <p className="text-[11px] text-white/30">Holiday blackouts</p>
                            )}
                          </div>
                        </div>
                        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${owned ? "bg-emerald-400/15 text-emerald-300" : "bg-white/8 text-white/40"}`}>
                          {p.access}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {userPasses.length === 0 && (
                  <p className="mt-3 text-[11px] text-white/25">
                    Add your passes in{" "}
                    <a href="/profile" className="underline hover:text-white/50">
                      your profile
                    </a>{" "}
                    to see which apply to you.
                  </p>
                )}
              </div>
            )}

            <LikeButton
              toggleAction={boundToggle}
              initialLiked={initialLiked}
              initialCount={likeCount}
            />

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="mb-1 text-[10px] uppercase tracking-widest text-white/30">
                Average Ticket Price
              </p>
              <p className="text-4xl font-bold text-gold">${resort.avgTicketPrice}</p>
              <p className="mt-1 text-xs text-white/25">per day · prices vary</p>
              <div className="mt-3 flex gap-0.5">
                {[1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={`text-xl font-bold ${i <= resort.priceLevel ? "text-gold" : "text-white/15"}`}
                  >
                    $
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="mb-4 text-[10px] uppercase tracking-widest text-white/30">Quick Facts</p>
              <div className="space-y-3">
                {[
                  { label: "Region", value: resort.region },
                  { label: "State", value: resort.state },
                  { label: "Total Trails", value: (weather?.runsTotal ?? resort.trails).toString() },
                  { label: "Total Lifts", value: (weather?.liftsTotal ?? resort.totalLifts).toString() },
                  { label: "Vertical Drop", value: resort.vertical },
                ].map((fact) => (
                  <div key={fact.label} className="flex items-center justify-between">
                    <span className="text-sm text-white/35">{fact.label}</span>
                    <span className="text-sm font-medium text-white">{fact.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Hotels ── */}
      <section className="border-t border-white/10 bg-navy-light py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-gold">Where to Stay</p>
          <h2 className="mt-2 mb-10 text-3xl font-bold text-white">Nearby Hotels</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resort.hotels.map((hotel) => (
              <div
                key={hotel.name}
                className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-gold/20 hover:bg-white/8"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-white">{hotel.name}</h3>
                    <div className="mt-1 flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          viewBox="0 0 20 20"
                          className={`h-3.5 w-3.5 ${i < hotel.stars ? "fill-gold" : "fill-white/15"}`}
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xl font-bold text-gold">${hotel.pricePerNight}</p>
                    <p className="text-xs text-white/30">/ night</p>
                  </div>
                </div>
                <p className="mb-4 text-sm text-white/40">
                  {hotel.distanceMiles <= 0.1
                    ? "Ski-in / Ski-out"
                    : `${hotel.distanceMiles} mi from lifts`}
                </p>
                <div className="mt-auto flex flex-wrap gap-1.5">
                  {hotel.amenities.map((a) => (
                    <span
                      key={a}
                      className="rounded-full bg-white/8 px-2.5 py-0.5 text-xs text-white/45"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-white/20">
            Hotel listings are for informational purposes only and are not bookable through Resort Radar.
          </p>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">

          {/* Header */}
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gold">Community</p>
              <h2 className="mt-2 text-3xl font-bold text-white">Reviews</h2>
            </div>
            {avgRating !== null && (
              <div className="flex items-center gap-4 rounded-2xl bg-white/5 px-6 py-4 ring-1 ring-white/10">
                <span className="text-5xl font-bold text-white">{avgRating.toFixed(1)}</span>
                <div>
                  <StarRow rating={avgRating} size="md" />
                  <p className="mt-1 text-xs text-white/35">
                    {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Star distribution */}
          {reviews.length > 0 && (
            <div className="mb-10 max-w-xs space-y-2">
              {starCounts.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="w-3 text-right text-xs text-white/35">{star}</span>
                  <svg viewBox="0 0 20 20" className="h-3 w-3 shrink-0 fill-gold">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gold"
                      style={{ width: `${(count / reviews.length) * 100}%` }}
                    />
                  </div>
                  <span className="w-4 text-xs text-white/25">{count}</span>
                </div>
              ))}
            </div>
          )}

          {/* Review list */}
          {reviews.length > 0 ? (
            <div className="mb-14 space-y-5">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-sm font-bold text-gold ring-1 ring-gold/20">
                        {review.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{review.userName}</p>
                        <p className="text-xs text-white/30">
                          {new Date(review.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <StarRow rating={review.rating} />
                  </div>
                  <p className="text-sm leading-relaxed text-white/60">{review.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-14 rounded-2xl border border-white/8 bg-white/3 py-16 text-center">
              <p className="text-white/35">No reviews yet — be the first to share your experience!</p>
            </div>
          )}

          {/* Submit review */}
          <div className="max-w-xl">
            <h3 className="mb-6 text-xl font-semibold text-white">Leave a Review</h3>
            {session ? (
              userHasReviewed ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                  <p className="text-white/40">You&apos;ve already reviewed this resort.</p>
                </div>
              ) : (
                <ReviewForm submitAction={boundSubmit} />
              )
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                <p className="mb-5 text-white/55">Sign in to share your experience</p>
                <Link
                  href="/login"
                  className="inline-block rounded-full bg-gold px-7 py-2.5 text-sm font-semibold text-navy transition hover:bg-amber-400"
                >
                  Sign In to Review
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <Chatbot />
    </main>
  );
}
