import { master_pool } from "../config/db.js";

const connection = master_pool;

const Role = {
    async getAll() {
        const [rows] = await connection.query(`
            SELECT * FROM roles
        `);
        return rows;
    },

    async getById(id) {
        const [rows] = await connection.query(`
            SELECT * FROM roles WHERE id = ?
        `, [id]);

        return rows[0] || null;
    },

    async getByName(name) {
        const [rows] = await connection.query(`
            SELECT * FROM roles WHERE name = ?
        `, [name]);

        return rows[0] || null;
    },

    async create(name) {
        const [result] = await connection.query(`
            INSERT INTO roles (name)
            VALUES (?)
        `, [name]);

        return {
            id: result.insertId,
            name
        };
    },

    async delete(id) {
        const [result] = await connection.query(`
            DELETE FROM roles WHERE id = ?
        `, [id]);

        return result.affectedRows > 0;
    }
};

export default Role;