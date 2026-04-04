import AuthController from "../controllers/auth.js";
import { asyncHandler } from "../utils/handlers/async_handler.js";
import { Router } from "express";

const router = Router();

router.post("/register", asyncHandler(AuthController.register));
router.post("/login", asyncHandler(AuthController.login));

export default router;