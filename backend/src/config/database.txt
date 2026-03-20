const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_NAME = process.env.DB_NAME || 'voting_db';

// ---- Temporary connection to create DB if missing ----
async function initDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    console.log(`✅ Database '${DB_NAME}' exists or was created`);

    await connection.end();
  } catch (err) {
    console.error('❌ Failed to create database:', err.message);
    process.exit(1);
  }
}

// ---- Pool config ----
const poolConfig = {
  host: '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// ---- Master pool (writes) ----
const masterPool = mysql.createPool(poolConfig);

// ---- Slave pool (reads) - same as master for XAMPP ----
const slavePool = mysql.createPool(poolConfig);

const slavePool2 = mysql.createPool({
  host: '127.0.0.1', // instead of 'mysql_slave2'
  port: 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'voting_db',
  waitForConnections: true,
  connectionLimit: 10
});

function getAvailableSlave() {
  return slavePool;
}

// ---- Test connection ----
async function testConnections() {
  try {
    const connection = await masterPool.getConnection();
    await connection.query('SELECT 1');
    console.log('✅ Master connected successfully');
    connection.release();
  } catch (err) {
    console.error('❌ Master connection failed:', err.message);
  }
}

// ---- Initialize DB and test connection ----
(async () => {
  await initDatabase();
  await testConnections();
})();

module.exports = { masterPool, slavePool, getAvailableSlave };