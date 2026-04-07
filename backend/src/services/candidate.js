import { Candidate } from "../models/candidate.js";
import AppError from "../utils/handlers/response_handler.js";

const CandidateService = {
    async getAllByPositionId(position_id) {
        return await Candidate.getAllByPositionId(position_id);
    },

    async getById(id) {
        const result = await Candidate.getById(id);
        
        if (!result) {
            throw new AppError(
                "Candidate not found",
                404,
                "CANDIDATE_NOT_FOUND"
            );
        }

        return result;
    },

    async create(data) {
        const result = await Candidate.create(data);

        if (!result || result.affectedRows === 0) {
            throw new AppError(
                "Failed to create candidate",
                400,
                "CANDIDATE_CREATE_FAILED"
            );
        }

        return result;
    },

    async update(id, data) {
        const result = await Candidate.update(id, data);

        if (!result || result.affectedRows === 0) {
            throw new AppError(
                "Candidate not found",
                404,
                "CANDIDATE_NOT_FOUND"
            );
        }

        return result;
    },

    async delete(id) {
        const result = await Candidate.delete(id);

        if (!result || result.affectedRows === 0) {
            throw new AppError(
                "Candidate not found",
                404,
                "CANDIDATE_NOT_FOUND"
            );
        }

        return result;
    }
};

export default CandidateService;