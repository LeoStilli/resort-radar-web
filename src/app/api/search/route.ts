import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export interface SearchFilter {
  state: string | null
  passFilter: string | null
  sort: string | null
  maxPrice: number | null
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null
  explanation: string | null
}

const SYSTEM_PROMPT = `You are a filter parser for a ski resort search engine. Given a natural language query, extract search parameters and return ONLY valid JSON — no markdown, no explanation, no code fences.

Available values:
- state: "CO", "WY", "UT", "CA", "MT", "VT" or null
- passFilter: "epic", "ikon", "mountain-collective" or null
- sort: "rating", "snow", "lifts", "price-asc", "price-desc" or null
- maxPrice: number (max daily lift ticket price in USD) or null
- difficulty: "beginner", "intermediate", "advanced", "expert" or null
- explanation: short human-readable summary of what you extracted (max 60 chars)

Pass mapping:
- "Epic Pass" or "Epic" → "epic"
- "Ikon Pass" or "Ikon" → "ikon"
- "Mountain Collective" or "MC" → "mountain-collective"

Difficulty mapping:
- "beginner", "easy", "green runs", "learning", "family-friendly" → "beginner"
- "intermediate", "blue runs", "comfortable" → "intermediate"
- "advanced", "black diamond", "challenging" → "advanced"
- "expert", "double black", "extreme", "steeps", "off-piste", "couloirs" → "expert"

Sort mapping:
- "best rated", "top rated", "highest rated" → "rating"
- "most snow", "best powder", "powder day", "fresh snow", "best conditions" → "snow"
- "most lifts open", "most open", "most runs open", "best access", "most terrain open" → "lifts"
- "cheapest", "budget", "affordable", "lowest price", "under $X" → "price-asc"
- "expensive", "luxury", "premium" → "price-desc"

Examples:
Query: "beginner friendly colorado under $170"
{"state":"CO","passFilter":null,"sort":"price-asc","maxPrice":170,"difficulty":"beginner","explanation":"Beginner-friendly CO resorts under $170/day"}

Query: "best powder in wyoming with epic pass"
{"state":"WY","passFilter":"epic","sort":"snow","maxPrice":null,"difficulty":null,"explanation":"Top powder in WY with Epic Pass"}

Query: "budget ski trip in utah"
{"state":"UT","passFilter":null,"sort":"price-asc","maxPrice":null,"difficulty":null,"explanation":"Budget-friendly UT resorts"}

Query: "expert terrain with ikon pass"
{"state":null,"passFilter":"ikon","sort":"rating","maxPrice":null,"difficulty":"expert","explanation":"Expert terrain with Ikon Pass coverage"}

Query: "luxury resort in colorado"
{"state":"CO","passFilter":null,"sort":"price-desc","maxPrice":null,"difficulty":null,"explanation":"Luxury CO resorts"}

If nothing relevant is found in the query, return all nulls with a short explanation.`

export async function POST(req: Request) {
  const { query } = (await req.json()) as { query: string }

  if (!query?.trim()) {
    return Response.json({ state: null, passFilter: null, sort: null, maxPrice: null, difficulty: null, explanation: null } satisfies SearchFilter)
  }

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 150,
      temperature: 0,
      stream: false,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: query.trim() },
      ],
    })

    const raw = completion.choices[0]?.message?.content?.trim() ?? ''

    // Strip any accidental markdown fences
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
    const parsed = JSON.parse(cleaned) as SearchFilter

    return Response.json(parsed)
  } catch {
    return Response.json({
      state: null,
      passFilter: null,
      sort: null,
      maxPrice: null,
      difficulty: null,
      explanation: null,
    } satisfies SearchFilter)
  }
}
