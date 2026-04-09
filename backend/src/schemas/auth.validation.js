import { z } from "zod";
import { loginCoreSchema, registerCoreSchema } from "../../../shared/schemas/auth.schema.js";

const requestSchema = (bodySchema) =>
    z.object({
        body: bodySchema,
        params: z.object({}),
        query: z.object({})
    });

export const loginSchema = requestSchema(loginCoreSchema);

export const registerSchema = requestSchema(registerCoreSchema);