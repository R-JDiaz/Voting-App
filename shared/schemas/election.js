import { z } from "zod";

const dateString = z
    .string()
    .datetime({
        message: "Invalid date format"
    });

const statusEnum = z.enum(["upcoming", "ongoing", "ended"], {
    errorMap: () => ({ message: "Invalid status value" })
});

const electionBody = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  start_date: dateString,
  end_date: dateString,
  status: statusEnum
});

export const fullElectionSchema = z.object({
  body: electionBody,
  params: z.object({}),
  query: z.object({})
});

export const updateElectionSchema = z.object({
  body: electionBody.partial(), // 🔥 automatic optional
  params: z.object({
    id: z.string().min(1, "Election ID is required")
  }),
  query: z.object({})
});

export const electionSchema = z.object({
    body: z.object({}).optional(),

    params: z.object({
        id: z.string().min(1, "Election ID is required")
    }),

    query: z.object({})
});