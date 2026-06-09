import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EMPTY_FORM = {
  titulo: '',
  autor: '',
  titulo_alternativo: '',
  subtitulo: '',
  fechaPublicacion: '',
  palabrasClave: '',
  idioma: '',
  signaturaTopografica: '',
};

const Admin = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [libros, setLibros]     = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editId, setEditId]     = useState(null);   // null → crear | id → editar
  const [message, setMessage]   = useState(null);   // { type: 'success'|'error', text }
  const [loading, setLoading]   = useState(false);

  // Headers con JWT para todas las peticiones protegidas
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // Cargar libros al montar
  useEffect(() => {
    fetchLibros();
  }, []);

  async function fetchLibros() {
    try {
      const res = await axios.get('/api/libros');
      setLibros(res.data);
    } catch {
      showMsg('error', 'Error al cargar los libros.');
    }
  }

  function showMsg(type, text) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  }

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titulo || !formData.autor) {
      showMsg('error', 'Título y Autor son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      if (editId) {
        // PATCH – editar libro existente
        await axios.patch(`/api/libros/${editId}`, formData, authHeaders);
        showMsg('success', 'Libro actualizado correctamente.');
      } else {
        // POST – crear nuevo libro
        await axios.post('/api/libros', formData, authHeaders);
        showMsg('success', 'Libro creado correctamente.');
      }
      setFormData(EMPTY_FORM);
      setEditId(null);
      fetchLibros();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al guardar el libro.';
      // Si el token expiró, redirigir al login
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
        navigate('/login');
        return;
      }
      showMsg('error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (libro) => {
    setEditId(libro._id);
    setFormData({
      titulo:               typeof libro.titulo === 'object' ? libro.titulo?.texto || '' : libro.titulo || '',
      autor:                libro.autor || '',
      titulo_alternativo:   libro.titulo_alternativo || '',
      subtitulo:            libro.subtitulo || '',
      fechaPublicacion:     libro.fechaPublicacion || '',
      palabrasClave:        libro.palabrasClave || '',
      idioma:               libro.idioma || '',
      signaturaTopografica: libro.signaturaTopografica || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este libro? Esta acción no se puede deshacer.')) return;
    try {
      await axios.delete(`/api/libros/${id}`, authHeaders);
      showMsg('success', 'Libro eliminado.');
      fetchLibros();
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
        navigate('/login');
        return;
      }
      showMsg('error', 'Error al eliminar el libro.');
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setFormData(EMPTY_FORM);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="https://cifnet.org.ar/">
            <img
              src="https://cifnet.org.ar/wp-content/uploads/2013/10/cif-logo_03.gif"
              alt="CIF Logo"
              className="h-12"
            />
          </a>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Ver catálogo
            </button>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Mensaje de feedback */}
        {message && (
          <div className={`mb-6 p-3 rounded-md text-sm ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Formulario crear / editar */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {editId ? 'Editar Libro' : 'Agregar Nuevo Libro'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'titulo',               label: 'Título *',                 required: true  },
              { name: 'autor',                label: 'Autor *',                  required: true  },
              { name: 'titulo_alternativo',   label: 'Título Alternativo'                        },
              { name: 'subtitulo',            label: 'Subtítulo'                                 },
              { name: 'fechaPublicacion',     label: 'Fecha de Publicación'                      },
              { name: 'palabrasClave',        label: 'Palabras Clave'                            },
              { name: 'idioma',               label: 'Idioma'                                    },
              { name: 'signaturaTopografica', label: 'Signatura Topográfica (TOP)'               },
            ].map(({ name, label, required }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type="text"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required={required}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#EFA600] focus:border-[#EFA600] outline-none"
                />
              </div>
            ))}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-2 px-4 rounded-md text-white font-semibold transition-colors
                  ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#EFA600] hover:bg-[#d99700]'}`}
              >
                {loading ? 'Guardando...' : editId ? 'Actualizar Libro' : 'Guardar Libro'}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Listado de libros */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Libros en la base de datos ({libros.length})
          </h2>

          {libros.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay libros registrados.</p>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {libros.map((libro) => {
                const titulo =
                  typeof libro.titulo === 'object'
                    ? libro.titulo?.texto || JSON.stringify(libro.titulo)
                    : libro.titulo || '(sin título)';

                return (
                  <div
                    key={libro._id}
                    className="flex items-start justify-between border border-gray-200 rounded-md p-3 gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{titulo}</p>
                      <p className="text-sm text-gray-500">{libro.autor || '—'}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(libro)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(libro._id)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
