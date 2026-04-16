import VoteController from "../controllers/vote.js";
import { asyncHandler } from "../utils/handlers/async_handler.js";
import { Router } from "express";
import { UserRole } from "../enums/role.js";
import { authorizeRole, authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.use(authMiddleware);

router.get(
  "/election/:election_id",
  asyncHandler(VoteController.getAllByElectionId)
);

router.get("/:id", asyncHandler(VoteController.getById));

router.post("/", asyncHandler(VoteController.create));

router.delete(
  "/:id",
  authorizeRole([UserRole.ADMIN]),
  asyncHandler(VoteController.delete)
);

export default router;