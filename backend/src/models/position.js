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

    async create(positions) {
        if (!positions || positions.length === 0) {
            return [];
        }

        const values = positions.map(pos => [
            pos.election_id,
            pos.name,
            pos.description || null,
            pos.max_votes,
            new Date(),
            new Date()
        ]);

        const [result] = await master_db.query(
            `INSERT INTO positions 
            (election_id, name, description, max_votes, created_at, updated_at)
            VALUES ?`,
            [values]
        );

        return {
            affectedRows: result.affectedRows,
            insertId: result.insertId
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
            affectedRows: result.affectedRows
        };
    },

    async delete(id) {
        const [result] = await master_db.query(
            'DELETE FROM positions WHERE id = ?',
            [id]
        );

        return {
            affectedRows: result.affectedRows
        };
    }
};