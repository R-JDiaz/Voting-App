import { z } from "zod";

export const positiveInt = z
  .coerce.number({
    required_error: "Must be a number",
    invalid_type_error: "Must be a number"
  })
  .int("Must be an integer")
  .positive("Must be greater than 0");

export const positionCoreSchema = z.object({
  election_id: positiveInt,

  name: z
    .string()
    .min(2, "Position name must be at least 2 characters")
    .max(100, "Position name must not exceed 100 characters"),

  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),

  max_votes: positiveInt
});

export const positionCreateSchema = z.object({
  positions: z
    .array(positionCoreSchema)
    .min(1, "At least one position is required")
});