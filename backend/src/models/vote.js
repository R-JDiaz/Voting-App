import { master_pool, slave_pool } from "../config/db.js";

const master_db = master_pool;
const slave_db = slave_pool;

export const Vote = {
    async getAllByElectionId(election_id) {
        const [rows] = await slave_db.query(
            'SELECT * FROM votes WHERE election_id = ?',
            [election_id]
        );
        return rows;
    },

    async getById(id) {
        const [rows] = await slave_db.query(
            'SELECT * FROM votes WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    async getByVoterId(voter_id) {
        const [rows] = await slave_db.query(
            'SELECT * FROM votes WHERE voter_id = ?',
            [voter_id]
        );
        return rows;
    },

    async create(data) {
        const { voter_id, election_id, position_id, candidate_id } = data;

        const [result] = await master_db.query(
            `INSERT INTO votes 
            (voter_id, election_id, position_id, candidate_id, created_at)
            VALUES (?, ?, ?, ?, NOW())`,
            [voter_id, election_id, position_id, candidate_id]
        );

        return {
            id: result.insertId,
            ...data
        };
    },

    async delete(id) {
        const [result] = await master_db.query(
            'DELETE FROM votes WHERE id = ?',
            [id]
        );

        return {
            affectedRows: result.affectedRows
        };
    }
};

