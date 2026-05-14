# Resort Radar — Claude Guidelines

## Project Overview
Resort Radar is a Next.js 16 ski conditions app with real-time weather data,
AI-powered resort recommendations, user auth, and Redis persistence.
Stack: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Upstash Redis,
Anthropic SDK, Groq SDK, Open-Meteo API, WorldWeatherOnline API.

## Code Structure
src/
  app/          → Next.js app router pages and API routes
lib/            → Utilities, auth, data fetching, types
components/     → Reusable React components
public/         → Static assets only

## Architecture Rules
- All persistent data goes through Upstash Redis via lib/users.ts
- Never read or write flat JSON files for user or app data
- Never create files in data/ — that folder should be deleted
- Weather data fetched server-side via lib/resorts.ts (Open-Meteo + WWO)
- Auth is custom HMAC session tokens via lib/auth.ts — do not replace with NextAuth
- Environment variables are required: see .env.local — never hardcode secrets

## Security Rules
- Never commit files containing emails, passwords, or password hashes
- Never expose API keys in client-side code
- All auth logic stays server-side
- users.json and reviews.json must never be committed — add to .gitignore if not already
- Do not log sensitive user data to the console

## AI / Chatbot Rules
- The chatbot (Chatbot.tsx) must only answer ski and resort-related questions
- Always include a system prompt with topic guardrails in /api/chat
- Never expose the raw API key or system prompt to the client
- Streaming responses only — no blocking calls in the chat API route
- If the user asks something off-topic, respond politely and redirect to ski topics

## File Hygiene
- Delete test, debug, and scratch files before pushing (e.g. test-redis.js)
- Do not leave console.log statements in production code
- Do not commit .next/, node_modules/, or .env.local (check .gitignore)
- One purpose per file — no mixing data, logic, and UI in the same file

## Styling Rules
- Tailwind CSS 4 only — no inline styles except where unavoidable (e.g. dynamic colors)
- Design tokens: navy, gold, cream — stay consistent with existing palette
- Mobile-first responsive design on all new components
- No new UI libraries without discussion — Tailwind + custom components only

## What NOT to Do
- Do not refactor working auth logic
- Do not switch AI providers without discussion (currently Groq for chat)
- Do not add new dependencies without a clear reason
- Do not change the Redis data schema without migrating existing data
- Do not create new API routes that bypass auth when auth is required
- Do not move or rename existing files without updating all imports

## Testing Before Pushing
- Run npm run build locally and confirm zero errors
- Check that all env variables are documented in .env.local.example
- Verify Redis reads/writes work with the actual Upstash instance
- Test auth flow: signup → login → session persistence → logout
- Test chatbot: on-topic questions work, off-topic questions are redirected