import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveFromPlan = mutation({
  args: {
    planId: v.id("plans"),
    day: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const plan = await ctx.db.get(args.planId);
    if (!plan) throw new Error("Plan not found");
    if (plan.userId !== args.userId) throw new Error("Unauthorized");

    const dayExercises = plan.workoutPlan.exercises.find((e) => e.day === args.day);
    if (!dayExercises) throw new Error(`Could not find workout for ${args.day}`);

    const formattedExercises = dayExercises.routines.map((r) => {
      // Flatten nested exercises into description
      let description = r.description || "";
      if (r.exercises && r.exercises.length > 0) {
        const nestedStr = "Exercises: " + r.exercises.join(", ");
        description = description ? `${description}\n\n${nestedStr}` : nestedStr;
      }

      return {
        name: r.name,
        sets: r.sets,
        reps: r.reps,
        duration: r.duration,
        description: description || undefined,
      };
    });

    const routineId = await ctx.db.insert("routines", {
      userId: args.userId,
      name: `${plan.name} - ${args.day}`,
      exercises: formattedExercises,
    });

    return routineId;
  },
});

export const getUserRoutines = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("routines")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const updateRoutine = mutation({
  args: {
    routineId: v.id("routines"),
    userId: v.string(),
    exercises: v.array(v.object({
      name: v.string(),
      sets: v.optional(v.number()),
      reps: v.optional(v.number()),
      duration: v.optional(v.string()),
      description: v.optional(v.string()),
      detailedSets: v.optional(v.array(v.object({
        reps: v.number(),
        weight: v.string()
      })))
    }))
  },
  handler: async (ctx, args) => {
    const routine = await ctx.db.get(args.routineId);
    if (!routine) throw new Error("Routine not found");
    if (routine.userId !== args.userId) throw new Error("Unauthorized");

    return await ctx.db.patch(args.routineId, {
      exercises: args.exercises
    });
  }
});

export const createRoutine = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    exercises: v.array(v.object({
      name: v.string(),
      sets: v.optional(v.number()),
      reps: v.optional(v.number()),
      duration: v.optional(v.string()),
      description: v.optional(v.string()),
      detailedSets: v.optional(v.array(v.object({
        reps: v.number(),
        weight: v.string()
      })))
    }))
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("routines", {
      userId: args.userId,
      name: args.name,
      exercises: args.exercises
    });
  }
});

export const renameRoutine = mutation({
  args: {
    routineId: v.id("routines"),
    userId: v.string(),
    name: v.string()
  },
  handler: async (ctx, args) => {
    const routine = await ctx.db.get(args.routineId);
    if (!routine) throw new Error("Routine not found");
    if (routine.userId !== args.userId) throw new Error("Unauthorized");
    return await ctx.db.patch(args.routineId, { name: args.name });
  }
});

export const deleteRoutine = mutation({
  args: {
    routineId: v.id("routines"),
    userId: v.string()
  },
  handler: async (ctx, args) => {
    const routine = await ctx.db.get(args.routineId);
    if (!routine) throw new Error("Routine not found");
    if (routine.userId !== args.userId) throw new Error("Unauthorized");
    return await ctx.db.delete(args.routineId);
  }
});
