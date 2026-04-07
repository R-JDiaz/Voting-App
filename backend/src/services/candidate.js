import { Candidate } from "../models/candidate.js";
import AppError from "../utils/handlers/response_handler.js";

const CandidateService = {
    async getAllByPositionId(position_id) {
        return await Candidate.getAllByPositionId(position_id);
    },

    async getById(id) {
        const result = await Candidate.getById(id);
        
        if (!result) {
            throw new AppError("Candidate Not Found");
        }

        return result;

    },

    async create(data) {
        return await Candidate.create(data);
    },

    async update(id, data) {
        const affectedRows = await Candidate.update(id, data);

        if (affectedRows === 0) {
            throw new AppError("Update failed", 400);
        }

        return affectedRows;
    },

    async delete(id) {
        const affectedRows = await Candidate.delete(id);

        if (affectedRows === 0) {
            throw new AppError("Delete failed", 400);
        }

        return affectedRows;
    }
};

export default CandidateService;