/**
 * Rate Limiter Configuration
 *
 * Defines rate limits for all mutations to prevent abuse
 */

import { RateLimiter, MINUTE } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  // Todo operations - token bucket allows bursts
  createTodo: { kind: "token bucket", rate: 20, period: MINUTE, capacity: 5 },
  updateTodo: { kind: "token bucket", rate: 30, period: MINUTE, capacity: 10 },
  deleteTodo: { kind: "token bucket", rate: 20, period: MINUTE, capacity: 5 },

  // Thread operations - lower limits for AI features
  createThread: { kind: "token bucket", rate: 5, period: MINUTE, capacity: 2 },
  updateThread: { kind: "token bucket", rate: 10, period: MINUTE, capacity: 3 },
  deleteThread: { kind: "token bucket", rate: 5, period: MINUTE, capacity: 2 },

  // Message operations - moderate limits
  sendMessage: { kind: "token bucket", rate: 10, period: MINUTE, capacity: 3 },
  deleteMessage: { kind: "token bucket", rate: 10, period: MINUTE, capacity: 3 },
});
