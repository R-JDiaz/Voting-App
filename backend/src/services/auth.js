import { User } from "../models/user.js";
import RoleService from "../services/role.js";
import bcrypt from "bcryptjs";
import AppError from "../utils/handlers/response_handler.js";
import { generateToken } from "../utils/auth/token_generator.js";

const AuthService = {
    async register(data) {
        const { username, email, password } = data;
        const existingUser = await User.getByUsernameOrEmail(username, email);

        if (existingUser) {
            throw new AppError(
                "Username or email already in use",
                400,
                "AUTH_USER_EXISTS"
            );
        }

        const password_hash = await bcrypt.hash(password, 10);

        const { password: _, ...userData } = data;

        const user = await User.create({
            ...userData,
            password_hash
        });
        const role = await RoleService.getById(user.role_id);
        const token = generateToken(user.id);

        return { 
            user: user,
            role: role.name,
            token: token
        };
    },

    async login(identifier, password) {
        let user;

        if (identifier.includes("@")) {
            user = await User.getByEmail(identifier);
        } else {
            user = await User.getByUsername(identifier);
        }

        if (!user) {
            throw new AppError(
                "No user found with the provided credentials",
                401,
                "AUTH_USER_NOT_FOUND"
            );
        }
        
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            throw new AppError(
                "Incorrect password",
                401,
                "AUTH_INVALID_PASSWORD"
            );
        }

        const token = generateToken(user.id);
        const role = await RoleService.getById(user.role_id);

        return {
            user: user,
            role: role.name,
            token: token
        };
    }
};

export default AuthService;