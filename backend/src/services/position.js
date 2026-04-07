import { Position } from "../models/position.js";
import AppError from "../utils/handlers/response_handler.js";

const PositionService = {
    async getAllByElectionId(election_id) {
        return Position.getAllByElectionId(election_id);
    },

    async getByPositionId(id) {
        const position = await Position.getByPositionId(id);

        if (!position) {
            throw new AppError(
                "Position not found",
                404,
                "POSITION_NOT_FOUND"
            );
        }

        return position;
    },

    async create(data) {
        return await Position.create(data);
    },

    async update(id, data) {
        const result = await Position.update(id, data);

        if (result.affectedRows === 0) {
            throw new AppError(
                "Position Not Found",
                404,
                "POSITION_NOT_FOUND"
            );
        }

        return result;
    },

    async delete(id) {
        const result = await Position.delete(id);

        if (result.affectedRows === 0) {
            throw new AppError(
                "Position Not Found",
                404,
                "POSITION_NOT_FOUND"
            );
        }
        
        return result;
    }
};

export default PositionService;