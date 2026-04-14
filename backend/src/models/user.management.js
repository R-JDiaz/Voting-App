import { User } from "../models/user.js";
import AppError from "../utils/handlers/response_handler.js";

export const UserManagement = {
    async updateUserCanCreatePermission(user_id, status) {
        const data = {};
        data.can_create_election = status;
        const result = await User.update(user_id, data);

        if (result.affectedRows === 0) {
            throw new AppError(
                "User not found or permissions unchanged",
                404,
                "USER_UPDATE_FAILED"
            );
        }
        
        return {
            affectedRows: result.affectedRows
        }
    }
}
