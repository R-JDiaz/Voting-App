import AuthController from "../controllers/auth.js";
import { asyncHandler } from "../utils/handlers/async_handler.js";
import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { 
    loginSchema, 
    registerSchema 
} from "../schemas/auth.validation.js";

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