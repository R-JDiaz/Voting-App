import { z } from "zod";
import { electionBody } from "../../../shared/schemas/election.js";
import { validateDateRange } from "../utils/validations/datetime.js";

export const createElectionSchema = z.object({
  body: electionBody.refine(validateDateRange, {
    message: "End date must be after start date",
    path: ["end_date"]
  }),
  params: z.object({}),
  query: z.object({})
});

export const updateElectionSchema = z.object({
  body: electionBody
    .partial()
    .refine((data) => {
      if (data.start_date && data.end_date) {
        return validateDateRange(data);
      }
      return true;
    }, {
      message: "End date must be after start date",
      path: ["end_date"]
    }),
  params: z.object({
    id: z.string().min(1, "Election ID is required")
  }),
  query: z.object({})
});


export const getElectionSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().min(1, "Election ID is required")
  }),
  query: z.object({})
});