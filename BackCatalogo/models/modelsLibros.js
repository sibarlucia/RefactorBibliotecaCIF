const mongoose = require('mongoose');

const librosSchema = new mongoose.Schema({
  titulo: {
    type: Object,
  },
  autor: {
    type: String,
  },
  titulo_alternativo: {
    type: String,
  },
  subtitulo: {
    type: String,
  },
  fechaPublicacion: {
    type: String,
  },
  palabrasClave: {
    type: String,
  },
  idioma: {
    type: String,
  },
  signaturaTopografica: {
    type: String,
  },
  // Campo opcional — los libros existentes que no lo tienen simplemente
  // devolverán undefined/null, sin afectar ninguna funcionalidad previa.
  traductorProloguista: {
    type: String,
  },
});

module.exports = mongoose.model('Libros', librosSchema);
