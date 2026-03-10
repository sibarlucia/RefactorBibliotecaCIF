require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const http = require('http');

const app = express();

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
}));

// Database Connection
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

// JSON Middleware
app.use(express.json());

// Routes
const librosRouter = require('./routes/routesLibros.js');
app.use('/libros', librosRouter);

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const HOST = '0.0.0.0';
const PORT = 3001;

// Server Initialization
http.createServer(app).listen(PORT, HOST, () => {
  console.log(`HTTP Server running on host ${HOST} at port ${PORT}`);
});
