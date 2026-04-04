import { User } from "../models/user.js";
import AppError from "../utils/handlers/error_handling.js";

const UserService = {
    async getAll() {
        return await User.getAll();
    },

    async getById(id) {
        const user = await User.getById(id);

        if (!user) {
            throw new AppError("User not found", 404);
        }

        return user;
    },

    async getByEmail(email) {
        const user = await User.getByEmail(email);

        if (!user) {
            throw new AppError("User not found", 404);
        }

        return user;
    },

    async create(data) {
        return await User.create(data);
    },

    async update(id, data) {
        const success = await User.update(id, data);

        if (!success) {
            throw new AppError("Update failed", 400);
        }

        return {
            message: "User updated successfully"
        };
    },

    async updatePassword(id, password_hash) {
        const success = await User.updatePassword(id, password_hash);

        if (!success) {
            throw new AppError("Password update failed", 400);
        }

        return {
            message: "Password updated successfully"
        };
    },

    async delete(id) {
        const success = await User.delete(id);

        if (!success) {
            throw new AppError("Delete failed", 400);
        }

        return {
            message: "User deleted successfully"
        };
    }
};

export default UserService;