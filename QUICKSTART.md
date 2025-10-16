# Quick Start Guide

Get your Minimal Todo App running in 5 minutes!

## Step 1: Install Dependencies

```bash
pnpm install
```

## Step 2: Start Convex

```bash
npx convex dev
```

This will:
1. Prompt you to log in to Convex (or create an account)
2. Create a new Convex project
3. Generate `convex/_generated/` files
4. Give you your deployment URL

## Step 3: Set Up Environment Variables

Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

Fill in the required values:

```env
# From step 2 - copy from terminal output
CONVEX_DEPLOYMENT=dev:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Generate with: openssl rand -base64 32
BETTER_AUTH_SECRET=your-generated-secret-here

# For local development
SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Generate BETTER_AUTH_SECRET

```bash
openssl rand -base64 32
```

Copy the output and paste it as `BETTER_AUTH_SECRET` in `.env.local`.

## Step 4: Install Convex Components

Install the required Convex components:

```bash
npx convex components install @convex-dev/better-auth --save
npx convex components install @convex-dev/rate-limiter --save
npx convex components install @convex-dev/agent --save
```

## Step 5: Start the App

In a new terminal (keep `convex dev` running):

```bash
pnpm run web:dev
```

Or use the combined command:

```bash
pnpm run dev
```

## Step 6: Open Your Browser

Visit [http://localhost:3000](http://localhost:3000)

You should see the sign-up/sign-in form. Create an account and start adding todos! 🎉

## Troubleshooting

### "Not authenticated" errors

- Make sure you've signed up or signed in
- Check that `BETTER_AUTH_SECRET` is set in `.env.local`
- Verify `NEXT_PUBLIC_CONVEX_URL` matches your Convex deployment

### Components not found

- Run `npx convex components install` commands again
- Make sure `convex dev` is running
- Check that `convex.config.ts` has all three components configured

### Rate limit errors

- This means you're creating too many todos too quickly
- Wait a minute and try again
- Rate limits are configured in `convex/rateLimiter.ts`

### TypeScript errors

- Make sure you've run `npx convex dev` to generate types
- Restart your editor/IDE
- Run `pnpm install` again

## Next Steps

Now that your app is running:

1. **Try the features**: Create, complete, and delete todos
2. **Check real-time sync**: Open multiple browser tabs and see updates instantly
3. **Explore the code**: Start with `apps/web/components/todo-app.tsx`
4. **Customize the theme**: Edit `planning/theme.json` and regenerate tokens
5. **Add AI features**: Uncomment the agent code and add an OpenAI/Anthropic API key

## Architecture Overview

```
📁 convex/
├── db/              ← Database layer (ONLY place with ctx.db)
├── endpoints/       ← API endpoints (business logic)
├── helpers/         ← Pure utility functions
├── auth.ts          ← Better Auth configuration
├── http.ts          ← HTTP routes for auth
├── rateLimiter.ts   ← Rate limiting config
└── schema.ts        ← Database schema

📁 apps/web/
├── app/             ← Next.js App Router
├── components/      ← React components
└── lib/             ← Utilities

📁 packages/
├── components/      ← Shared UI components (shadcn/ui)
└── design-tokens/   ← Theme tokens
```

## Development Tips

- **Hot reload**: Both Convex and Next.js support hot reload
- **Schema changes**: Edit `convex/schema.ts` and Convex will auto-migrate
- **New endpoints**: Add files to `convex/endpoints/` and they're instantly available
- **Component library**: Use components from `@jn7ed9ecyrkk0hy21eehbbj6bx7sk268/components`

Happy coding! 🚀
