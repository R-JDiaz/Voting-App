import bcrypt from 'bcryptjs';
import Election from '../models/election.js';
import AppError from '../utils/handlers/response_handler.js';

const ElectionService = {
    async getAll() {
        return await Election.getAll();
    },

    async getById(id) {
        const election = await Election.getById(id);

        if (!election) {
            throw new AppError(
                "Election not found",
                404,
                "ELECTION_NOT_FOUND"
            );
        }

        return election;
    },

    async getFullById(id) {
        const election = await Election.getFullById(id);

        if (!election) {
            throw new AppError(
                "Election not found",
                404,
                "ELECTION_NOT_FOUND"
            );
        }

        return election;
    },

    async create(data) {
        const payload = { ...data };

        if (payload.password) {
            payload.password_hash = await bcrypt.hash(payload.password, 10);
            delete payload.password;
        }

        return await Election.create(payload);
    },

    async update(id, data) {
        const result = await Election.update(id, data);

        if (result.affectedRows === 0) {
            throw new AppError(
                "Election not found",
                404,
                "ELECTION_NOT_FOUND"
            );
        }

        return result;
    },

    async delete(id) {
        const result = await Election.delete(id);

        if (result.affectedRows === 0) {
            throw new AppError(
                "Election not found",
                404,
                "ELECTION_NOT_FOUND"
            );
        }

        return result;
    }
};

export default ElectionService;