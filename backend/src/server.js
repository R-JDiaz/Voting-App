import dotenv from 'dotenv';
import express from 'express';
import { initDatabase , testConnection } from './config/db.js';
import { Router } from 'express';
dotenv.config();

const app = express();
import electionRoutes from './routes/elections.js';

//CONSTANTS 
const BACKEND_PORT = process.env.BACKEND_PORT;

//ROUTES
app.use('/elections', electionRoutes);

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