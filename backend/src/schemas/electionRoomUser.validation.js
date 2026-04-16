import { z } from "zod";

/**
 * CREATE / JOIN ROOM
 */
export const joinRoomUserSchema = z.object({
    body: z.object({
        election_id: z.coerce.number({
            required_error: "Election room ID is required",
            invalid_type_error: "Election room ID must be a number"
        }),

        user_id: z.coerce.number({
            required_error: "User ID is required",
            invalid_type_error: "User ID must be a number"
        })
    }),

    params: z.object({}),

    query: z.object({})
});

/**
 * UPDATE (block / unblock user in room)
 */
export const updateRoomUserSchema = z.object({
    body: z.object({
        is_blocked: z.coerce.boolean({
            invalid_type_error: "is_blocked must be a boolean"
        }).optional()
    }),

    params: z.object({
        id: z.string().min(1, "Room user ID is required")
    }),

    query: z.object({})
});

/**
 * GET BY ID
 */
export const getRoomUserSchema = z.object({
    body: z.object({}).optional(),

    params: z.object({
        id: z.string().min(1, "Room user ID is required")
    }),

    query: z.object({})
});

/**
 * GET BY ROOM ID
 */
export const getRoomUsersByRoomSchema = z.object({
    body: z.object({}).optional(),

    params: z.object({
        roomId: z.string().min(1, "Election room ID is required")
    }),

    query: z.object({})
});

/**
 * GET BY USER ID
 */
export const getRoomUsersByUserSchema = z.object({
    body: z.object({}).optional(),

    params: z.object({
        userId: z.string().min(1, "User ID is required")
    }),

    query: z.object({})
});