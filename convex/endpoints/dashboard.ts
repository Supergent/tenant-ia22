/**
 * Endpoint Layer: Dashboard
 *
 * Provides summary statistics and recent data for the dashboard.
 * Composes database operations from the db layer.
 */

import { v } from "convex/values";
import { query } from "../_generated/server";
import { authComponent } from "../auth";
import * as Dashboard from "../db/dashboard";

/**
 * Get dashboard summary statistics
 */
export const summary = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      // Return empty stats for unauthenticated users
      return {
        totalRecords: 0,
        perTable: {},
        todos: { total: 0, completed: 0, active: 0 },
        threads: { total: 0, active: 0 },
      };
    }

    return Dashboard.loadSummary(ctx, authUser._id);
  },
});

/**
 * Get recent todos for dashboard table
 */
export const recent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      return [];
    }

    return Dashboard.loadRecent(ctx, authUser._id, args.limit ?? 5);
  },
});
