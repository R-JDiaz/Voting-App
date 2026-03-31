require('dotenv').config();

const express = require('express');
const app = express();

const BACKEND_PORT = process.env.BACKEND_PORT;

// Middleware to parse JSON
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.listen(BACKEND_PORT, () => {
  console.log(`Server is running on http://localhost:${BACKEND_PORT}`);
});