import PositionController from "../controllers/position.js";
import { asyncHandler } from "../utils/handlers/async_handler.js";
import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { UserRole } from "../enums/role.js";
import { Permission } from "../enums/permission.js";
import { authorizeAccess, authMiddleware } from "../middlewares/auth.js";

import {
    createPositionSchema,
    updatePositionSchema,
    getPositionSchema,
    getPositionsByElectionSchema,
    deletePositionSchema
} from "../schemas/position.validation.js";

const router = Router();

router.use(authMiddleware);

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
    authorizeAccess([UserRole.ADMIN, UserRole.USER], [Permission.CAN_CREATE_POSITION]),
    validate(createPositionSchema),
    asyncHandler(PositionController.create)
);

router.put(
    "/:id",
    authorizeAccess([UserRole.ADMIN, UserRole.USER], [Permission.CAN_CREATE_POSITION]),
    validate(updatePositionSchema),
    asyncHandler(PositionController.update)
);

router.delete(
    "/:id",
    authorizeAccess([UserRole.ADMIN, UserRole.USER], [Permission.CAN_CREATE_POSITION]),
    validate(deletePositionSchema),
    asyncHandler(PositionController.delete)
);

export default router;