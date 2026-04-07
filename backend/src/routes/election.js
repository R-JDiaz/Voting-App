import ElectionController from "../controllers/election.js";
import { asyncHandler } from "../utils/handlers/async_handler.js";
import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { electionSchema, fullElectionSchema, updateElectionSchema} from "../schemas/election.js";
const router = Router();

router.get("/", asyncHandler(ElectionController.getAll));
router.get(
    "/:id", 
    validate(electionSchema),
    asyncHandler(ElectionController.getById));

router.post(
    "/", 
    validate(fullElectionSchema),
    asyncHandler(ElectionController.create));

router.put(
    "/:id", 
    validate(updateElectionSchema),
    asyncHandler(ElectionController.update));

router.delete(
    "/:id", 
    validate(electionSchema),
    asyncHandler(ElectionController.delete));

export default router;
