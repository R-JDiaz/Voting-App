import VoteController from "../controllers/vote.js";
import { asyncHandler } from "../utils/handlers/async_handler.js";
import { Router } from "express";

const router = Router();

router.get(
  "/election/:election_id",
  asyncHandler(VoteController.getAllByElectionId)
);

router.get("/:id", asyncHandler(VoteController.getById));

router.get(
  "/voter/:voter_id",
  asyncHandler(VoteController.getByVoterId)
);

router.post("/", asyncHandler(VoteController.create));
router.delete("/:id", asyncHandler(VoteController.delete));

export default router;