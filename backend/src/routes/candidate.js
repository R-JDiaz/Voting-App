import CandidateController from "../controllers/candidate.js";
import { asyncHandler } from "../utils/handlers/async_handler.js";
import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { authorizeAccess, authMiddleware } from "../middlewares/auth.js";
import { UserRole } from "../enums/role.js";
import { Permission } from "../enums/permission.js";
import {
  createCandidateSchema,
  updateCandidateSchema,
  getCandidateSchema,
  getCandidatesByPositionSchema,
  deleteCandidateSchema
} from "../schemas/candidate.validation.js";

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
  authorizeAccess([UserRole.ADMIN, UserRole.USER], [Permission.CAN_CREATE_CANDIDATE]),
  validate(createCandidateSchema),
  asyncHandler(CandidateController.create)
);

router.put(
  "/:id",
  authorizeAccess([UserRole.ADMIN, UserRole.USER], [Permission.CAN_UPDATE_CANDIDATE]),
  validate(updateCandidateSchema),
  asyncHandler(CandidateController.update)
);

router.delete(
  "/:id",
  authorizeAccess([UserRole.ADMIN, UserRole.USER], [Permission.CAN_DELETE_CANDIDATE]),
  validate(deleteCandidateSchema),
  asyncHandler(CandidateController.delete)
);

export default router;