import ElectionController from "../controllers/election.js";
import { asyncHandler } from "../utils/handlers/async_handler.js";
import { Router } from "express";

const router = Router();

router.get("/", asyncHandler(ElectionController.getAll));
router.get("/:id", asyncHandler(ElectionController.getById));
router.post("/", asyncHandler(ElectionController.create));
router.put("/:id", asyncHandler(ElectionController.update));
router.delete("/:id", asyncHandler(ElectionController.delete));

export default router;
