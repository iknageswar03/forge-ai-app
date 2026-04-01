import { defineSchema,defineTable } from "convex/server";
import {v} from "convex/values"

export default defineSchema({
    users:defineTable({
        name:v.string(),
        email:v.string(),
        image:v.optional(v.string()),
        clerkId:v.string()
    }).index("by_clerk_id",["clerkId"]),

    plans:defineTable({
        userId:v.string(),
        name:v.string(),
        workoutPlan:v.object({
            schedule:v.array(v.string()),
            exercises:v.array(v.object({
                day:v.string(),
                routines:v.array(v.object({
                    name:v.string(),
                    sets:v.optional(v.number()),
                    reps:v.optional(v.number()),
                    duration:v.optional(v.string()),
                    description:v.optional(v.string()),
                    exercises:v.optional(v.array(v.string())),
                }))
            }))
        }),
        
        dietPlan: v.object({
            dailyCalories:v.number(),
            meals:v.array(v.object({
                name:v.string(),
                foods:v.array(v.string())
            }))
        }),
        isActive:v.boolean(),
    })
    .index("by_userId",["userId"])
    .index("by_active",["isActive"]),

    routines: defineTable({
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
    }).index("by_userId", ["userId"]),
    
    workoutLogs: defineTable({
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
    }).index("by_userId", ["userId"])
      .index("by_routineId", ["routineId"])
})

