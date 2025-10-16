/**
 * Endpoint Layer: Threads
 *
 * Business logic for AI conversation threads.
 * Composes database operations from the db layer.
 * Handles authentication and authorization.
 */

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";
import { rateLimiter } from "../rateLimiter";
import * as Threads from "../db/threads";
import * as Messages from "../db/messages";
import { isValidThreadTitle, isValidMessageContent, sanitizeText } from "../helpers/validation";

/**
 * List all threads for the authenticated user
 */
export const list = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await Threads.getThreadsByUser(ctx, authUser._id);
  },
});

/**
 * List threads by status
 */
export const listByStatus = query({
  args: {
    status: v.union(v.literal("active"), v.literal("archived")),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await Threads.getThreadsByUserAndStatus(ctx, authUser._id, args.status);
  },
});

/**
 * Get thread with messages
 */
export const getWithMessages = query({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    const thread = await Threads.getThreadById(ctx, args.threadId);
    if (!thread) {
      throw new Error("Thread not found");
    }
    if (thread.userId !== authUser._id) {
      throw new Error("Not authorized to view this thread");
    }

    const messages = await Messages.getMessagesByThread(ctx, args.threadId);

    return {
      thread,
      messages,
    };
  },
});

/**
 * Create a new thread
 */
export const create = mutation({
  args: {
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Rate limiting
    const status = await rateLimiter.limit(ctx, "createThread", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(`Rate limit exceeded. Retry after ${status.retryAfter}ms`);
    }

    // Validation
    let sanitizedTitle: string | undefined = undefined;
    if (args.title) {
      sanitizedTitle = sanitizeText(args.title);
      if (!isValidThreadTitle(sanitizedTitle)) {
        throw new Error("Invalid thread title. Must be 1-200 characters.");
      }
    }

    // Create thread
    return await Threads.createThread(ctx, {
      userId: authUser._id,
      title: sanitizedTitle,
    });
  },
});

/**
 * Update thread title
 */
export const updateTitle = mutation({
  args: {
    threadId: v.id("threads"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    // Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Rate limiting
    const status = await rateLimiter.limit(ctx, "updateThread", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(`Rate limit exceeded. Retry after ${status.retryAfter}ms`);
    }

    // Verify ownership
    const thread = await Threads.getThreadById(ctx, args.threadId);
    if (!thread) {
      throw new Error("Thread not found");
    }
    if (thread.userId !== authUser._id) {
      throw new Error("Not authorized to update this thread");
    }

    // Validation
    const sanitizedTitle = sanitizeText(args.title);
    if (!isValidThreadTitle(sanitizedTitle)) {
      throw new Error("Invalid thread title. Must be 1-200 characters.");
    }

    // Update title
    return await Threads.updateThreadTitle(ctx, args.threadId, sanitizedTitle);
  },
});

/**
 * Archive/unarchive a thread
 */
export const updateStatus = mutation({
  args: {
    threadId: v.id("threads"),
    status: v.union(v.literal("active"), v.literal("archived")),
  },
  handler: async (ctx, args) => {
    // Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Rate limiting
    const status = await rateLimiter.limit(ctx, "updateThread", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(`Rate limit exceeded. Retry after ${status.retryAfter}ms`);
    }

    // Verify ownership
    const thread = await Threads.getThreadById(ctx, args.threadId);
    if (!thread) {
      throw new Error("Thread not found");
    }
    if (thread.userId !== authUser._id) {
      throw new Error("Not authorized to update this thread");
    }

    // Update status
    return await Threads.updateThreadStatus(ctx, args.threadId, args.status);
  },
});

/**
 * Delete a thread and all its messages
 */
export const remove = mutation({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    // Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Rate limiting
    const status = await rateLimiter.limit(ctx, "deleteThread", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(`Rate limit exceeded. Retry after ${status.retryAfter}ms`);
    }

    // Verify ownership
    const thread = await Threads.getThreadById(ctx, args.threadId);
    if (!thread) {
      throw new Error("Thread not found");
    }
    if (thread.userId !== authUser._id) {
      throw new Error("Not authorized to delete this thread");
    }

    // Delete all messages first
    await Messages.deleteMessagesByThread(ctx, args.threadId);

    // Delete thread
    return await Threads.deleteThread(ctx, args.threadId);
  },
});

/**
 * Send a message in a thread
 */
export const sendMessage = mutation({
  args: {
    threadId: v.id("threads"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Rate limiting
    const status = await rateLimiter.limit(ctx, "sendMessage", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(`Rate limit exceeded. Retry after ${status.retryAfter}ms`);
    }

    // Verify thread ownership
    const thread = await Threads.getThreadById(ctx, args.threadId);
    if (!thread) {
      throw new Error("Thread not found");
    }
    if (thread.userId !== authUser._id) {
      throw new Error("Not authorized to send messages in this thread");
    }

    // Validation
    const sanitizedContent = sanitizeText(args.content);
    if (!isValidMessageContent(sanitizedContent)) {
      throw new Error("Invalid message content. Must be 1-10000 characters.");
    }

    // Create user message
    return await Messages.createMessage(ctx, {
      threadId: args.threadId,
      userId: authUser._id,
      role: "user",
      content: sanitizedContent,
    });
  },
});
