import dotenv from 'dotenv';
import express from 'express';
import { initDatabase , testConnection } from './config/db.js';

dotenv.config();

const app = express();

//CONSTANTS 
const BACKEND_PORT = process.env.BACKEND_PORT;

// Middleware to parse JSON
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

async function start() {
  await initDatabase();
  await testConnection();
  app.listen(BACKEND_PORT, () => {
    console.log(`Server is running on http://localhost:${BACKEND_PORT}`);
  });
}

start();