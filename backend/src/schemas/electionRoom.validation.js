import { z } from "zod";

const booleanString = z.preprocess((val) => {
    if (typeof val === "string") {
        if (val === "true") return true;
        if (val === "false") return false;
    }
    return val;
}, z.boolean());

const electionRoomBody = z.object({
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

export const createElectionRoomSchema = z.object({
    body: electionRoomBody,
    params: z.object({}),
    query: z.object({})
});

export const updateElectionRoomSchema = z.object({
    body: electionRoomBody.partial(),
    params: z.object({
        id: z.string().min(1, "Election Room ID is required")
    }),
    query: z.object({})
});

export const getElectionRoomSchema = z.object({
    body: z.object({}).optional(),
    params: z.object({
        id: z.string().min(1, "Election Room ID is required")
    }),
    query: z.object({})
});

export const getElectionRoomByElectionSchema = z.object({
    body: z.object({}).optional(),
    params: z.object({
        electionId: z.string().min(1, "Election ID is required")
    }),
    query: z.object({})
});