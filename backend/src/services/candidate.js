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
        const { candidates } = data;

        if (!Array.isArray(candidates) || candidates.length === 0) {
            throw new AppError(
                "Invalid candidates data. Must be a non-empty array.",
                400,
                "INVALID_CANDIDATE_DATA"
            );
        }

        const result = await Candidate.create(candidates);

        if (!result || result.affectedRows === 0) {
            throw new AppError(
                "Failed to create candidates",
                400,
                "CANDIDATE_CREATE_FAILED"
            );
        }

        return {
            affectedRows: result.affectedRows,
            insertId: result.insertId
        };
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