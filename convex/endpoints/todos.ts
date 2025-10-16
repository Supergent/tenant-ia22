/**
 * Endpoint Layer: Todos
 *
 * Business logic for todo management.
 * Composes database operations from the db layer.
 * Handles authentication and authorization.
 */

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";
import { rateLimiter } from "../rateLimiter";
import * as Todos from "../db/todos";
import { isValidTodoText, sanitizeText } from "../helpers/validation";

/**
 * List all todos for the authenticated user
 */
export const list = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await Todos.getTodosByUser(ctx, authUser._id);
  },
});

/**
 * List todos by completion status
 */
export const listByStatus = query({
  args: {
    isCompleted: v.boolean(),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await Todos.getTodosByUserAndCompleted(
      ctx,
      authUser._id,
      args.isCompleted
    );
  },
});

/**
 * Get todo statistics
 */
export const stats = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await Todos.countTodosByUser(ctx, authUser._id);
  },
});

/**
 * Create a new todo
 */
export const create = mutation({
  args: {
    text: v.string(),
  },
  handler: async (ctx, args) => {
    // Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Rate limiting
    const status = await rateLimiter.limit(ctx, "createTodo", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Retry after ${status.retryAfter}ms`
      );
    }

    // Validation
    const sanitizedText = sanitizeText(args.text);
    if (!isValidTodoText(sanitizedText)) {
      throw new Error("Invalid todo text. Must be 1-500 characters.");
    }

    // Create todo
    return await Todos.createTodo(ctx, {
      userId: authUser._id,
      text: sanitizedText,
    });
  },
});

/**
 * Toggle todo completion status
 */
export const toggle = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    // Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Rate limiting
    const status = await rateLimiter.limit(ctx, "updateTodo", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Retry after ${status.retryAfter}ms`
      );
    }

    // Verify ownership
    const todo = await Todos.getTodoById(ctx, args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    if (todo.userId !== authUser._id) {
      throw new Error("Not authorized to update this todo");
    }

    // Toggle completion
    return await Todos.toggleTodoCompletion(ctx, args.id, !todo.isCompleted);
  },
});

/**
 * Update todo text
 */
export const updateText = mutation({
  args: {
    id: v.id("todos"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    // Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Rate limiting
    const status = await rateLimiter.limit(ctx, "updateTodo", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Retry after ${status.retryAfter}ms`
      );
    }

    // Verify ownership
    const todo = await Todos.getTodoById(ctx, args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    if (todo.userId !== authUser._id) {
      throw new Error("Not authorized to update this todo");
    }

    // Validation
    const sanitizedText = sanitizeText(args.text);
    if (!isValidTodoText(sanitizedText)) {
      throw new Error("Invalid todo text. Must be 1-500 characters.");
    }

    // Update text
    return await Todos.updateTodoText(ctx, args.id, sanitizedText);
  },
});

/**
 * Delete a todo
 */
export const remove = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    // Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Rate limiting
    const status = await rateLimiter.limit(ctx, "deleteTodo", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Retry after ${status.retryAfter}ms`
      );
    }

    // Verify ownership
    const todo = await Todos.getTodoById(ctx, args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    if (todo.userId !== authUser._id) {
      throw new Error("Not authorized to delete this todo");
    }

    // Delete todo
    return await Todos.deleteTodo(ctx, args.id);
  },
});
