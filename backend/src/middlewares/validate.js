import { ZodError } from "zod";
import AppError from "../utils/handlers/error_handling.js";

const formatZodErrors = (error) => {
    const formatted = {};

    error.issues.forEach((issue) => {
        const key = issue.path[issue.path.length - 1];
        formatted[key] = issue.message;
    });

    return formatted;
};

export const validate = (schema) => {
    return (req, res, next) => {
        try {
            const validatedData = schema.parse({
                body: req.body,
                params: req.params,
                query: req.query
            });

            req.validated = validatedData;
            next();

        } catch (error) {
            if (error instanceof ZodError) {
                const errors = formatZodErrors(error);

                return next(
                    new AppError(
                        "Validation Failed",
                        400,
                        "VALIDATION_ERROR",
                        errors 
                    )
                );
            }

            next(error);
        }
    };
};