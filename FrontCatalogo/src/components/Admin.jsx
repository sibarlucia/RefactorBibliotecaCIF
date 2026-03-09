import React, { useState } from 'react';
import axios from 'axios';

const Admin = () => {
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    titulo_alternativo: '',
    subtitulo: '',
    fechaPublicacion: '',
    palabrasClave: '',
    idioma: '',
    signaturaTopografica: ''
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titulo || !formData.autor) {
      setMessage('Título y Autor son obligatorios.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Using /libros directly because of Vite proxy
      await axios.post('/libros', formData);
      setMessage('Libro creado con éxito.');
      setFormData({
        titulo: '',
        autor: '',
        titulo_alternativo: '',
        subtitulo: '',
        fechaPublicacion: '',
        palabrasClave: '',
        idioma: '',
        signaturaTopografica: ''
      });
    } catch (error) {
      console.error('Error al crear el libro:', error);
      setMessage('Error al crear el libro. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 style={{ color: 'black', fontWeight: 'bold' }} className="text-2xl font-bold mb-6 text-center">Administración: Crear Nuevo Libro</h1>

          {message && (
            <div className={`mb-4 p-3 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
          <h2 style={{ color: 'black', fontWeight: 'bold' }} className="text-xl font-semibold mb-4">Detalles del Libro</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Título *</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Autor *</label>
              <input
                type="text"
                name="autor"
                value={formData.autor}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Título Alternativo</label>
              <input
                type="text"
                name="titulo_alternativo"
                value={formData.titulo_alternativo}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Subtítulo</label>
              <input
                type="text"
                name="subtitulo"
                value={formData.subtitulo}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de Publicación</label>
              <input
                type="text"
                name="fechaPublicacion"
                value={formData.fechaPublicacion}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Palabras Clave</label>
              <input
                type="text"
                name="palabrasClave"
                value={formData.palabrasClave}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Idioma</label>
              <input
                type="text"
                name="idioma"
                value={formData.idioma}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Signatura Topográfica</label>
              <input
                type="text"
                name="signaturaTopografica"
                value={formData.signaturaTopografica}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#EFA600] hover:bg-[#d99700] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EFA600] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Guardando...' : 'Guardar Libro'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admin;
