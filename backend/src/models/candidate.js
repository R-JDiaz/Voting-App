import { master_pool, slave_pool } from "../config/db.js";

const master_db = master_pool;
const slave_db = slave_pool;

export const Candidate = {
    async getAllByPositionId(position_id) {
        const [rows] = await slave_db.query(
            'SELECT * FROM candidates WHERE position_id = ?',
            [position_id]
        );
        return rows;
    },

    async getById(id) {
        const [rows] = await slave_db.query(
            'SELECT * FROM candidates WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    async create(data) {
        const { position_id, name, party_list, bio, image_url } = data;

        const [result] = await master_db.query(
            `INSERT INTO candidates 
            (position_id, name, party_list, bio, image_url, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            [position_id, name, party_list || null, bio, image_url || null]
        );

        return {
            id: result.insertId,
            ...data
        };
    },

    async update(id, data) {
        const { name, party_list, bio, image_url } = data;

        const [result] = await master_db.query(
            `UPDATE candidates 
             SET name = ?, 
                 party_list = ?, 
                 bio = ?, 
                 image_url = ?, 
                 updated_at = NOW()
             WHERE id = ?`,
            [name, party_list || null, bio, image_url, id]
        );

        return {
            affectedRows: result.affectedRows
        };
    },

    async delete(id) {
        const [result] = await master_db.query(
            'DELETE FROM candidates WHERE id = ?',
            [id]
        );

        return {
            affectedRows: result.affectedRows
        };
    }
};