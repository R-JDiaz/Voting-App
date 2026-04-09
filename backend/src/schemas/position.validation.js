// backend/src/schemas/position.validation.js
import { z } from "zod";
import { positionCoreSchema, positiveInt, positionCreateSchema } from "../../../shared/schemas/position.js";

export const createPositionSchema = z.object({
  body: positionCreateSchema
});

export const updatePositionSchema = z.object({
  body: positionCoreSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided"
    }
  ),
  params: z.object({
    id: positiveInt
  })
});

export const getPositionSchema = z.object({
  params: z.object({
    id: positiveInt
  })
});

export const getPositionsByElectionSchema = z.object({
  params: z.object({
    election_id: positiveInt
  })
});

export const deletePositionSchema = z.object({
  params: z.object({
    id: positiveInt
  })
});