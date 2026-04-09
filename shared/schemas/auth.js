import { z } from "zod";

export const loginSchema = z.object({
    body: z.object({
        identifier: z
            .string()
            .min(3, "Identifier is required"),

        password: z
            .string()
            .min(6, "Password must be at least 6 characters"),
    }),

    params: z.object({}),
    query: z.object({})
});

export const registerSchema = z.object({
    body: z.object({
        username: z
            .string()
            .min(3, "Username must be at least 3 characters")
            .max(20, "Username too long")
            .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),

        email: z
            .email("Invalid email format"),

        password: z
            .string()
            .min(6, "Password must be at least 6 characters")
            .max(100, "Password too long"),
    }),

    params: z.object({}),
    query: z.object({})
});