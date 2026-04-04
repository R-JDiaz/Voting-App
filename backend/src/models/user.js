import { master_pool, slave_pool } from "../config/db.js";

const master_db = master_pool;
const slave_db = slave_pool;

export const User = {
    async getAll() {
        const [rows] = await slave_db.query(
            'SELECT id, username, email, is_verified, created_at, updated_at FROM users'
        );
        return rows;
    },

    async getById(id) {
        const [rows] = await slave_db.query(
            `SELECT id, username, email, is_verified, created_at, updated_at 
             FROM users 
             WHERE id = ?`,
            [id]
        );
        return rows[0];
    },

    async getByEmail(email) {
        const [rows] = await slave_db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    },

    async create(data) {
        const { username, email, password_hash, is_verified = false } = data;

        const [result] = await master_db.query(
            `INSERT INTO users 
            (username, email, password_hash, is_verified, created_at, updated_at)
            VALUES (?, ?, ?, ?, NOW(), NOW())`,
            [username, email, password_hash, is_verified]
        );

        return {
            id: result.insertId,
            username,
            email,
            is_verified
        };
    },

    async update(id, data) {
        const { username, email, is_verified } = data;

        const [result] = await master_db.query(
            `UPDATE users 
             SET username = ?, 
                 email = ?, 
                 is_verified = ?, 
                 updated_at = NOW()
             WHERE id = ?`,
            [username, email, is_verified, id]
        );

        return result.affectedRows > 0;
    },

    async updatePassword(id, password_hash) {
        const [result] = await master_db.query(
            `UPDATE users 
             SET password_hash = ?, updated_at = NOW()
             WHERE id = ?`,
            [password_hash, id]
        );

        return result.affectedRows > 0;
    },

    async delete(id) {
        const [result] = await master_db.query(
            'DELETE FROM users WHERE id = ?',
            [id]
        );

        return result.affectedRows > 0;
    }
};