import UserController from "../controllers/user.js";
import { asyncHandler } from "../utils/wrappers/async_handler.js";
import { Router } from "express";

const router = Router();

router.get("/", asyncHandler(UserController.getAll));
router.get("/:id", asyncHandler(UserController.getById));
router.get("/email/:email", asyncHandler(UserController.getByEmail));

router.post("/", asyncHandler(UserController.create));
router.put("/:id", asyncHandler(UserController.update));

router.put(
  "/password/:id",
  asyncHandler(UserController.updatePassword)
);

router.delete("/:id", asyncHandler(UserController.delete));

export default router;