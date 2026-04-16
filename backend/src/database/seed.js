import { master_pool } from '../config/db.js';

const connection = master_pool;

async function seed() {
    try {
        console.log('🌱 Seeding database...');

        // =========================
        // 1. ROLES
        // =========================
        const [roles] = await connection.query(`SELECT COUNT(*) as count FROM roles`);
        
        if (roles[0].count === 0) {
            await connection.query(`
                INSERT INTO roles (name) VALUES 
                ('admin'),
                ('user'),
                ('moderator')
            `);
            console.log('✅ Roles seeded');
        }

        // =========================
        // 2. USERS
        // =========================
        const [users] = await connection.query(`SELECT COUNT(*) as count FROM users`);

        if (users[0].count === 0) {
            await connection.query(`
                INSERT INTO users (username, email, password_hash, role_id, can_create_election)
                VALUES 
                ('Admin User', 'admin@example.com', 'hashed_password_here', 1, TRUE),
                ('Normal User', 'user@example.com', 'hashed_password_here', 2, FALSE)
            `);
            console.log('✅ Users seeded');
        }

        // =========================
        // 3. ELECTION
        // =========================
        const [elections] = await connection.query(`SELECT COUNT(*) as count FROM elections`);

        if (elections[0].count === 0) {
            await connection.query(`
                INSERT INTO elections (title, description, start_date, end_date, status)
                VALUES 
                (
                    'Student Council Election 2026',
                    'Annual election for student council positions',
                    NOW(),
                    DATE_ADD(NOW(), INTERVAL 7 DAY),
                    'ongoing'
                )
            `);
            console.log('✅ Elections seeded');
        }

        // =========================
        // 4. POSITIONS
        // =========================
        const [positions] = await connection.query(`SELECT COUNT(*) as count FROM positions`);

        if (positions[0].count === 0) {
            await connection.query(`
                INSERT INTO positions (election_id, name, description, max_votes)
                VALUES 
                (1, 'President', 'School President', 1),
                (1, 'Vice President', 'School Vice President', 1),
                (1, 'Secretary', 'School Secretary', 1)
            `);
            console.log('✅ Positions seeded');
        }

        // =========================
        // 5. CANDIDATES
        // =========================
        const [candidates] = await connection.query(`SELECT COUNT(*) as count FROM candidates`);

        if (candidates[0].count === 0) {
            await connection.query(`
                INSERT INTO candidates (position_id, name, party_list, bio, image_url)
                VALUES 
                (1, 'John Doe', 'Unity Party', 'Leader with experience', ''),
                (1, 'Jane Smith', 'Progress Party', 'Focused on innovation', ''),
                (2, 'Mark Lee', 'Unity Party', 'Experienced vice leader', ''),
                (3, 'Anna Cruz', 'Service Party', 'Organized and reliable', '')
            `);
            console.log('✅ Candidates seeded');
        }

        // =========================
        // 6. ELECTION ROOMS
        // =========================
        const [rooms] = await connection.query(`SELECT COUNT(*) as count FROM election_rooms`);

        if (rooms[0].count === 0) {
            await connection.query(`
                INSERT INTO election_rooms (election_id, creator_id, is_public, room_code)
                VALUES 
                (1, 1, TRUE, 'ROOM-ABC123')
            `);
            console.log('✅ Election rooms seeded');
        }

        // =========================
        // 7. ROOM USERS
        // =========================
        const [roomUsers] = await connection.query(`SELECT COUNT(*) as count FROM election_room_users`);

        if (roomUsers[0].count === 0) {
            await connection.query(`
                INSERT INTO election_room_users (election_room_id, user_id, is_blocked)
                VALUES 
                (1, 1, FALSE),
                (1, 2, FALSE)
            `);
            console.log('✅ Room users seeded');
        }

        console.log('🎉 Seeding completed successfully!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
    }
}

seed();