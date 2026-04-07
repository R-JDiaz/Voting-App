import { master_pool, slave_pool } from "../config/db.js";

const master_db = master_pool;
const slave_db = slave_pool;

export const Position = {
    async getAllByElectionId(election_id) {
        const [rows] = await slave_db.query(
            'SELECT * FROM positions WHERE election_id = ?',
            [election_id]
        );
        return rows;
    },

    async getByPositionId(id) {
        const [rows] = await slave_db.query(
            'SELECT * FROM positions WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    async create(data) {
        const { election_id, name, description, max_votes } = data;

        const [result] = await master_db.query(
            `INSERT INTO positions 
            (election_id, name, description, max_votes, created_at, updated_at)
            VALUES (?, ?, ?, ?, NOW(), NOW())`,
            [election_id, name, description, max_votes]
        );

        return {
            id:result.insertId,
            ...data
        };
    },

    async update(id, data) {
        const { name, description, max_votes } = data;

        const [result] = await master_db.query(
            `UPDATE positions 
             SET name = ?, description = ?, max_votes = ?, updated_at = NOW()
             WHERE id = ?`,
            [name, description, max_votes, id]
        );

        return {
            affectedRows: result.affectedRows,
            id: result.insertId,
            ...data
        };
    },

    async delete(id) {
        const [result] = await master_db.query(
            'DELETE FROM positions WHERE id = ?',
            [id]
        );

        return {
            affectedRows: result.affectedRows,
            id: result.insertId,
            ...data
        };
    }
};