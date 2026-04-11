import AdminController from "../controllers/admin.js";
import { asyncHandler } from "../utils/handlers/async_handler.js";
import { Router } from "express";
import { authorizeRole, authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.use(authMiddleware);

router.get(
  "/",
  asyncHandler(AdminController.getAll)
);

router.get(
  "/:id",
  asyncHandler(AdminController.getById)
);

router.post(
  "/",
  authorizeRole(["ADMIN"]),
  asyncHandler(AdminController.create)
);

router.put(
  "/:id",
  authorizeRole(["ADMIN"]),
  asyncHandler(AdminController.update)
);

router.put(
  "/password/:id",
  authorizeRole(["ADMIN"]),
  asyncHandler(AdminController.updatePassword)
);

router.delete(
  "/:id",
  authorizeRole(["ADMIN"]),
  asyncHandler(AdminController.delete)
);

export default router;