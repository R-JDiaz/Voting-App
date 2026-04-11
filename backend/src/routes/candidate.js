import CandidateController from "../controllers/candidate.js";
import { asyncHandler } from "../utils/handlers/async_handler.js";
import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { authorizeAccess, authMiddleware } from "../middlewares/auth.js";

import {
  createCandidateSchema,
  updateCandidateSchema,
  getCandidateSchema,
  getCandidatesByPositionSchema,
  deleteCandidateSchema
} from "../schemas/candidate.js";

const router = Router();

router.use(authMiddleware);

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
  authorizeAccess(["ADMIN", "USER"], ["CAN_CREATE_ELECTION"]),
  validate(createCandidateSchema),
  asyncHandler(CandidateController.create)
);

router.put(
  "/:id",
  authorizeAccess(["ADMIN", "USER"], ["CAN_CREATE_ELECTION"]),
  validate(updateCandidateSchema),
  asyncHandler(CandidateController.update)
);

router.delete(
  "/:id",
  authorizeAccess(["ADMIN", "USER"], ["CAN_CREATE_ELECTION"]),
  validate(deleteCandidateSchema),
  asyncHandler(CandidateController.delete)
);

export default router;