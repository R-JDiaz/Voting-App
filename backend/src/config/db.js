const mysql = require('mysql2/promise');
require('dotenv').config();

//CONSTANTS
const DB_NAME = process.env.DB_NAME || 'voting_db';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_HOST = process.env.DB_HOST || '127.0.0.1';

const POOL_WAITFORCON = process.env.POOL_WAITFORCON === 'true';
const POOL_CONLIMIT = Number(process.env.POOL_CONLIMIT) || 10;
const POOL_QLIMIT = Number(process.env.POOL_QLIMIT) || 0;

//DATABASE
const db_config = {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD
}

async function initDatabase() {
    try {
        const con = await mysql.createConnection(db_config);

        await con.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
        console.log(`Database '${DB_NAME}' exists or was created`);
    } catch (err) {
        console.error('Database Connection Failed', err.message);
        process.exit(1);
    } finally {
        if (con) await con.end();
    }
}

//POOL
const pool_config =  {
    ...db_config,
    database: DB_NAME,
    waitForConnections: POOL_WAITFORCON,
    connectionLimit: POOL_CONLIMIT,
    queueLimit: POOL_QLIMIT
}

const master_pool = mysql.createPool(pool_config);
const slave_pool = mysql.createPool(pool_config);

//TEST
async function testConnection() {
    try {
        await master_pool.query('SELECT 1');
        console.log('Master connected succesfully');
    } catch (err) {
        console.error('Master Pool Connection Failed', err.message);
    }
}

(async () => {
    await initDatabase();
    await testConnection();
})
();

module.exports = { master_pool, slave_pool };