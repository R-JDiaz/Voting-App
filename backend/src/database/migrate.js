import { master_pool } from '../config/db.js';

const connection = master_pool;

async function migrate() {
    try {
        console.log('Running migrations...');

        // Roles Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS roles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) UNIQUE NOT NULL
            )
        `);

        // Users Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role_id INT DEFAULT NULL,
                can_create_election BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (role_id) REFERENCES roles(id)
                    ON DELETE SET NULL
                    ON UPDATE CASCADE
            )
        `);

        // Elections Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS elections (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                start_date DATETIME,
                end_date DATETIME,
                status ENUM('upcoming', 'ongoing', 'ended') DEFAULT 'upcoming',
                creator_id INT NOT NULL,
                is_public BOOLEAN DEFAULT TRUE,
                room_code VARCHAR(50) UNIQUE,
                password_hash VARCHAR(255) NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (creator_id) REFERENCES users(id)
                    ON DELETE CASCADE
            )
        `);

        // Positions Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS positions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                election_id INT,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                max_votes INT DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (election_id) REFERENCES elections(id)
                    ON DELETE CASCADE
            )
        `);

        // Candidates Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS candidates (
                id INT AUTO_INCREMENT PRIMARY KEY,
                position_id INT,
                name VARCHAR(255) NOT NULL,
                party_list VARCHAR(255),
                bio TEXT,
                image_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (position_id) REFERENCES positions(id)
                    ON DELETE CASCADE
            )
        `);

        // Election Room Users Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS election_room_users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                election_id INT NOT NULL,
                user_id INT NOT NULL,
                is_blocked BOOLEAN DEFAULT FALSE,
                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_election_user (election_id, user_id),
                FOREIGN KEY (election_id) REFERENCES elections(id)
                    ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id)
                    ON DELETE CASCADE
            )
        `);

        // Votes Table (MOVED LAST - FIXED)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS votes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                voter_id INT NOT NULL,
                election_id INT NOT NULL,
                position_id INT NOT NULL,
                candidate_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (voter_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE,
                FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE CASCADE,
                FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
            )
        `);

        console.log('✅ Migration completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
    }
}

migrate();