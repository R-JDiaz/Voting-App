import { Position } from "../models/position.js";
import AppError from "../utils/error_handling.js";

const PositionService = {
    async getAllByElectionId(election_id) {
        return Position.getAllByElectionId(election_id);
    },

    async getByPositionId(id) {
        const position = await Position.getByPositionId(id);

        if (!position) {
            throw new AppError("Position not found", 404);
        }

        return position;
    },

    async create(data) {
        return await Position.create(data);
    },

    async update(id, data) {
        const result = await Position.update(id, data);

        if (result.affectedRows === 0) {
            throw new AppError("No changes made or update failed", 400);
        }

        return result;
    },

    async delete(id) {
        const result = await Position.delete(id);

        if (result.affectedRows === 0) {
            throw new AppError("Position Not Found", 404);
        }
        
        return result;
    }
};

export default PositionService;