/**
 * Database Layer: Dashboard
 *
 * Aggregates data across multiple tables for dashboard views.
 * Uses type assertion for dynamic table queries.
 */

import type { QueryCtx } from "../_generated/server";
import type { DataModel } from "../_generated/dataModel";

const TABLES = ["todos", "threads", "messages"] as const;
const PRIMARY_TABLE = "todos";

export async function loadSummary(ctx: QueryCtx, userId: string) {
  const perTable: Record<string, number> = {};

  for (const table of TABLES) {
    // ✅ Use type assertion for dynamic table queries
    const records = await ctx.db.query(table as keyof DataModel).collect();
    const scopedRecords = records.filter((record: any) => record.userId === userId);
    perTable[table] = scopedRecords.length;
  }

  const totalRecords = Object.values(perTable).reduce((sum, count) => sum + count, 0);

  // Get specific counts for todos
  const todos = await ctx.db
    .query("todos")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();
  const completedTodos = todos.filter(t => t.isCompleted).length;
  const activeTodos = todos.length - completedTodos;

  // Get thread counts
  const threads = await ctx.db
    .query("threads")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();
  const activeThreads = threads.filter(t => t.status === "active").length;

  return {
    totalRecords,
    perTable,
    todos: {
      total: todos.length,
      completed: completedTodos,
      active: activeTodos,
    },
    threads: {
      total: threads.length,
      active: activeThreads,
    },
  };
}

export async function loadRecent(ctx: QueryCtx, userId: string, limit = 5) {
  const records = await ctx.db
    .query(PRIMARY_TABLE as keyof DataModel)
    .withIndex("by_user_and_created", (q) => q.eq("userId", userId))
    .order("desc")
    .take(limit);

  return Array.from(records).map((record: any) => ({
    _id: record._id,
    text: record.text,
    isCompleted: record.isCompleted,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  }));
}
