/**
 * Database Layer: Messages
 *
 * This is the ONLY file that directly accesses the messages table using ctx.db.
 * All messages-related database operations are defined here as pure async functions.
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

// CREATE
export async function createMessage(
  ctx: MutationCtx,
  args: {
    threadId: Id<"threads">;
    userId: string;
    role: "user" | "assistant";
    content: string;
  }
) {
  return await ctx.db.insert("messages", {
    threadId: args.threadId,
    userId: args.userId,
    role: args.role,
    content: args.content,
    createdAt: Date.now(),
  });
}

// READ - Get by ID
export async function getMessageById(
  ctx: QueryCtx,
  id: Id<"messages">
) {
  return await ctx.db.get(id);
}

// READ - Get all messages in a thread
export async function getMessagesByThread(
  ctx: QueryCtx,
  threadId: Id<"threads">
) {
  return await ctx.db
    .query("messages")
    .withIndex("by_thread", (q) => q.eq("threadId", threadId))
    .order("asc")  // Messages ordered chronologically
    .collect();
}

// READ - Get messages by user
export async function getMessagesByUser(
  ctx: QueryCtx,
  userId: string
) {
  return await ctx.db
    .query("messages")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .order("desc")
    .collect();
}

// DELETE
export async function deleteMessage(
  ctx: MutationCtx,
  id: Id<"messages">
) {
  return await ctx.db.delete(id);
}

// DELETE - Delete all messages in a thread
export async function deleteMessagesByThread(
  ctx: MutationCtx,
  threadId: Id<"threads">
) {
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_thread", (q) => q.eq("threadId", threadId))
    .collect();

  for (const message of messages) {
    await ctx.db.delete(message._id);
  }

  return messages.length;
}
