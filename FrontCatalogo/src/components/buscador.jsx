import { useState, useMemo, useCallback } from 'react';
import React from 'react';

const Buscador = ({ data }) => {
  const [busqueda, setBusqueda] = useState('');
  const [libros, setLibros] = useState([]);

  const handleLibros = useCallback((event) => {
    setBusqueda(event.target.value);
  }, []);

  const handleBusqueda = useCallback((event) => {
    event.preventDefault();
    if (busqueda.length < 3) {
      setLibros([]);
      return;
    }

    const busquedaMin = busqueda.toLowerCase();

    const getFieldValue = (field) => {
      if (!field) return '';
      if (typeof field === 'object') {
        return field.texto || field.toString() || '';
      }
      return String(field);
    };

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

  const librosFiltrados = useMemo(() => libros, [libros]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <a href="https://cifnet.org.ar/">
            <img
              src="https://cifnet.org.ar/wp-content/uploads/2013/10/cif-logo_03.gif"
              alt="CIF Logo"
              className="h-12"
            />
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleBusqueda} className="flex justify-center mb-8 w-full">
          <div className="flex w-full max-w-2xl">
            <input
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-11"
              value={busqueda}
              type="text"
              placeholder="Buscar en el catálogo 🔍"
              onChange={handleLibros}
            />
            <button
              type="submit"
              className="px-6 py-2 bg-[#EFA600] text-white rounded-r-md hover:bg-[#d99700] transition-colors focus:outline-none focus:ring-2 focus:ring-[#EFA600] h-11 flex items-center justify-center font-semibold"
            >
              Buscar
            </button>
          </div>
        </form>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {librosFiltrados.map((libro) => {
            const renderField = (label, value) => {
              if (!value) return null;
              let displayValue = value;
              if (typeof value === 'object') {
                displayValue = value.texto || JSON.stringify(value);
              }
              if (!displayValue || displayValue === 'undefined' || displayValue === 'null') return null;

              return (
                <p className="text-gray-700">
                  <span className="font-semibold">{label}:</span> {displayValue}
                </p>
              );
            };

            return (
              <div key={libro._id || libro.id} className="bg-white p-4 rounded-lg shadow">
                {renderField('Autor', libro.autor)}
                {renderField('Título', libro.titulo)}
                {renderField('Título Alternativo', libro.titulo_alternativo || libro.tituloAlt)}
                {renderField('Subtítulo', libro.subtitulo)}
                {renderField('Fecha de Publicación', libro.fechaPublicacion)}
                {renderField('Idioma', libro.idioma)}
                {renderField('Palabras Clave', libro.palabrasClave)}
                {renderField('TOP', libro.signaturaTopografica)}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Buscador;
