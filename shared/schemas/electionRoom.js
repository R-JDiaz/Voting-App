import { z } from "zod";

const booleanString = z.preprocess((val) => {
    if (typeof val === "string") {
        if (val === "true") return true;
        if (val === "false") return false;
    }
    return val;
}, z.boolean());

export const createElectionRoomSchema = z.object({
    election_id: z.number({
        required_error: "Election ID is required",
        invalid_type_error: "Election ID must be a number"
    }),

    creator_id: z.number({
        required_error: "Creator ID is required",
        invalid_type_error: "Creator ID must be a number"
    }),

    is_public: booleanString.optional().default(true),

    room_code: z.string().max(50).nullable().optional()
});

export const updateElectionRoomSchema = z.object({
    is_public: booleanString.optional(),

    room_code: z.string().max(50).nullable().optional()
});

export const getElectionRoomSchema = z.object({
    id: z.coerce.number({
        required_error: "ID is required",
        invalid_type_error: "ID must be a number"
    })
});