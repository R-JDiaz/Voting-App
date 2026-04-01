import { master_pool, slave_pool } from "../config/db";

const master_db = master_pool;
const slave_db = slave_pool;

export const Admin = {
    async getAll() {
        const [rows] = await slave_db.query(
            'SELECT id, username, role, created_at, updated_at FROM admins'
        );
        return rows;
    },

    async getById(id) {
        const [rows] = await slave_db.query(
            'SELECT id, username, role, created_at, updated_at FROM admins WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    async getByUsername(username) {
        const [rows] = await slave_db.query(
            'SELECT * FROM admins WHERE username = ?',
            [username]
        );
        return rows[0];
    },

    async create(data) {
        const { username, password_hash, role } = data;

        const [result] = await master_db.query(
            `INSERT INTO admins 
            (username, password_hash, role, created_at, updated_at)
            VALUES (?, ?, ?, NOW(), NOW())`,
            [username, password_hash, role]
        );

        return {
            id: result.insertId,
            username,
            role
        };
    },

    async update(id, data) {
        const { username, role } = data;

        const [result] = await master_db.query(
            `UPDATE admins 
             SET username = ?, role = ?, updated_at = NOW()
             WHERE id = ?`,
            [username, role, id]
        );

        return result.affectedRows > 0;
    },

    async updatePassword(id, password_hash) {
        const [result] = await master_db.query(
            `UPDATE admins 
             SET password_hash = ?, updated_at = NOW()
             WHERE id = ?`,
            [password_hash, id]
        );

        return result.affectedRows > 0;
    },

    async delete(id) {
        const [result] = await master_db.query(
            'DELETE FROM admins WHERE id = ?',
            [id]
        );

        return result.affectedRows > 0;
    }
};
