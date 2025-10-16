import { defineApp } from "convex/server";
import betterAuth from "@convex-dev/better-auth/convex.config";
import rateLimiter from "@convex-dev/rate-limiter/convex.config";
import agent from "@convex-dev/agent/convex.config";

const app = defineApp();

// Better Auth MUST be first
app.use(betterAuth);

// Rate Limiter for API protection
app.use(rateLimiter);

// Agent for AI features (if needed)
app.use(agent);

export default app;
