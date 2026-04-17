import ElectionRoomUser from "../models/electionRoomUser.js";
import AppError from "../utils/handlers/response_handler.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import ElectionService from "./election.js";

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

    // UPDATED
    async getByElectionId(electionId) {
        return await ElectionRoomUser.getByElectionId(electionId);
    },

    async getByUserId(userId) {
        return await ElectionRoomUser.getByUserId(userId);
    },

    async join(data) {
        const { election_id, user_id, password } = data;

        const election = await ElectionService.getById(election_id);

        if (!election.is_public) {
            if (!password) {
                throw new AppError(
                    "Password required",
                    401,
                    "PASSWORD_REQUIRED"
                );
            }

            const isMatch = await bcrypt.compare(
                password,
                election.password_hash
            );

            if (!isMatch) {
                throw new AppError(
                    "Incorrect password",
                    401,
                    "AUTH_INVALID_PASSWORD"
                );
            }
        }

        return await ElectionRoomUser.join({
            election_id,
            user_id
        });
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