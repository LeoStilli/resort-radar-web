import Groq from "groq-sdk";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth";
import { findUserById } from "@/lib/users";
import { fetchAllResortWeather } from "@/lib/resorts";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  const { messages } = (await req.json()) as {
    messages: { role: "user" | "assistant"; content: string }[];
  };

  const jar = await cookies();
  const token = jar.get("session")?.value;
  const session = token ? verifySessionToken(token) : null;
  const user = session ? await findUserById(session.userId) : null;

  const resorts = await fetchAllResortWeather();

  const userPassIds = user?.skiPasses ?? [];

  const resortSummary = resorts
    .map((r) => {
      const w = r.weather;
      const passInfo = r.passes.length > 0
        ? ` Passes accepted: ${r.passes.map((p) => `${p.passName} (${p.access}${p.blackouts ? ", holiday blackouts" : ""})`).join(", ")}.`
        : "";
      const userCoverage = r.passes.filter((p) => userPassIds.includes(p.passId));
      const coverageInfo = userCoverage.length > 0
        ? ` USER CAN VISIT FREE with their ${userCoverage.map((p) => `${p.passName} (${p.access})`).join(" / ")}.`
        : "";
      if (!w) return `${r.name} (${r.location}): data unavailable.${passInfo}${coverageInfo}`
      const snowSummary =
        w.snowfall72hIn > 0
          ? `${w.snowfallTodayIn}" today / ${w.snowfall48hIn}" 48h / ${w.snowfall72hIn}" 72h`
          : `${w.snowfallTodayIn}" new today`
      const forecastSnow = w.snowfall7dIn > 0 ? ` ${w.snowfall7dIn}" more forecast next 7 days.` : ''
      const liftStatus = w.liftsOpen !== null
        ? ` ${w.liftsOpen}/${w.liftsTotal ?? r.totalLifts} lifts open, ${w.runsOpen ?? '?'}/${w.runsTotal ?? r.trails} runs open.`
        : ''
      const overallCond = w.overallCondition ? ` Overall: ${w.overallCondition}.` : ''
      return (
        `${r.name} (${r.location}): ${w.condition}, ` +
        `${w.tempF}°F (feels ${w.feelsLikeF}°F), snow depth ${w.snowDepthFt} ft, ` +
        `${snowSummary}, wind ${w.windMph} mph (gusts ${w.windGustsMph} mph).${forecastSnow}${liftStatus}${overallCond} ` +
        `${r.trails} total trails, ${r.vertical} vertical. ` +
        `Difficulty: ${r.difficulty.green}% green / ${r.difficulty.blue}% blue / ${r.difficulty.black}% black. ` +
        `Terrain: ${r.terrain.join(', ')}.${passInfo}${coverageInfo}`
      )
    })
    .join("\n");

  const userContext = user
    ? `\nThe user is ${user.name}.` +
      (user.skillLevel ? ` Skill level: ${user.skillLevel}.` : "") +
      (user.favoriteResorts?.length
        ? ` Favourite resorts: ${user.favoriteResorts.join(", ")}.`
        : "") +
      (userPassIds.length > 0
        ? ` Ski passes owned: ${userPassIds.join(", ")}. When recommending resorts, prioritise ones covered by their passes and mention the pass coverage explicitly.`
        : "")
    : "";

  const systemPrompt = `You are a knowledgeable, enthusiastic ski resort advisor for Resort Radar. Help users find the perfect resort based on their skill level, preferences, and real-time conditions.

IMPORTANT TOPIC RESTRICTIONS:
You MUST ONLY answer questions related to skiing, snowboarding, ski resorts, mountain conditions, winter sports, and snow activities.

If a user asks about anything else (politics, general conversation, other sports, technology, personal advice, etc.), you MUST politely decline and redirect them back to ski-related topics. Use this exact response format:

"I'm here to help you with skiing and resort-related questions only! I can assist with finding the perfect resort, checking current conditions, comparing mountains, or planning your ski trip. What would you like to know about skiing or snowboarding?"

CURRENT LIVE CONDITIONS (updated every 15 min):
${resortSummary}
${userContext}

Guidelines:
- Match skill level to terrain (beginner → greens/blues, intermediate → blues, advanced → blacks, expert → steeps/off-piste)
- Always cite specific current conditions when recommending
- Be concise: 2-4 sentences unless asked for detail
- Be enthusiastic and direct like a seasoned mountain guide
- NEVER answer questions outside of skiing/snowboarding/resort topics`;

  const stream = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    max_tokens: 512,
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    stream: true,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? "";
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
