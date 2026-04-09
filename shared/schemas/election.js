import { z } from "zod";

const statusEnum = z.enum(["upcoming", "ongoing", "ended"], {
  errorMap: () => ({ message: "Invalid status value" })
});

export const dateString = z.datetime({
  message: "Invalid date format"
});

export const startDate = dateString.refine(
  (val) => new Date(val) >= new Date(),
  {
    message: "Start date must be now or in the future"
  }
);

export const electionBody = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  start_date: startDate,
  end_date: dateString,
  status: statusEnum
});

