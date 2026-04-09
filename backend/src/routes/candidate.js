import CandidateController from "../controllers/candidate.js";
import { asyncHandler } from "../utils/handlers/async_handler.js";
import { Router } from "express";
import { validate } from "../middlewares/validate.js";

import {
  createCandidateSchema,
  updateCandidateSchema,
  getCandidateSchema,
  getCandidatesByPositionSchema,
  deleteCandidateSchema
} from "../schemas/candidate.validation.js";

const router = Router();

router.get(
  "/position/:position_id",
  validate(getCandidatesByPositionSchema),
  asyncHandler(CandidateController.getAllByPositionId)
);

router.get(
  "/:id",
  validate(getCandidateSchema),
  asyncHandler(CandidateController.getById)
);

router.post(
  "/",
  validate(createCandidateSchema),
  asyncHandler(CandidateController.create)
);

router.put(
  "/:id",
  validate(updateCandidateSchema),
  asyncHandler(CandidateController.update)
);

router.delete(
  "/:id",
  validate(deleteCandidateSchema),
  asyncHandler(CandidateController.delete)
);

export default router;