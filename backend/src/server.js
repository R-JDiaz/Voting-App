import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import { initDatabase , testConnection } from './config/db.js';

import electionRoutes from './routes/election.js';
import positionRoutes from './routes/position.js';
import candidateRoutes from './routes/candidate.js';
import userRoutes from './routes/user.js';
import voteRoutes from './routes/vote.js';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';


const app = express();

//CONSTANTS 
const BACKEND_PORT = process.env.BACKEND_PORT;

// Middlewares
app.use(express.json());

//ROUTES
app.use('/elections', electionRoutes);
app.use('/positions', positionRoutes);
app.use('/candidates', candidateRoutes);
app.use('/users', userRoutes);
app.use('/votes', voteRoutes);
app.use('/admins', adminRoutes);
app.use('/auth', authRoutes);

app.use((err, req, res, next) => {
    console.error(err);

    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        status: err.status || 500,
        code: err.code || "INTERNAL_SERVER_ERROR",
        message: err.message || "Internal Server Error",
        errors: err.errors
    });

});

async function start() {
  await initDatabase();
  await testConnection();
  app.listen(BACKEND_PORT, () => {
    console.log(`Server is running on http://localhost:${BACKEND_PORT}`);
  });
}

start();