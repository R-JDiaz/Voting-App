import ElectionRoomUser from "../models/electionRoomUser.js";
import AppError from "../utils/handlers/response_handler.js";
import ElectionRoomService from "./electionRoom.js";
import dotenv from 'dotenv';
import bcrypt from "bcryptjs";
dotenv.config();

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
        const { election_room_id, user_id } = data;

        const electionRoom = await ElectionRoomService.getById(election_room_id);

        if (!electionRoom) {
            throw new AppError(
                    "Election Room NOT FOUND",
                    404,
                    "ELECTION_ROOM_NOT_FOUND"
                );
        }
        
        if (!Boolean(electionRoom.is_public) && electionRoom.passwordHash != null) {
            const { password } = data;
            const isMatch = bcrypt.compare(password, electionRoom.passwordHash);

            if (!isMatch){
                throw new AppError(
                    "Incorrect password",
                    401,
                    "AUTH_INVALID_PASSWORD"
                );
            }
        }
        
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