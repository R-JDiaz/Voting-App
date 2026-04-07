import { z } from 'zod';

export const loginSchema = z.object({
    body: z.object({
        identifier: z.string(),
        password: z.string().min(6)
    }),
    params: z.object({}),
    query: z.object({})
});

export const registerSchema = z.object({
    body: z.object({
        username: z.username,
        email: z.email(),
        password: z.string().min(6)
    }),
    params: z.object({}),
    query: z.object({})
});

