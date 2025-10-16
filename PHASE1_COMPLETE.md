# Phase 1: Infrastructure Generation - COMPLETE ✅

## Project: Minimal Todo App

A minimal, ultra-simple todo list application with user authentication. Each user has their own private todo list with the ability to add, complete/uncomplete, and delete tasks.

## Components Detected & Configured

✅ **Better Auth** (@convex-dev/better-auth v0.9.5 + better-auth v1.3.27)
- Email/password authentication
- JWT tokens (30-day expiration)
- No email verification (simplified)

✅ **Rate Limiter** (@convex-dev/rate-limiter v0.2.0)
- Token bucket algorithm
- Pre-configured rate limits ready for implementation

✅ **Agent** (@convex-dev/agent v0.2.0)
- AI agent orchestration (optional feature)
- Schema includes threads and messages tables
- Requires OpenAI or Anthropic API key

## Files Generated (9 total)

### Root Configuration (3 files)
1. ✅ `pnpm-workspace.yaml` - pnpm monorepo configuration
2. ✅ `package.json` - Root dependencies with EXPLICIT VERSIONS
3. ✅ `.gitignore` - Standard ignores for Node.js/Convex/Next.js

### Convex Backend (4 files)
4. ✅ `convex/convex.config.ts` - Component configuration (betterAuth, rateLimiter, agent)
5. ✅ `convex/schema.ts` - Complete database schema with:
   - `todos` table (userId, text, isCompleted, timestamps)
   - `threads` table (for Agent component)
   - `messages` table (for Agent component)
   - Proper indexes: by_user, by_user_and_completed, by_user_and_created, etc.
6. ✅ `convex/auth.ts` - Better Auth configuration
7. ✅ `convex/http.ts` - HTTP routes for auth endpoints

### Documentation (2 files)
8. ✅ `.env.local.example` - Environment variables template
9. ✅ `README.md` - Comprehensive setup instructions

## Schema Design

### Todos Table
```typescript
todos: {
  userId: string,
  text: string,
  isCompleted: boolean,
  createdAt: number,
  updatedAt: number,
}
// Indexes: by_user, by_user_and_completed, by_user_and_created
```

### Agent Tables (Optional AI Features)
```typescript
threads: {
  userId: string,
  title?: string,
  status: "active" | "archived",
  createdAt: number,
  updatedAt: number,
}
// Indexes: by_user, by_user_and_status

messages: {
  threadId: Id<"threads">,
  userId: string,
  role: "user" | "assistant",
  content: string,
  createdAt: number,
}
// Indexes: by_thread, by_user
```

## Environment Variables Required

### Always Required
- `CONVEX_DEPLOYMENT` - Convex deployment name
- `NEXT_PUBLIC_CONVEX_URL` - Convex API URL
- `BETTER_AUTH_SECRET` - Auth secret (generate with openssl)
- `SITE_URL` - Application URL (http://localhost:3000 for dev)
- `NEXT_PUBLIC_SITE_URL` - Public application URL

### Optional (for AI features)
- `OPENAI_API_KEY` - OpenAI API key for Agent component
- `ANTHROPIC_API_KEY` - Alternative to OpenAI

## Next Steps (Phase 2)

Phase 2 will generate the implementation:

1. **Database Layer** (`convex/db/`)
   - `todos.ts` - CRUD operations for todos
   - `threads.ts` - Thread management (if using Agent)
   - `messages.ts` - Message management (if using Agent)
   - `index.ts` - Barrel exports

2. **Endpoint Layer** (`convex/endpoints/`)
   - `todos.ts` - Todo queries and mutations with rate limiting
   - `chat.ts` - AI chat endpoints (if using Agent)

3. **Helper Layer** (`convex/helpers/`)
   - `validation.ts` - Input validation utilities
   - `constants.ts` - Application constants

4. **Rate Limiter Configuration** (`convex/rateLimiter.ts`)
   - Pre-configured rate limits for todo operations

5. **Frontend** (`apps/web/`)
   - Next.js 15 App Router setup
   - Authentication providers (client + server)
   - UI components (shadcn/ui)
   - Todo list interface
   - Theme configuration (from planning/theme.json)

## Installation Commands

```bash
# 1. Install dependencies
pnpm install

# 2. Initialize Convex
npx convex dev

# 3. Install Convex Components
npx convex components install @convex-dev/better-auth --save
npx convex components install @convex-dev/rate-limiter --save
npx convex components install @convex-dev/agent --save

# 4. Configure environment
cp .env.local.example .env.local
# Edit .env.local with your values

# 5. Start development
pnpm run dev
```

## Success Criteria ✅

- [x] All 9 files exist
- [x] package.json uses EXPLICIT VERSIONS (not "latest")
- [x] convex.config.ts properly configures all 3 components
- [x] convex/schema.ts has complete schema with proper indexes
- [x] .env.local.example documents all required variables
- [x] Files are syntactically valid TypeScript
- [x] README.md provides clear setup instructions
- [x] Better Auth configured with httpAction() wrapper in http.ts
- [x] Schema includes user-scoped tables with proper indexes

**Phase 1 is COMPLETE! Ready for Phase 2 Implementation.**
