# Minimal Todo App

A minimal, ultra-simple todo list application with user authentication. Each user has their own private todo list with the ability to add, complete/uncomplete, and delete tasks. Built with real-time updates using Convex, modern authentication via Better Auth, and a clean UI using Next.js App Router, Tailwind CSS, and shadcn/ui components.

## Architecture Overview

This project follows the **Convex four-layer architecture pattern**:

1. **Database Layer** (`convex/db/`) - Pure CRUD operations, only place where `ctx.db` is used
2. **Endpoint Layer** (`convex/endpoints/`) - Business logic that composes database operations
3. **Workflow Layer** (`convex/workflows/`) - Durable external service integrations (if needed)
4. **Helper Layer** (`convex/helpers/`) - Pure utility functions with no database access

## Detected Components

This project uses the following Convex Components:

### Better Auth (@convex-dev/better-auth)
- **Purpose**: User authentication and session management
- **Usage**: Email/password authentication with JWT tokens
- **Configuration**: See `convex/auth.ts`

### Rate Limiter (@convex-dev/rate-limiter)
- **Purpose**: API rate limiting to prevent abuse
- **Usage**: Protects mutations from excessive requests
- **Configuration**: See `convex/rateLimiter.ts`

### Agent (@convex-dev/agent)
- **Purpose**: AI agent orchestration and multi-step reasoning (optional feature)
- **Usage**: Enables AI assistant capabilities if desired
- **Configuration**: Requires OpenAI or Anthropic API key

## Prerequisites

- Node.js 18+ and pnpm 8+
- Convex account (sign up at https://convex.dev)
- OpenAI or Anthropic API key (optional, for AI features)

## Installation

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Convex

```bash
# Initialize Convex project
npx convex dev

# This will:
# - Create a new Convex project (or link to existing)
# - Generate convex/_generated/ files
# - Start the Convex development server
```

### 3. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.local.example .env.local

# Edit .env.local and fill in the required values:
# 1. CONVEX_DEPLOYMENT - from `npx convex dev` output
# 2. NEXT_PUBLIC_CONVEX_URL - from Convex dashboard
# 3. BETTER_AUTH_SECRET - generate with: openssl rand -base64 32
# 4. SITE_URL - http://localhost:3000 for local development
# 5. OPENAI_API_KEY or ANTHROPIC_API_KEY - optional, for AI features
```

### 4. Install Convex Components

The components are already configured in `convex/convex.config.ts`, but you need to install them:

```bash
# Install Better Auth component
npx convex components install @convex-dev/better-auth --save

# Install Rate Limiter component
npx convex components install @convex-dev/rate-limiter --save

# Install Agent component
npx convex components install @convex-dev/agent --save
```

### 5. Start Development Servers

```bash
# Start both Convex and Next.js dev servers
pnpm run dev

# Or start them separately:
pnpm run convex:dev  # Convex backend
pnpm run web:dev     # Next.js frontend
```

The app will be available at http://localhost:3000

## Component-Specific Setup Notes

### Better Auth Setup

Better Auth is configured with:
- Email and password authentication
- No email verification required (for simplicity)
- JWT tokens with 30-day expiration
- Convex adapter for database storage

HTTP routes for authentication are configured in `convex/http.ts`.

### Rate Limiter Setup

Rate limiting is configured with token bucket algorithm:
- Create todo: 10 requests per minute, burst capacity of 3
- Update todo: 50 requests per minute
- Delete todo: 30 requests per minute

No additional configuration needed - works out of the box.

### Agent Setup (Optional)

To enable AI features:
1. Add `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` to `.env.local`
2. Implement AI features in your application code
3. The agent component handles conversation threads and messages

## Project Structure

```
minimal-todo-app/
├── convex/                      # Convex backend
│   ├── schema.ts                # Database schema
│   ├── convex.config.ts         # Component configuration
│   ├── auth.ts                  # Better Auth setup
│   ├── http.ts                  # HTTP routes (auth endpoints)
│   ├── db/                      # Database layer (Phase 2)
│   ├── endpoints/               # API endpoints (Phase 2)
│   └── helpers/                 # Utility functions (Phase 2)
├── apps/
│   └── web/                     # Next.js frontend (Phase 2)
├── package.json                 # Root package.json
├── pnpm-workspace.yaml          # pnpm workspace config
└── README.md                    # This file
```

## Features

✅ **User Authentication**
- Sign up with email and password
- Sign in with existing account
- Secure session management with JWT tokens
- Automatic authentication state management

✅ **Todo Management**
- Create new todos with real-time updates
- Mark todos as complete/incomplete
- Delete todos
- Filter by all/active/completed
- View todo statistics (total, active, completed)

✅ **Real-time Updates**
- Powered by Convex reactive queries
- Instant updates across all clients
- No manual refresh needed

✅ **Rate Limiting**
- Protection against API abuse
- Token bucket algorithm
- User-scoped rate limits

✅ **Clean, Modern UI**
- Responsive design (mobile-first)
- Smooth animations and transitions
- Accessible components
- Beautiful indigo color scheme

## Design System

This project uses a custom theme based on:
- **Tone**: Neutral
- **Density**: Balanced
- **Primary Color**: #6366f1 (Indigo)
- **Font**: Inter, 'Inter Variable'
- **UI Library**: shadcn/ui with Radix UI primitives

See `planning/theme.json` for complete design tokens.

## Learn More

- [Convex Documentation](https://docs.convex.dev)
- [Better Auth Documentation](https://better-auth.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Components](https://docs.convex.dev/components)
