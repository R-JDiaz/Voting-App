import { z } from "zod";

const statusEnum = z.enum(["upcoming", "ongoing", "ended"], {
  errorMap: () => ({ message: "Invalid status value" })
});

export const dateString = z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  });

export const startDate = dateString.refine(
  (val) => new Date(val).getTime() >= Date.now(),
  {
    message: "Start date must be now or in the future"
  }
);

export const electionBody = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  start_date: startDate,
  end_date: dateString,
  status: statusEnum,
  creator_id: z.string(),
  is_public: z.boolean().optional().default(true),
  room_code: z.string().max(50).optional().nullable()
});