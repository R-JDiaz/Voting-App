const { master_pool, slave_pool } = require('../config/db');

const master_db = master_pool;
const slave_db = slave_pool;

export const Election = {
    async getAll() {
        const [rows]  = await slave_db.query('SELECT * FROM elections');
        return rows;
    },

    async getById(id) {
        const [rows] = await slave_db.query(
            'SELECT * FROM elections WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    async create(data) {
        const { title, description, start_date, end_date, status } = data;

        const [result] = await master_pool.query(
            `INSERT INTO elections (title, description, start_date, end_date, status)
             VALUES (?, ?, ?, ?, ?)`,
            [title, description, start_date, end_date, status]
        );

        return {
            id: result.insertId,
            ...data};
    },

    async update(id, data) {
        const { title, description, start_date, end_date, status } = data;
        
        await master_db.query(
            `UPDATE elections 
            SET title=?, description=?, start_date=?, end_date=?, status=?
            WHERE id=?`,
            [title, description, start_date, end_date, status, id]
        );
    },

    async delete(id) {
        const [result] = await master_db.query('DELETE FROM elections WHERE id=?',
        [id]);
        
        return result.affectedRows > 0;
    }
};