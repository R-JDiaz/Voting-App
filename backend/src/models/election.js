import { master_pool, slave_pool } from '../config/db.js';

const master_db = master_pool;
const slave_db = slave_pool;

const Election = {
    async getAll() {
        const [rows] = await slave_db.query(`
            SELECT id, title, description, start_date, end_date, status,
                   creator_id, is_public, room_code
            FROM elections
        `);
        return rows;
    },

    async getFullById(id) {
        const [rows] = await slave_db.query(
            `SELECT 
                e.id AS election_id,
                e.title AS election_title,
                e.description,
                e.start_date,
                e.end_date,
                e.status,
                e.creator_id,
                e.is_public,
                e.room_code,

                p.id AS position_id,
                p.title AS position_title,

                c.id AS candidate_id,
                c.name AS candidate_name

            FROM elections e
            LEFT JOIN positions p ON p.election_id = e.id
            LEFT JOIN candidates c ON c.position_id = p.id
            WHERE e.id = ?`,
            [id]
        );

        if (rows.length === 0) return null;

        const election = {
            id: rows[0].election_id,
            title: rows[0].election_title,
            description: rows[0].description,
            start_date: rows[0].start_date,
            end_date: rows[0].end_date,
            status: rows[0].status,
            creator_id: rows[0].creator_id,
            is_public: rows[0].is_public,
            room_code: rows[0].room_code,
            positions: []
        };

        const positionMap = new Map();

        rows.forEach(row => {
            if (!row.position_id) return;

            if (!positionMap.has(row.position_id)) {
                positionMap.set(row.position_id, {
                    id: row.position_id,
                    title: row.position_title,
                    candidates: []
                });
            }

            if (row.candidate_id) {
                positionMap.get(row.position_id).candidates.push({
                    id: row.candidate_id,
                    name: row.candidate_name
                });
            }
        });

        election.positions = Array.from(positionMap.values());

        return election;
    },

    async getById(id) {
        const [rows] = await slave_db.query(
            `SELECT id, title, description, start_date, end_date, status,
                    creator_id, is_public, room_code
             FROM elections WHERE id = ?`,
            [id]
        );
        return rows[0];
    },

    async getByCode(code) {
        const [rows] = await slave_db.query(
            `SELECT id, password_hash
             FROM elections WHERE room_code = ?`,
            [code]
        );
        return rows[0];
    },

    async create(data) {
        const { 
            title, 
            description, 
            start_date, 
            end_date, 
            status,
            creator_id,
            is_public,
            room_code,
            password_hash
        } = data;

        const [result] = await master_db.query(
            `INSERT INTO elections 
            (title, description, start_date, end_date, status, creator_id, is_public, room_code, password_hash)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title,
                description ?? null,
                start_date,
                end_date,
                status,
                creator_id,
                is_public ?? true,
                room_code ?? null,
                password_hash ?? null
            ]
        );

        return {
            id: result.insertId,
            ...data
        };
    },

    async update(id, data) {
        const fields = [];
        const values = [];

        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        });

        if (fields.length === 0) {
            return { affectedRows: 0 };
        }

        values.push(id);

        const [result] = await master_db.query(
            `UPDATE elections SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        return {
            affectedRows: result.affectedRows
        };
    },

    async delete(id) {
        const [result] = await master_db.query(
            `DELETE FROM elections WHERE id = ?`,
            [id]
        );

        return {
            affectedRows: result.affectedRows
        };
    }
};

export default Election;