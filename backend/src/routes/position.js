import PositionController from "../controllers/position.js";
import { asyncHandler } from "../utils/handlers/async_handler.js";
import { Router } from "express";

const router = Router();

router.get("/", asyncHandler(PositionController.getAllByElectionId));
router.get("/:id", asyncHandler(PositionController.getByPositionId));
router.post("/", asyncHandler(PositionController.create));
router.put("/:id", asyncHandler(PositionController.update));
router.delete("/:id", asyncHandler(PositionController.delete));

export default router;