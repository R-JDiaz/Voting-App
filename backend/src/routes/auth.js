import AuthController from "../controllers/auth.js";
import { asyncHandler } from "../utils/handlers/async_handler.js";
import { Router } from "express";
import { loginSchema, registerSchema } from "../schemas/auth.js";
import { validate } from "../middlewares/validate.js";

const router = Router();

router.post(
    "/register"
    ,validate(registerSchema)
    ,asyncHandler(AuthController.register));

router.post(
    "/login"
    ,validate(loginSchema)
    ,asyncHandler(AuthController.login));

export default router;