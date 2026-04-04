import AdminController from "../controllers/admin.js";
import { asyncHandler } from "../utils/wrappers/async_handler.js";
import { Router } from "express";

const router = Router();

router.get("/", asyncHandler(AdminController.getAll));
router.get("/:id", asyncHandler(AdminController.getById));
router.get("/username/:username", asyncHandler(AdminController.getByUsername));

router.post("/", asyncHandler(AdminController.create));
router.put("/:id", asyncHandler(AdminController.update));

router.put(
  "/password/:id",
  asyncHandler(AdminController.updatePassword)
);

router.delete("/:id", asyncHandler(AdminController.delete));

export default router;