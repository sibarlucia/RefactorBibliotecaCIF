import { useState, useMemo, useCallback } from 'react';
import React from 'react';
import axios from 'axios';

const BuscadorAdmin = ({ data, onUpdate }) => {
  const [busqueda, setBusqueda] = useState('');
  const [libros, setLibros] = useState([]);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({});

  const handleLibros = useCallback((event) => {
    setBusqueda(event.target.value);
  }, []);

  const getFieldValue = (field) => {
    if (!field) return '';
    if (typeof field === 'object') {
      return field.texto || field.toString() || '';
    }
    return String(field);
  };

  const handleBusqueda = useCallback((event) => {
    event.preventDefault();
    if (busqueda.length < 3) {
      setLibros([]);
      return;
    }

    const busquedaMin = busqueda.toLowerCase();

    const resultados = data
      .map((libro) => {
        const autor = getFieldValue(libro.autor).toLowerCase();
        const titulo = getFieldValue(libro.titulo).toLowerCase();
        const tituloAlt = getFieldValue(libro.titulo_alternativo || libro.tituloAlt).toLowerCase();
        const palabrasClave = getFieldValue(libro.palabrasClave).toLowerCase();
        const fechaPublicacion = getFieldValue(libro.fechaPublicacion).toLowerCase();

        let prioridad = 4;
        let matches = false;

        if (autor.includes(busquedaMin)) {
          prioridad = 1;
          matches = true;
        } else if (titulo.includes(busquedaMin)) {
          prioridad = 2;
          matches = true;
        } else if (tituloAlt.includes(busquedaMin)) {
          prioridad = 3;
          matches = true;
        } else if (palabrasClave.includes(busquedaMin) || fechaPublicacion.includes(busquedaMin)) {
          prioridad = 4;
          matches = true;
        }

        return { ...libro, prioridad, matches };
      })
      .filter((libro) => libro.matches)
      .sort((a, b) => a.prioridad - b.prioridad);

    setLibros(resultados);
  }, [busqueda, data]);

  const eliminarLibro = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este libro?')) return;
    try {
      await axios.delete(`/libros/${id}`);
      alert('Libro eliminado');
      onUpdate(); // Refresh data
      setLibros(libros.filter(l => (l._id || l.id) !== id));
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar');
    }
  };

  const iniciarEdicion = (libro) => {
    setEditando(libro._id || libro.id);
    setFormData({
      titulo: getFieldValue(libro.titulo),
      autor: getFieldValue(libro.autor),
      titulo_alternativo: getFieldValue(libro.titulo_alternativo || libro.tituloAlt),
      subtitulo: getFieldValue(libro.subtitulo),
      fechaPublicacion: getFieldValue(libro.fechaPublicacion),
      palabrasClave: getFieldValue(libro.palabrasClave),
      idioma: getFieldValue(libro.idioma),
      signaturaTopografica: getFieldValue(libro.signaturaTopografica)
    });
  };

  const guardarEdicion = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/libros/${editando}`, formData);
      alert('Libro actualizado');
      setEditando(null);
      onUpdate();
      // Optionally update local list
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Error al actualizar');
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="mt-8">
      <form onSubmit={handleBusqueda} className="flex justify-center mb-8 w-full">
        <div className="flex w-full max-w-2xl">
          <input
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#EFA600] h-11"
            value={busqueda}
            type="text"
            placeholder="Buscar para modificar o eliminar 🔍"
            onChange={handleLibros}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-[#EFA600] text-white rounded-r-md hover:bg-[#d99700] transition-colors h-11 font-semibold"
          >
            Buscar
          </button>
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {libros.map((libro) => (
          <div key={libro._id || libro.id} className="bg-white p-4 rounded-lg shadow relative group">
            <button
              onClick={() => eliminarLibro(libro._id || libro.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
              title="Eliminar"
            >
              ✕
            </button>

            <div className="space-y-1 pr-6">
              <p className="text-gray-700"><span className="font-semibold">Autor:</span> {getFieldValue(libro.autor)}</p>
              <p className="text-gray-700"><span className="font-semibold">Título:</span> {getFieldValue(libro.titulo)}</p>
              {libro.titulo_alternativo || libro.tituloAlt ? (
                <p className="text-gray-700"><span className="font-semibold">Título Alt:</span> {getFieldValue(libro.titulo_alternativo || libro.tituloAlt)}</p>
              ) : null}
            </div>

            <button
              onClick={() => iniciarEdicion(libro)}
              className="absolute bottom-2 right-2 text-blue-500 hover:text-blue-700"
              title="Editar"
            >
              🖌️
            </button>
          </div>
        ))}
      </div>

      {editando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Editar Libro</h2>
            <form onSubmit={guardarEdicion} className="space-y-3">
              {Object.keys(formData).map(key => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">{key.replace('_', ' ')}</label>
                  <input
                    type="text"
                    name={key}
                    value={formData[key]}
                    onChange={handleFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              ))}
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setEditando(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#EFA600] text-white rounded hover:bg-[#d99700]"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuscadorAdmin;
