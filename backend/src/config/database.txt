const mysql = require('mysql2/promise');
require('dotenv').config();

// ---- Master pool ----
const masterPool = mysql.createPool({
  host: process.env.DB_HOST_MASTER || 'mysql_master',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'voteuser',
  password: process.env.DB_PASSWORD || 'votepassword',
  database: process.env.DB_NAME || 'voting_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// ---- Slave pools ----
const slavePool1 = mysql.createPool({
  host: process.env.DB_HOST_SLAVE1 || 'mysql_slave1',
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

const slavePool2 = mysql.createPool({
  host: process.env.DB_HOST_SLAVE2 || 'mysql_slave2',
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

// ---- Test connections on startup ----
async function testConnections() {
  const pools = [
    { name: 'Master', pool: masterPool },
    { name: 'Slave 1', pool: slavePool1 },
    { name: 'Slave 2', pool: slavePool2 },
  ];

  for (const { name, pool } of pools) {
    try {
      const connection = await pool.getConnection();
      console.log(`✓ ${name} connected successfully`);
      connection.release();
    } catch (err) {
      console.error(`✗ ${name} connection failed:`, err.message);
    }
  }
}

let lastUsedSlave = null;

function getAvailableSlave() {
  const slaves = [slavePool1, slavePool2];

  if ( lastUsedSlave != slaves[1]) {
    lastUsedSlave = slaves[1];
    return slaves[1];
  } else {
    lastUsedSlave = slaves[0];
    return slaves[0];
  }
}


// Run the test on startup
// testConnections();

module.exports = { masterPool, slavePool1, slavePool2, getAvailableSlave};