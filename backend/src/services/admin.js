import { Admin} from "../models/admin.js";
import { UserManagement } from "../models/user.management.js";
import AppError from "../utils/handlers/response_handler.js";

const AdminService = {
    async getAll() {
        return await Admin.getAll();
    },

    async getById(id) {
        const admin = await Admin.getById(id);

        if (!admin) {
            throw new AppError(
                "Admin not found",
                404,
                "ADMIN_NOT_FOUND"
            );
        }

        return admin;
    },

    async getByUsername(username) {
        const admin = await Admin.getByUsername(username);

        if (!admin) {
            throw new AppError(
                "Admin not found",
                404,
                "ADMIN_NOT_FOUND"
            );
        }

        return admin;
    },

    async create(data) {
        return await Admin.create(data);
    },

    async update(id, data) {
        const success = await Admin.update(id, data);

        if (!success) {
            throw new AppError(
                "Update failed",
                400,
                "ADMIN_UPDATE_FAILED"
            );
        }

        return {
            message: "Admin updated successfully"
        };
    },

    async updatePassword(id, password_hash) {
        const success = await Admin.updatePassword(id, password_hash);

        if (!success) {
            throw new AppError(
                "Password update failed",
                400,
                "ADMIN_PASSWORD_UPDATE_FAILED"
            );
        }

        return {
            message: "Password updated successfully"
        };
    },

    async delete(id) {
        const success = await Admin.delete(id);

        if (!success) {
            throw new AppError(
                "Delete failed",
                400,
                "ADMIN_DELETE_FAILED"
            );
        }

        return {
            message: "Admin deleted successfully"
        };
    },

    async updateUserCanCreatePermission(user_id, can_create_election) {
        await UserManagement.updateUserCanCreatePermission(user_id, can_create_election);
        return { message: "User permission updated successfully"};
    }
}

export default AdminService;