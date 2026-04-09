import { z } from "zod";

export const loginCoreSchema = z.object({
    identifier: z
        .string()
        .min(3, "Identifier is required"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
});

export const registerCoreSchema = z.object({
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
});