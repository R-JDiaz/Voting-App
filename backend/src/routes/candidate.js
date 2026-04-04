import CandidateController from "../controllers/candidate.js";
import { asyncHandler } from "../utils/wrappers/async_handler.js";
import { Router } from "express";

const router = Router();

router.get(
  "/position/:position_id",
  asyncHandler(CandidateController.getAllByPositionId)
);

router.get("/:id", asyncHandler(CandidateController.getById));
router.post("/", asyncHandler(CandidateController.create));
router.put("/:id", asyncHandler(CandidateController.update));
router.delete("/:id", asyncHandler(CandidateController.delete));

export default router;