import { useState, useMemo, useCallback } from 'react';
import React from 'react';

// Ícono de descarga (SVG inline, sin dependencias externas)
const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

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
        const traductorProloguista = getFieldValue(libro.traductorProloguista).toLowerCase();

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
        } else if (
          palabrasClave.includes(busquedaMin) ||
          fechaPublicacion.includes(busquedaMin) ||
          traductorProloguista.includes(busquedaMin)
        ) {
          prioridad = 4;
          matches = true;
        }

        return { ...libro, prioridad, matches };
      })
      .filter((libro) => libro.matches)
      .sort((a, b) => a.prioridad - b.prioridad);

    setLibros(resultados);
  }, [busqueda, data]);

  // Descarga toda la base de datos como .txt formateado
  const handleDownload = useCallback(() => {
    const toText = (field) => {
      if (field === null || field === undefined) return null;
      if (typeof field === 'object') {
        const v = field.texto || field.nombre || field.value || field.title;
        return typeof v === 'string' && v.trim() ? v.trim() : null;
      }
      const s = String(field).trim();
      return s && s !== 'undefined' && s !== 'null' ? s : null;
    };

    const pad = (label) => label.padEnd(24, ' ');

    const ahora = new Date();
    const fecha = ahora.toLocaleDateString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });

    const encabezado = [
      'CATÁLOGO — CIF (Centro de Investigación y Formación)',
      `Exportado el: ${fecha}`,
      `Total de registros: ${data.length}`,
      '═'.repeat(56),
    ].join('\n');

    const registros = data.map((libro, i) => {
      const campos = [
        ['Autor',                  libro.autor],
        ['Título',                 libro.titulo],
        ['Título Alternativo',     libro.titulo_alternativo || libro.tituloAlt],
        ['Subtítulo',              libro.subtitulo],
        ['Fecha de Publicación',   libro.fechaPublicacion],
        ['Idioma',                 libro.idioma],
        ['Palabras Clave',         libro.palabrasClave],
        ['Traductor/Prologuista',  libro.traductorProloguista],
        ['TOP',                    libro.signaturaTopografica],
      ];

      const lineas = campos
        .map(([label, value]) => {
          const v = toText(value);
          return v ? `  ${pad(label + ':')} ${v}` : null;
        })
        .filter(Boolean)
        .join('\n');

      return `[${String(i + 1).padStart(4, '0')}]\n${lineas}`;
    });

    const contenido = [encabezado, ...registros].join('\n\n');

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `catalogo_cif_${fecha.replace(/\//g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [data]);

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
        {/* Barra de búsqueda + botón de descarga */}
        <div className="flex justify-center items-center mb-8 w-full gap-2">
          <form onSubmit={handleBusqueda} className="flex w-full max-w-2xl">
            <input
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#EFA600] h-11"
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
          </form>

          {/* Botón sutil para descargar toda la base de datos */}
          <button
            type="button"
            onClick={handleDownload}
            title="Descargar catálogo completo (.txt)"
            className="flex items-center gap-1.5 px-3 py-2 h-11 text-sm text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400 transition-colors shrink-0"
          >
            <DownloadIcon />
            <span className="hidden sm:inline">Descargar</span>
          </button>
        </div>

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
                <p key={label} className="text-gray-700">
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
                {renderField('Traductor/Prologuista', libro.traductorProloguista)}
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
