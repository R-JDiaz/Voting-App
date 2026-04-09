import { z } from "zod";
import {
  candidateCoreSchema,
  candidateCreateSchema,
  positiveInt
} from "../../../shared/schemas/candidate.js";

export const createCandidateSchema = z.object({
  body: candidateCreateSchema
});

export const updateCandidateSchema = z.object({
  body: candidateCoreSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided"
    }
  ),
  params: z.object({
    id: positiveInt
  })
});

export const getCandidateSchema = z.object({
  params: z.object({
    id: positiveInt
  })
});

export const getCandidatesByPositionSchema = z.object({
  params: z.object({
    position_id: positiveInt
  })
});

export const deleteCandidateSchema = z.object({
  params: z.object({
    id: positiveInt
  })
});