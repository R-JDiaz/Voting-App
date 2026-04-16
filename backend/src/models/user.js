import { master_pool, slave_pool } from "../config/db.js";

const master_db = master_pool;
const slave_db = slave_pool;

export const User = {
    async getAll() {
        const [rows] = await slave_db.query(
            'SELECT id, username, email, can_create_election, created_at, updated_at FROM users'
        );
        return rows;
    },

    async getById(id) {
        const [rows] = await slave_db.query(
            `SELECT id, username, email, can_create_election, created_at, updated_at 
             FROM users 
             WHERE id = ?`,
            [id]
        );
        return rows[0];
    },

    async getByUsername(username) {
        const [rows] = await slave_db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
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

    async getByUsernameOrEmail(username, email) {
        const [rows] = await slave_db.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, email]
        );
        return rows[0];
    },

    async create(data) {
        const { username, email, password_hash, can_create_election = false } = data;

        const [result] = await master_db.query(
            `INSERT INTO users 
            (username, email, password_hash, can_create_election, created_at, updated_at)
            VALUES (?, ?, ?, ?, NOW(), NOW())`,
            [username, email, password_hash, can_create_election]
        );

        return {
            id: result.insertId,
            ...data
        };
    },

    async update(id, data) {
        const fields = [];
        const values = [];

        if (data.username !== undefined) {
            fields.push("username = ?");
            values.push(data.username);
        }

        if (data.email !== undefined) {
            fields.push("email = ?");
            values.push(data.email);
        }

        if (data.can_create_election !== undefined) {
            fields.push("can_create_election = ?");
            values.push(data.can_create_election);
        }

        fields.push("updated_at = NOW()");

        if (fields.length === 1) {
            return { affectedRows: 0 };
        }

        const query = `
            UPDATE users
            SET ${fields.join(", ")}
            WHERE id = ?
    `;

        values.push(id);

        const [result] = await master_db.query(query, values);

        return {
            affectedRows: result.affectedRows,
            ...data
        };
    },

    async updatePassword(id, password_hash) {
        const [result] = await master_db.query(
            `UPDATE users 
             SET password_hash = ?, updated_at = NOW()
             WHERE id = ?`,
            [password_hash, id]
        );

        return {           
            affectedRows: result.affectedRows
        };
    },

    async delete(id) {
        const [result] = await master_db.query(
            'DELETE FROM users WHERE id = ?',
            [id]
        );

        return {           
            affectedRows: result.affectedRows
        };
    }
};