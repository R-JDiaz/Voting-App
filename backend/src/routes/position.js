import PositionController from "../controllers/position.js";
import { asyncHandler } from "../utils/handlers/async_handler.js";
import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { authorizeAccess } from "../middlewares/auth.js";

import {
    createPositionSchema,
    updatePositionSchema,
    getPositionSchema,
    getPositionsByElectionSchema,
    deletePositionSchema
} from "../schemas/position.validation.js";

const router = Router();

router.get(
    "/election/:election_id",
    validate(getPositionsByElectionSchema),
    asyncHandler(PositionController.getAllByElectionId)
);

router.get(
    "/:id",
    validate(getPositionSchema),
    asyncHandler(PositionController.getByPositionId)
);

router.post(
    "/",
    authorizeAccess(["ADMIN", "USER"], ["CAN_CREATE_ELECTION"]),
    validate(createPositionSchema),
    asyncHandler(PositionController.create)
);

router.put(
    "/:id",
    authorizeAccess(["ADMIN", "USER"], ["CAN_CREATE_ELECTION"]),
    validate(updatePositionSchema),
    asyncHandler(PositionController.update)
);

router.delete(
    "/:id",
    authorizeAccess(["ADMIN", "USER"], ["CAN_CREATE_ELECTION"]),
    validate(deletePositionSchema),
    asyncHandler(PositionController.delete)
);

export default router;