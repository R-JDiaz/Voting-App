import { Vote } from "../models/vote.js";
import AppError from "../utils/handlers/response_handler.js";

const VoteService = {
    async getAllByElectionId(election_id) {
        return await Vote.getAllByElectionId(election_id);
    },

    async getById(id) {
        const vote = await Vote.getById(id);

        if (!vote) {
            throw new AppError(
                "Vote not found",
                404,
                "VOTE_NOT_FOUND"
            );
        }

        return vote;
    },

    async getByVoterId(voter_id) {
        const votes = await Vote.getByVoterId(voter_id);

        if (!votes || votes.length === 0) {
            throw new AppError(
                "Votes not found",
                404,
                "VOTES_NOT_FOUND"
            );
        }

        return votes;
    },

    async create(data) {
        return await Vote.create(data);
    },

    async delete(id) {
        const success = await Vote.delete(id);

        if (!success) {
            throw new AppError(
                "Delete failed",
                400,
                "VOTE_DELETE_FAILED"
            );
        }

        return {
            message: "Vote deleted successfully"
        };
    }
};

export default VoteService;