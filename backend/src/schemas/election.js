import { z } from "zod";

const dateString = z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format"
    });

const statusEnum = z.enum(["upcoming", "ongoing", "ended"], {
    errorMap: () => ({ message: "Invalid status value" })
});

export const fullElectionSchema = z.object({
    body: z.object({
        title: z
            .string()
            .min(3, "Title must be at least 3 characters")
            .max(100, "Title is too long"),

        description: z
            .string()
            .max(500, "Description is too long")
            .optional(),

        start_date: dateString,

        end_date: dateString,

        status: statusEnum
    }),

    params: z.object({}),
    query: z.object({})
});

export const updateElectionSchema  = z.object({
        body: z.object({
        title: z
            .string()
            .min(3, "Title must be at least 3 characters")
            .max(100, "Title is too long"),

        description: z
            .string()
            .max(500, "Description is too long")
            .optional(),

        start_date: dateString,

        end_date: dateString,

        status: statusEnum
    }),

    params: z.object({
        id: z.string().min(1, "Election ID is required")
    }),

    query: z.object({})
});

export const electionSchema = z.object({
    body: z.object({}),

    params: z.object({
        id: z.string().min(1, "Election ID is required")
    }),

    query: z.object({})
});