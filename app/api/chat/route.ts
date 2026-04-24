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
  const user = session ? findUserById(session.userId) : null;

  const resorts = await fetchAllResortWeather();

  const resortSummary = resorts
    .map((r) => {
      const w = r.weather;
      if (!w) return `${r.name} (${r.location}): data unavailable`;
      return (
        `${r.name} (${r.location}): ${w.condition}, ` +
        `${w.tempF}°F, snow depth ${w.snowDepthFt} ft, ` +
        `${w.snowfallTodayIn}" new snow today, wind ${w.windMph} mph. ` +
        `${r.trails} trails, ${r.vertical} vertical. ` +
        `Difficulty: ${r.difficulty.green}% green / ${r.difficulty.blue}% blue / ${r.difficulty.black}% black. ` +
        `Terrain: ${r.terrain.join(", ")}.`
      );
    })
    .join("\n");

  const userContext = user
    ? `\nThe user is ${user.name}.` +
      (user.skillLevel ? ` Skill level: ${user.skillLevel}.` : "") +
      (user.favoriteResorts?.length
        ? ` Favourite resorts: ${user.favoriteResorts.join(", ")}.`
        : "")
    : "";

  const systemPrompt = `You are a knowledgeable, enthusiastic ski resort advisor for Resort Radar. Help users find the perfect resort based on their skill level, preferences, and real-time conditions.

CURRENT LIVE CONDITIONS (updated every 15 min):
${resortSummary}
${userContext}

Guidelines:
- Match skill level to terrain (beginner → greens/blues, intermediate → blues, advanced → blacks, expert → steeps/off-piste)
- Always cite specific current conditions when recommending
- Be concise: 2-4 sentences unless asked for detail
- Be enthusiastic and direct like a seasoned mountain guide`;

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
