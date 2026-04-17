import { Router } from "express";
import ElectionRoomUserController from "../controllers/electionRoomUser.js";
import { asyncHandler } from "../utils/handlers/async_handler.js";
import { validate } from "../middlewares/validate.js";
import { authMiddleware, authorizeAccess } from "../middlewares/auth.js";
import { UserRole } from "../enums/role.js";
import { Permission } from "../enums/permission.js";
import {
    joinRoomUserSchema,
    updateRoomUserSchema,
    getRoomUserSchema
} from "../schemas/electionRoomUser.validation.js";

const router = Router();

router.use(authMiddleware);

router.get("/", asyncHandler(ElectionRoomUserController.getAll));

router.get(
    "/:id",
    validate(getRoomUserSchema),
    asyncHandler(ElectionRoomUserController.getById)
);

router.get(
    "/room/:roomId",
    asyncHandler(ElectionRoomUserController.getByRoomId)
);

router.get(
    "/election/:electionId",
    asyncHandler(ElectionRoomUserController.getByElectionId)
);

router.get(
    "/user/:userId",
    asyncHandler(ElectionRoomUserController.getByUserId)
);

router.post(
    "/join",
    validate(joinRoomUserSchema),
    asyncHandler(ElectionRoomUserController.join)
);

router.put(
    "/:id",
    authorizeAccess([UserRole.ADMIN, UserRole.USER], [Permission.CAN_CREATE_ELECTION]),
    validate(updateRoomUserSchema),
    asyncHandler(ElectionRoomUserController.update)
);

router.delete(
    "/:id",
    authorizeAccess([UserRole.ADMIN, UserRole.USER], [Permission.CAN_CREATE_ELECTION]),
    validate(getRoomUserSchema),
    asyncHandler(ElectionRoomUserController.delete)
);

export default router;