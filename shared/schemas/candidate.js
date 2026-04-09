import { z } from "zod";

export const positiveInt = z
  .coerce.number({
    required_error: "Must be a number",
    invalid_type_error: "Must be a number"
  })
  .int("Must be an integer")
  .positive("Must be greater than 0");

export const candidateCoreSchema = z.object({
  position_id: positiveInt,

  name: z
    .string()
    .min(2, "Candidate name must be at least 2 characters")
    .max(100, "Candidate name must not exceed 100 characters"),

  party_list: z
    .string()
    .max(100, "Party list must not exceed 100 characters")
    .optional(),

  bio: z
    .string()
    .max(500, "Bio must not exceed 500 characters")
    .optional(),

  image_url: z
    .string()
    .url("Invalid image URL")
    .optional()
});

export const candidateCreateSchema = z.object({
  candidates: z
    .array(candidateCoreSchema)
    .min(1, "At least one candidate is required")
});