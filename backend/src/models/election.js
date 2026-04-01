require('dotenv').config();

const mysql = require('mysql2/promise');
const { master_pool, slave_pool, slave_pool } = require('../config/db');

const master_db = master_pool;
const slave_db = slave_pool;
