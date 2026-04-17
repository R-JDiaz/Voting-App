import { master_pool, slave_pool } from '../config/db.js';

const master_db = master_pool;
const slave_db = slave_pool;

const ElectionRoomUser = {
    async getAll() {
        const [rows] = await slave_db.query(
            'SELECT * FROM election_room_users'
        );
        return rows;
    },

    async getById(id) {
        const [rows] = await slave_db.query(
            'SELECT * FROM election_room_users WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    async getByElectionId(electionId) {
        const [rows] = await slave_db.query(
            'SELECT * FROM election_room_users WHERE election_id = ?',
            [electionId]
        );
        return rows;
    },

    async getByUserId(userId) {
        const [rows] = await slave_db.query(
            'SELECT * FROM election_room_users WHERE user_id = ?',
            [userId]
        );
        return rows;
    },

    async join(data) {
        const { election_id, user_id } = data;

        const [result] = await master_db.query(
            `INSERT INTO election_room_users 
            (election_id, user_id)
            VALUES (?, ?)`,
            [election_id, user_id]
        );

        return {
            id: result.insertId,
            election_id,
            user_id,
            is_blocked: false
        };
    },

    async update(id, data) {
        const { is_blocked } = data;

        const [result] = await master_db.query(
            `UPDATE election_room_users
            SET is_blocked = ?
            WHERE id = ?`,
            [is_blocked, id]
        );

        return {
            affectedRows: result.affectedRows
        };
    },

    async delete(id) {
        const [result] = await master_db.query(
            'DELETE FROM election_room_users WHERE id = ?',
            [id]
        );

        return {
            affectedRows: result.affectedRows
        };
    }
};

export default ElectionRoomUser;