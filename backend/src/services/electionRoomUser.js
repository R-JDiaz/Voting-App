import ElectionRoomUser from "../models/electionRoomUser.js";
import AppError from "../utils/handlers/response_handler.js";

const ElectionRoomUserService = {
    async getAll() {
        return await ElectionRoomUser.getAll();
    },

    async getById(id) {
        const user = await ElectionRoomUser.getById(id);

        if (!user) {
            throw new AppError(
                "Room user not found",
                404,
                "ROOM_USER_NOT_FOUND"
            );
        }

        return user;
    },

    async getByRoomId(roomId) {
        return await ElectionRoomUser.getByRoomId(roomId);
    },

    async getByUserId(userId) {
        return await ElectionRoomUser.getByUserId(userId);
    },

    async join(data) {
        return await ElectionRoomUser.join(data);
    },

    async update(id, data) {
        const result = await ElectionRoomUser.update(id, data);

        if (result.affectedRows === 0) {
            throw new AppError(
                "Room user not found",
                404,
                "ROOM_USER_NOT_FOUND"
            );
        }

        return result;
    },

    async delete(id) {
        const result = await ElectionRoomUser.delete(id);

        if (result.affectedRows === 0) {
            throw new AppError(
                "Room user not found",
                404,
                "ROOM_USER_NOT_FOUND"
            );
        }

        return result;
    }
};

export default ElectionRoomUserService;