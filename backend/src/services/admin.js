import { Admin } from "../models/admin.js";
import AppError from "../utils/error_handling.js";

const AdminService = {
    async getAll() {
        return await Admin.getAll();
    },

    async getById(id) {
        const admin = await Admin.getById(id);

        if (!admin) {
            throw new AppError("Admin not found", 404);
        }

        return admin;
    },

    async getByUsername(username) {
        const admin = await Admin.getByUsername(username);

        if (!admin) {
            throw new AppError("Admin not found", 404);
        }

        return admin;
    },

    async create(data) {
        return await Admin.create(data);
    },

    async update(id, data) {
        const success = await Admin.update(id, data);

        if (!success) {
            throw new AppError("Update failed", 400);
        }

        return {
            message: "Admin updated successfully"
        };
    },

    async updatePassword(id, password_hash) {
        const success = await Admin.updatePassword(id, password_hash);

        if (!success) {
            throw new AppError("Password update failed", 400);
        }

        return {
            message: "Password updated successfully"
        };
    },

    async delete(id) {
        const success = await Admin.delete(id);

        if (!success) {
            throw new AppError("Delete failed", 400);
        }

        return {
            message: "Admin deleted successfully"
        };
    }
};

export default AdminService;