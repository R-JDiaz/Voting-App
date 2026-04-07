import { ZodError } from "zod";
import AppError from "../utils/handlers/error_handling.js";

export const validate = (schema) => {
    return (req, res, next) => {
        try {
            const validatedData = schema.parse({
                body: req.body,
                params: req.params,
                query: req.query
            });

            // ✅ attach validated data instead of overwriting
            req.validated = validatedData;

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return next(
                    new AppError(
                        "Validation Failed",
                        400,
                        "VALIDATION_ERROR"
                    )
                );
            }
            next(error);
        }
    };
};