import { Router } from "express";
import ElectionRoomController from "../controllers/electionRoom.js";
import { asyncHandler } from "../utils/handlers/async_handler.js";
import { validate } from "../middlewares/validate.js";
import { authMiddleware, authorizeAccess } from "../middlewares/auth.js";
import { UserRole } from "../enums/role.js";
import { Permission } from "../enums/permission.js";
import {
    createElectionRoomSchema,
    updateElectionRoomSchema,
    getElectionRoomSchema,
    getElectionRoomByElectionSchema
} from "../schemas/electionRoom.validation.js";

const router = Router();

router.use(authMiddleware);

router.get("/", asyncHandler(ElectionRoomController.getAll));

router.get(
    "/:id",
    validate(getElectionRoomSchema),
    asyncHandler(ElectionRoomController.getById)
);

router.get(
    "/election/:electionId",
    validate(getElectionRoomByElectionSchema),
    asyncHandler(ElectionRoomController.getByElectionId)
);

router.post(
    "/",
    authorizeAccess([UserRole.ADMIN, UserRole.USER], [Permission.CAN_CREATE_ELECTION_ROOM]),
    validate(createElectionRoomSchema),
    asyncHandler(ElectionRoomController.create)
);

router.put(
    "/:id",
    authorizeAccess([UserRole.ADMIN, UserRole.USER], [Permission.CAN_UPDATE_ELECTION_ROOM]),
    validate(updateElectionRoomSchema),
    asyncHandler(ElectionRoomController.update)
);

router.delete(
    "/:id",
    authorizeAccess([UserRole.ADMIN, UserRole.USER], [Permission.CAN_DELETE_ELECTION_ROOM]),
    validate(getElectionRoomSchema),
    asyncHandler(ElectionRoomController.delete)
);

export default router;