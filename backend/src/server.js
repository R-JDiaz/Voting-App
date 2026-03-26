const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const http = require('http');

const { initSocket } = require('./socket');


const { errorHandler, notFound } = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const electionRoutes = require('./routes/electionRoutes');
const positionRoutes = require('./routes/positionRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const userRoutes = require('./routes/userRoutes');
const voteRoutes = require('./routes/voteRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const server = http.createServer(app);

// ===========================
// Initialize Socket
// ===========================

initSocket(server);

// ===========================
// Middleware
// ===========================

app.use(helmet());

/* app.use((req, res, next) => {
  res.setHeader('X-Backend-Name', process.env.BACKEND_NAME);
  next();
});
 */
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 500,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===========================
// Health Check
// ===========================

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server running',
    time: new Date()
  });
});

// backend1:3000
app.get('/api/health', (req, res) => {
  res.json({ ok: true, instance: process.env.BACKEND_NAME });
});

// ===========================
// Routes
// ===========================

app.use('/auth', authRoutes);
app.use('/elections', electionRoutes);
app.use('/', positionRoutes);
app.use('/', candidateRoutes);
app.use('/users', userRoutes);
app.use('/votes', voteRoutes);
app.use('/admin', adminRoutes);

// ===========================
// Error Handling
// ===========================

app.use(notFound);
app.use(errorHandler);

// ===========================
// Start Server
// ===========================

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log('==========================================');
  console.log(' Distributed Voting System API Server ');
  console.log('==========================================');
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log('==========================================');
});