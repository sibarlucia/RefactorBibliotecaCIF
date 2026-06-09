require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const http = require('http');

const app = express();

// ─── Security middleware ──────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
// En desarrollo: permite localhost:3000.  En producción: usa FRONTEND_URL del .env
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir peticiones sin Origin (curl, Postman, etc.) sólo en dev
    if (!origin && process.env.NODE_ENV !== 'production') return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`Origen no permitido por CORS: ${origin}`));
  },
  methods: 'GET,POST,PUT,PATCH,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
}));

// ─── JSON body parser ─────────────────────────────────────────────────────────
app.use(express.json());

// ─── MongoDB connection ───────────────────────────────────────────────────────
mongoose.connect(process.env.DATABASE_URL, {
  serverSelectionTimeoutMS: 5000,
});
const db = mongoose.connection;
db.on('error', (error) => console.error('DB Error:', error));
db.once('open', () => console.log('Conectado a MongoDB'));

// ─── Routes ───────────────────────────────────────────────────────────────────
const librosRouter  = require('./routes/routesLibros');
const authRouter    = require('./routes/routesAuth');

// API pública: sólo lectura
app.use('/api/libros', librosRouter);

// Auth: login para obtener JWT
app.use('/api/auth', authRouter);

// ─── Centralised error handler ────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const HOST = '0.0.0.0';
const PORT = process.env.PORT || 3001;

http.createServer(app).listen(PORT, HOST, () => {
  console.log(`Servidor HTTP en http://${HOST}:${PORT} | env: ${process.env.NODE_ENV || 'development'}`);
});
