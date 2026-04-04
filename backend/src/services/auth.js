import User from "../models/user";
import bcrypt from "bcryptjs";
import AppError from "../utils/handlers/error_handling.js";
import { generateToken } from "../utils/auth/token_generator.js";

const AuthService = {
    async register(data) {
        const { username, email, password } = data;
        const existingUser = await User.getByUsernameOrEmail(username, email);

        if (existingUser) {
            throw new AppError("Username or email already in use", 400);
        }

        const password_hash = await bcrypt.hash(password, 10);

        const { password: _, ...userData } = data;

        const user = await User.create({
            ...userData,
            password_hash
        });

        return user;
    },

    async login(identifier, password) {
        let user;

        if (identifier.includes("@")) {
            user = await User.getByEmail(identifier);
        } else {
            user = await User.getByUsername(identifier);
        }

        if (!user) {
            throw new AppError("No user found with the provided credentials", 401);
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            throw new AppError("Incorrect password", 401);
        }

        const token = generateToken(user.id);

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            is_verified: user.is_verified,
            token
        };
    }
};

export default AuthService;