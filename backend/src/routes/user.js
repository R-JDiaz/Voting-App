import UserController from "../controllers/user.js";
import { asyncHandler } from "../utils/handlers/async_handler.js";
import { Router } from "express";
import { authorizeRole, authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.use(authMiddleware);

router.get("/", asyncHandler(UserController.getAll));
router.get("/:id", asyncHandler(UserController.getById));
router.get("/email/:email", asyncHandler(UserController.getByEmail));

router.post(
  "/",
  authorizeRole(["ADMIN"]),
  asyncHandler(UserController.create)
);

router.put(
  "/:id",
  authorizeRole(["ADMIN"]),
  asyncHandler(UserController.update)
);

router.put(
  "/password/:id",
  asyncHandler(UserController.updatePassword)
);

router.delete(
  "/:id",
  authorizeRole(["ADMIN"]),
  asyncHandler(UserController.delete)
);

export default router;