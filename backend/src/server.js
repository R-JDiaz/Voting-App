import dotenv from 'dotenv';
import express from 'express';

import { initDatabase , testConnection } from './config/db.js';

import electionRoutes from './routes/election.js';
import positionRoutes from './routes/position.js';
import candidateRoutes from './routes/candidate.js';
import voterRoutes from './routes/voter.js';
import voteRoutes from './routes/vote.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();

//CONSTANTS 
const BACKEND_PORT = process.env.BACKEND_PORT;

// Middlewares
app.use(express.json());

//ROUTES
app.use('/elections', electionRoutes);
app.use('/positions', positionRoutes);
app.use('/candidates', candidateRoutes);
app.use('/voters', voterRoutes);
app.use('/votes', voteRoutes);
app.use('/admins', adminRoutes);


async function start() {
  await initDatabase();
  await testConnection();
  app.listen(BACKEND_PORT, () => {
    console.log(`Server is running on http://localhost:${BACKEND_PORT}`);
  });
}

start();