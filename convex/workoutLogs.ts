import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveLog = mutation({
  args: {
    userId: v.string(),
    routineId: v.optional(v.id("routines")),
    date: v.string(),
    duration: v.optional(v.number()),
    exercises: v.array(v.object({
      name: v.string(),
      completedSets: v.array(v.object({
        reps: v.number(),
        weight: v.string(),
        completed: v.boolean(),
      }))
    })),
    notes: v.optional(v.string()),
    isCompleted: v.boolean(),
    completedAt: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("workoutLogs", {
      userId: args.userId,
      routineId: args.routineId,
      date: args.date,
      duration: args.duration,
      exercises: args.exercises,
      notes: args.notes,
      isCompleted: args.isCompleted,
      completedAt: args.completedAt,
    });
  },
});

export const getUserLogs = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("workoutLogs")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc") // Orders descending based on _creationTime (newest first)
      .collect();
  },
});
