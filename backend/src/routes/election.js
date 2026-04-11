import ElectionController from "../controllers/election.js";
import { asyncHandler } from "../utils/handlers/async_handler.js";
import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { authorizeAccess, authMiddleware } from "../middlewares/auth.js";
import {
    createElectionSchema,
    updateElectionSchema,
    getElectionSchema
} from "../schemas/election.validation.js";


const router = Router();

router.use(authMiddleware);

router.get("/", asyncHandler(ElectionController.getAll));

router.get(
    "/:id", 
    validate(getElectionSchema),
    asyncHandler(ElectionController.getById)
);

router.post(
    "/", 
    authorizeAccess(["ADMIN", "USER"], ["CAN_CREATE_ELECTION"]),
    validate(createElectionSchema),
    asyncHandler(ElectionController.create)
);

router.put(
    "/:id", 
    authorizeAccess(["ADMIN", "USER"], ["CAN_CREATE_ELECTION"]),
    validate(updateElectionSchema),
    asyncHandler(ElectionController.update)
);

router.delete(
    "/:id", 
    authorizeAccess(["ADMIN", "USER"], ["CAN_CREATE_ELECTION"]),
    validate(getElectionSchema),
    asyncHandler(ElectionController.delete)
);

export default router;