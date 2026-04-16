import ElectionRoom from '../models/electionRoom.js';
import AppError from '../utils/handlers/response_handler.js';

const ElectionRoomService = {
    async getAll() {
        return await ElectionRoom.getAll();
    },

    async getById(id) {
        const room = await ElectionRoom.getById(id);

        if (!room) {
            throw new AppError(
                "Election room not found",
                404,
                "ELECTION_ROOM_NOT_FOUND"
            );
        }

        return room;
    },

    async getByElectionId(electionId) {
        return await ElectionRoom.getByElectionId(electionId);
    },

    async create(data) {
        return await ElectionRoom.create(data);
    },

    async update(id, data) {
        const result = await ElectionRoom.update(id, data);

        if (result.affectedRows === 0) {
            throw new AppError(
                "Election room not found",
                404,
                "ELECTION_ROOM_NOT_FOUND"
            );
        }

        return result;
    },

    async delete(id) {
        const result = await ElectionRoom.delete(id);

        if (result.affectedRows === 0) {
            throw new AppError(
                "Election room not found",
                404,
                "ELECTION_ROOM_NOT_FOUND"
            );
        }

        return result;
    }
};

export default ElectionRoomService;