const express    = require('express');
const router     = express.Router();
const Libro      = require('../models/modelsLibros');
const verifyToken = require('../middleware/auth');

// ─── Rutas PÚBLICAS (sólo lectura) ────────────────────────────────────────────

// GET /api/libros  →  listar todos
router.get('/', async (req, res) => {
  try {
    const libros = await Libro.find();
    res.json(libros);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/libros/:id  →  obtener uno
router.get('/:id', getLibro, (req, res) => {
  res.json(res.libro);
});

// ─── Rutas PROTEGIDAS (requieren JWT válido) ──────────────────────────────────

// POST /api/libros  →  crear un libro
router.post('/', verifyToken, async (req, res) => {
  const libro = new Libro({
    titulo:                req.body.titulo,
    autor:                 req.body.autor,
    titulo_alternativo:    req.body.titulo_alternativo,
    subtitulo:             req.body.subtitulo,
    fechaPublicacion:      req.body.fechaPublicacion,
    palabrasClave:         req.body.palabrasClave,
    idioma:                req.body.idioma,
    signaturaTopografica:  req.body.signaturaTopografica,
    // Solo se guarda si viene en el body; de lo contrario queda undefined
    traductorProloguista:  req.body.traductorProloguista,
  });

  try {
    const nuevoLibro = await libro.save();
    res.status(201).json(nuevoLibro);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/libros/:id  →  editar un libro (campos parciales)
router.patch('/:id', verifyToken, getLibro, async (req, res) => {
  const campos = [
    'titulo', 'autor', 'titulo_alternativo', 'subtitulo',
    'fechaPublicacion', 'palabrasClave', 'idioma', 'signaturaTopografica',
    'traductorProloguista',
  ];

  campos.forEach((campo) => {
    if (req.body[campo] !== undefined) {
      res.libro[campo] = req.body[campo];
    }
  });

  try {
    const actualizado = await res.libro.save();
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/libros/:id  →  eliminar un libro
router.delete('/:id', verifyToken, getLibro, async (req, res) => {
  try {
    await res.libro.deleteOne();
    res.json({ message: 'Libro eliminado correctamente.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Middleware auxiliar ──────────────────────────────────────────────────────
async function getLibro(req, res, next) {
  let libro;
  try {
    libro = await Libro.findById(req.params.id);
    if (!libro) {
      return res.status(404).json({ message: 'No se encontró el libro.' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.libro = libro;
  next();
}

module.exports = router;
