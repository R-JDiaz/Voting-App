import { Router } from "express";
import ElectionRoomUserController from "../controllers/electionRoomUser.js";
import { asyncHandler } from "../utils/handlers/async_handler.js";
import { validate } from "../middlewares/validate.js";
import { authMiddleware, authorizeAccess } from "../middlewares/auth.js";
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
    "/user/:userId",
    asyncHandler(ElectionRoomUserController.getByUserId)
);

router.post(
    "/join",
    authorizeAccess(["ADMIN", "USER"], ["CAN_JOIN_ROOM"]),
    validate(joinRoomUserSchema),
    asyncHandler(ElectionRoomUserController.join)
);

router.put(
    "/:id",
    authorizeAccess(["ADMIN", "USER"], ["CAN_UPDATE_ROOM_USER"]),
    validate(updateRoomUserSchema),
    asyncHandler(ElectionRoomUserController.update)
);

router.delete(
    "/:id",
    authorizeAccess(["ADMIN", "USER"], ["CAN_LEAVE_ROOM"]),
    validate(getRoomUserSchema),
    asyncHandler(ElectionRoomUserController.delete)
);

export default router;