import Election from '../models/election.js';
import AppError from '../utils/handlers/error_handling.js';
import { validateElectionDates } from '../utils/validations/date.js';

const ElectionService = {
    async getAll() {
        return await Election.getAll();
    },

    async getById(id) {
        const election = await Election.getById(id);

        if (!election) {
            throw new AppError('Election not found', 404);
        }

        return election;
    },

    async create(data) {
        const { start_date, end_date } = data;

        validateElectionDates(start_date, end_date);

        return await Election.create(data);
    },

    async update(id, data) {
        const { start_date, end_date } = data;

        validateElectionDates(start_date, end_date);

        const result = await Election.update(id, data);

        if (result.affectedRows === 0) {
            throw new AppError('Election not found', 404);
        }

        return { message: 'Election updated successfully' };
    },

    async delete(id) {
        const result = await Election.delete(id);

        if (result.affectedRows === 0) {
            throw new AppError('Election not found' , 404);
        }

        return { message: 'Election deleted successfully' };
    }
};

export default ElectionService;