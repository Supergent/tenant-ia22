/**
 * Database Layer: Todos
 *
 * This is the ONLY file that directly accesses the todos table using ctx.db.
 * All todos-related database operations are defined here as pure async functions.
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

// CREATE
export async function createTodo(
  ctx: MutationCtx,
  args: {
    userId: string;
    text: string;
  }
) {
  const now = Date.now();
  return await ctx.db.insert("todos", {
    userId: args.userId,
    text: args.text,
    isCompleted: false,
    createdAt: now,
    updatedAt: now,
  });
}

// READ - Get by ID
export async function getTodoById(
  ctx: QueryCtx,
  id: Id<"todos">
) {
  return await ctx.db.get(id);
}

// READ - Get all todos for a user
export async function getTodosByUser(
  ctx: QueryCtx,
  userId: string
) {
  return await ctx.db
    .query("todos")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .order("desc")
    .collect();
}

// READ - Get todos by completion status
export async function getTodosByUserAndCompleted(
  ctx: QueryCtx,
  userId: string,
  isCompleted: boolean
) {
  return await ctx.db
    .query("todos")
    .withIndex("by_user_and_completed", (q) =>
      q.eq("userId", userId).eq("isCompleted", isCompleted)
    )
    .order("desc")
    .collect();
}

// READ - Get recent todos (limited)
export async function getRecentTodos(
  ctx: QueryCtx,
  userId: string,
  limit: number = 10
) {
  return await ctx.db
    .query("todos")
    .withIndex("by_user_and_created", (q) => q.eq("userId", userId))
    .order("desc")
    .take(limit);
}

// UPDATE - Toggle completion status
export async function toggleTodoCompletion(
  ctx: MutationCtx,
  id: Id<"todos">,
  isCompleted: boolean
) {
  return await ctx.db.patch(id, {
    isCompleted,
    updatedAt: Date.now(),
  });
}

// UPDATE - Update todo text
export async function updateTodoText(
  ctx: MutationCtx,
  id: Id<"todos">,
  text: string
) {
  return await ctx.db.patch(id, {
    text,
    updatedAt: Date.now(),
  });
}

// DELETE
export async function deleteTodo(
  ctx: MutationCtx,
  id: Id<"todos">
) {
  return await ctx.db.delete(id);
}

// STATS - Count todos by completion status
export async function countTodosByUser(
  ctx: QueryCtx,
  userId: string
): Promise<{ total: number; completed: number; active: number }> {
  const allTodos = await getTodosByUser(ctx, userId);

  const total = allTodos.length;
  const completed = allTodos.filter(todo => todo.isCompleted).length;
  const active = total - completed;

  return { total, completed, active };
}
