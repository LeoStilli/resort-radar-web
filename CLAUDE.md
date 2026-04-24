# CLAUDE.md — Resort Radar

This file is the source of truth for how code is written in this project. Every rule here applies. Do not use your defaults. Use mine.

---

## 1. Formatting

These rules are non-negotiable and apply to every TypeScript/JavaScript file.

- **Indentation**: 2 spaces. Never tabs.
- **Quotes**: Single quotes only. `'hello'` not `"hello"`.
- **Semicolons**: None. Do not add semicolons at the end of lines.
- **Trailing commas**: None.
- **Bracket spacing**: Yes. `{ key: value }` not `{key: value}`.
- **Arrow functions**: Always use parens around single params. `(x) => x` not `x => x`.

The `.prettierrc` for every frontend project:

```json
{
  "tabWidth": 2,
  "useTabs": false,
  "singleQuote": true,
  "trailingComma": "none",
  "semi": false,
  "bracketSpacing": true,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

---

## 2. Stack

This is what I use. Do not suggest or introduce anything outside this stack without asking me first.

**Frontend**
- TypeScript (strict mode, no `any`)
- Next.js with App Router
- Tailwind CSS for all styling
- `npm` as the package manager

**Backend**
- Go for all APIs and services
- `gorilla/mux` for routing
- PostgreSQL or MariaDB for databases
- `rs/cors` for CORS middleware
- Docker + `docker-compose.yml` for every backend service

**TypeScript config** — always use strict mode and the `@/*` path alias:

```json
{
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 3. Next.js Project Structure

This is the only acceptable folder layout for a Next.js project. Do not deviate.

```
my-project/
├── src/
│   ├── app/                  # Routing ONLY — page.tsx, layout.tsx, loading.tsx, error.tsx
│   │   ├── (route-group)/    # Use route groups with parentheses to organize routes
│   │   ├── some-page/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/           # Reusable UI components only — no data fetching, no business logic
│   └── lib/                  # Everything else: utilities, helpers, types, server actions, API calls
│       ├── actions/          # Server actions go HERE — never at the project root
│       ├── types/            # TypeScript interfaces and types
│       └── utils/            # Helper functions
├── public/                   # Static assets
├── .gitignore
├── .prettierrc
├── next.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

### Hard rules — violations Aiden specifically called out:

- `actions/` **NEVER** goes at the project root. It lives at `src/lib/actions/`. Full stop.
- `app/` contains **only** routing files: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`. Nothing else.
- Do **not** put utility functions, helpers, types, or shared logic anywhere inside `app/`. That is what `lib/` is for.
- Do **not** create a `utils/` or `helpers/` folder at the root level. It goes inside `src/lib/`.
- Do **not** create a `hooks/` folder at the root level. It goes inside `src/lib/hooks/`.
- `components/` is for reusable UI only. If a component is only used on one page, put it in a `_components/` subfolder inside that page's route folder instead.

---

## 4. Go Project Structure

Taken directly from Aiden's `openbucket-go` and `SentimentScraperAPI`. This is the pattern.

```
my-api/
├── main.go                   # Entry point — server setup, router registration, startup logging only
├── routers/                  # One file per route group (e.g. handleBucket.go, handleUpload.go)
├── handler/                  # Business logic called by routers — keeps routers thin
├── middleware/               # HTTP middleware: logging, auth, request state
├── db/                       # Database connection, PingDB(), RunMigrations(), query helpers
├── types/                    # All Go structs and type definitions (NOT named "structs")
├── responder/                # Standardized JSON/XML response helpers
├── env/                      # Environment variable loading
├── tools/                    # Shared utility functions
├── util/                     # Additional utilities if needed
├── background/               # Background workers and scheduled jobs (goroutines)
├── state/                    # In-memory state, caches
├── auth/                     # Authentication logic
├── .gitignore
├── .vscode/
├── Dockerfile
├── docker-compose.yml
├── go.mod
├── go.sum
├── Makefile
└── README.md
```

### Hard rules:

- `main.go` does three things only: connect to DB, register routes, start the server. No business logic in `main.go`.
- Route handlers in `routers/` are thin — they parse the request and call into `handler/`. They do not contain business logic themselves.
- Every function that can fail must handle its error. No ignored errors.
- Startup logs use ✅ for success and ❌ for failure. Example: `log.Println("✅ Database connection established")` and `log.Fatalf("❌ Failed to connect to database: %v", err)`.

---

## 5. Naming Conventions

### Files
- Next.js route folders: `kebab-case`. Example: `app/user-profile/page.tsx`, `app/resort-detail/page.tsx`
- React component files: `PascalCase.tsx`. Example: `UserCard.tsx`, `NavBar.tsx`, `ResortCard.tsx`
- TypeScript utility/helper files: `camelCase.ts`. Example: `fetchResorts.ts`, `formatDate.ts`
- Go files: `camelCase.go`. Example: `handleBucket.go`, `loggingMiddleware.go`, `pingDB.go`

### Variables & Functions
- TypeScript: `camelCase` for all variables and functions
- TypeScript: `PascalCase` for React components and TypeScript interfaces/types
- Go exported: `PascalCase`. Example: `PingDB()`, `HandleBucket()`, `RunMigrations()`
- Go unexported: `camelCase`. Example: `parseRequest()`, `buildQuery()`

### Interfaces & Types (TypeScript)
- Use `interface` for object shapes, `type` for unions and aliases
- No `I` prefix. `UserProps` not `IUserProps`. `Resort` not `IResort`.
- Define props interfaces directly above the component they belong to, not in a separate file unless shared across multiple components

### CSS / Tailwind
- Tailwind utility classes inline on the element — no custom class names unless Tailwind can't do it
- If a custom class is needed: `kebab-case`. `.resort-card` not `.resortCard`
- No inline `style={{}}` props. Ever. Use Tailwind.

### Routes & URLs
- Always `kebab-case`. `/user-profile`, `/resort-detail`, `/core/v1/trending`

---

## 6. TypeScript / React Code Style

- **Functional components only.** No class components.
- **Default exports for page components** (`page.tsx`, `layout.tsx`). **Named exports for everything else** — components, utilities, types.
- **Props interface defined directly above the component** that uses it.
- **No `any`.** Use `unknown` and narrow it if you don't know the type yet.
- **Explicit return types** on non-trivial functions.
- **Early returns** to reduce nesting. Fail fast at the top of a function, then proceed with the happy path.
- **No barrel `index.ts` files** unless I specifically ask for them. Keep imports direct and explicit.
- **Import order**: 1) external packages, 2) internal `@/` imports, 3) relative imports. Blank line between each group.

Correct component structure example:

```tsx
import { SomeLib } from 'some-lib'

import { ResortCard } from '@/components/ResortCard'
import { fetchResorts } from '@/lib/utils/fetchResorts'

interface PageProps {
  params: { id: string }
}

export default function ResortPage({ params }: PageProps) {
  return (
    <main className='flex flex-col gap-4 p-6'>
      <ResortCard id={params.id} />
    </main>
  )
}
```

---

## 7. Go Code Style

- **Import grouping**: stdlib → blank line → third-party → blank line → internal packages.
- **Error handling**: always inline with early returns. Never ignore errors silently.
- **Middleware**: applied at the router level with `r.Use()`, never inside individual handlers.
- **Route registration**: all routes defined in `main.go` — not scattered across files.
- **Auth middleware**: wrap handlers inline on the route definition. Example: `r.HandleFunc("/bucket", middleware.Authorized(routers.HandleBucket)).Methods(http.MethodGet)`
- **One handler file per route group** in `routers/`. File named after what it handles: `handleBucket.go`, `handleUpload.go`.
- **Struct JSON tags**: always include on any struct that gets serialized. Use `camelCase` for JSON key names.

Correct `main.go` structure:

```go
func main() {
    if err := db.PingDB(); err != nil {
        log.Fatalf("❌ Failed to connect to database: %v", err)
    }
    log.Println("✅ Database connection established")

    r := mux.NewRouter()
    r.Use(middleware.LoggingMiddleware)
    r.Use(middleware.RequestState)

    r.HandleFunc("/health", routers.HandleHealth).Methods(http.MethodGet)
    r.HandleFunc("/{bucket}", middleware.Authorized(routers.HandleBucket)).Methods(http.MethodGet)

    log.Println("✅ Server running on :" + env.Port)
    log.Fatal(http.ListenAndServe(":"+env.Port, r))
}
```

---

## 8. What Claude Must NEVER Do

These are specific mistakes from past projects. This list is not optional.

- **NEVER create `actions/` at the project root.** It belongs at `src/lib/actions/`. No exceptions.
- **NEVER put any logic, utilities, or shared code inside the `app/` folder.** Only routing files go there.
- **NEVER use double quotes in TypeScript/JavaScript.** Single quotes only.
- **NEVER add semicolons** to the end of lines in TypeScript/JavaScript.
- **NEVER use `any` as a type** in TypeScript.
- **NEVER create barrel `index.ts` files** unless explicitly asked.
- **NEVER use inline `style={{}}` in React.** Use Tailwind classes.
- **NEVER name Go type files `structs/`.** The folder is `types/`.
- **NEVER put business logic in `main.go`.** Setup and startup only.
- **NEVER silently ignore Go errors** with `_` unless there is a comment explaining exactly why.
- **NEVER create new top-level folders** in a Next.js project outside of `src/` and `public/`. If you think you need one, ask me first.
- **NEVER leave `console.log` in code.** Remove all debug logs before marking anything done.
- **NEVER mix default and named exports** inconsistently. Page components = default. Everything else = named.
- **NEVER install a new dependency** without telling me what it is and why it's needed.

---

## 9. Repo Setup — Every Project Starts With These

**Next.js project**
- `.gitignore`
- `.prettierrc` (exact config from section 1)
- `tsconfig.json` (strict, `@/*` alias pointing to `./src/*`)
- `next.config.ts`
- `.vscode/settings.json`
- `README.md`

**Go project**
- `.gitignore`
- `Dockerfile`
- `docker-compose.yml`
- `Makefile`
- `go.mod` / `go.sum`
- `.vscode/settings.json`
- `README.md`

---

## 10. How to Work With Me

- When you create a file or folder, tell me exactly what you made and where it lives.
- If a requirement is ambiguous, stop and ask before building it wrong.
- Do one thing at a time. If I ask you to add a feature, do not refactor unrelated code in the same step.
- If you think a rule in this file conflicts with what I'm asking, flag it — don't silently ignore the rule.

---

## 11. About This Project — Resort Radar

Resort Radar is a Next.js web app. This section describes what the project is and its current state so you have context before touching anything.

### What It Does
Resort Radar is a ski/snowboard resort discovery and tracking platform. Users can search and browse ski resorts, view conditions, and track their favorite mountains.

### Tech Stack
- Next.js (App Router) with TypeScript
- Tailwind CSS
- Frontend only — no Go backend in this repo

### Current Folder Structure (as of last audit)
The project currently has structural violations that need to be fixed to match the conventions in this file:

```
resort-radar-web/
├── actions/        ← WRONG — must move to src/lib/actions/
├── app/            ← WRONG — currently contains non-routing files
├── components/     ← needs to move inside src/
├── lib/            ← needs to move inside src/
├── public/
└── ...config files
```

The correct target structure is:

```
resort-radar-web/
├── src/
│   ├── app/              # Routing only — page.tsx, layout.tsx, etc.
│   ├── components/       # Reusable UI components
│   └── lib/
│       ├── actions/      # Server actions (moved from root actions/)
│       ├── types/        # TypeScript types and interfaces
│       └── utils/        # Helper functions
├── public/
└── ...config files
```

### Refactoring Instructions
When I ask you to fix the structure of this project, here is exactly what needs to happen:

1. Move `actions/` → `src/lib/actions/`
2. Move `components/` → `src/components/` (if not already inside src)
3. Move `lib/` → `src/lib/` (if not already inside src)
4. Ensure `app/` contains only routing files — move anything that isn't `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, or `globals.css` into the appropriate `src/lib/` subfolder
5. Update all import paths after moving files — use the `@/*` alias pointing to `src/`
6. Do not break anything. Verify imports resolve correctly after each move.