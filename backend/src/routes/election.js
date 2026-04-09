import ElectionController from "../controllers/election.js";
import { asyncHandler } from "../utils/handlers/async_handler.js";
import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import {
    createElectionSchema,
    updateElectionSchema,
    getElectionSchema
} from "../schemas/election.validations.js";

const router = Router();

router.get("/", asyncHandler(ElectionController.getAll));
router.get(
    "/:id", 
    validate(getElectionSchema),
    asyncHandler(ElectionController.getById));

router.post(
    "/", 
    validate(createElectionSchema),
    asyncHandler(ElectionController.create));

router.put(
    "/:id", 
    validate(updateElectionSchema),
    asyncHandler(ElectionController.update));

router.delete(
    "/:id", 
    validate(getElectionSchema),
    asyncHandler(ElectionController.delete));

export default router;
