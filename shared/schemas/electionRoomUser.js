import { z } from "zod";

const booleanString = z.preprocess((val) => {
    if (typeof val === "string") {
        if (val === "true") return true;
        if (val === "false") return false;
    }
    return val;
}, z.boolean());

export const joinRoomUserSchema = z.object({
    body: z.object({
        election_id: z.coerce.number({
            required_error: "Election ID is required"
        }),
        user_id: z.coerce.number({
            required_error: "User ID is required"
        })
    }),
    params: z.object({}),
    query: z.object({})
});

export const updateRoomUserSchema = z.object({
    body: z.object({
        is_blocked: booleanString.optional()
    }),
    params: z.object({
        id: z.string().min(1, "Room user ID is required")
    }),
    query: z.object({})
});

export const getRoomUserSchema = z.object({
    body: z.object({}).optional(),
    params: z.object({
        id: z.string().min(1, "Room user ID is required")
    }),
    query: z.object({})
});