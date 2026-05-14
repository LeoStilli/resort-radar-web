<!-- BEGIN:nextjs-agent-rules -->
# Agent Rules — Resort Radar

## Before Writing Any Code
- Read CLAUDE.md fully — it is the source of truth for this project
- Read the relevant guide in `node_modules/next/dist/docs/` before touching
  any Next.js-specific code — this version has breaking changes from training data
- Run `npm run build` before and after any changes to catch errors early

## File Structure Rules
- All source code lives in src/ — never create files at the root level
- All persistent data goes through Redis via src/lib/users.ts — never flat JSON
- Never create or modify files in data/ — that folder is deprecated
- New components go in src/components/
- New utilities go in src/lib/
- New pages go in src/app/

## Before Touching Auth
- Do not modify src/lib/auth.ts without explicit instruction
- Do not replace the custom HMAC session system with any third-party library
- Never move auth logic to the client side

## Before Touching the Chatbot
- The /api/chat route must always include a ski-focused system prompt
- Never remove the system prompt guardrails
- Keep streaming responses — never switch to blocking calls

## Git Rules
- Never commit .env.local
- Never commit users.json, reviews.json, or any file with real user data
- Never commit test-redis.js or any debug/scratch files
- Always check .gitignore before adding new data files

## When in Doubt
- Do not guess — read the docs in node_modules/next/dist/docs/ first
- Do not refactor working code unless explicitly asked
- Report what you find before making changes
<!-- END:nextjs-agent-rules -->