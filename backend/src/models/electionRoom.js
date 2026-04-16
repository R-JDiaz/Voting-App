import { master_pool, slave_pool } from '../config/db.js';

const master_db = master_pool;
const slave_db = slave_pool;

const ElectionRoom = {
    async getAll() {
        const [rows] = await slave_db.query('SELECT * FROM election_rooms');
        return rows;
    },

    async getById(id) {
        const [rows] = await slave_db.query(
            'SELECT * FROM election_rooms WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    async getByElectionId(electionId) {
        const [rows] = await slave_db.query(
            'SELECT * FROM election_rooms WHERE election_id = ?',
            [electionId]
        );
        return rows;
    },

    async create(data) {
        const { election_id, creator_id, is_public, room_code } = data;

        const [result] = await master_db.query(
            `INSERT INTO election_rooms 
            (election_id, creator_id, is_public, room_code)
            VALUES (?, ?, ?, ?)`,
            [election_id, creator_id, is_public, room_code]
        );

        return {
            id: result.insertId,
            ...data
        };
    },

    async update(id, data) {
        const { is_public, room_code } = data;

        const [result] = await master_db.query(
            `UPDATE election_rooms 
            SET is_public = ?, room_code = ?
            WHERE id = ?`,
            [is_public, room_code, id]
        );

        return {
            affectedRows: result.affectedRows
        };
    },

    async delete(id) {
        const [result] = await master_db.query(
            'DELETE FROM election_rooms WHERE id = ?',
            [id]
        );

        return {
            affectedRows: result.affectedRows
        };
    }
};

export default ElectionRoom;