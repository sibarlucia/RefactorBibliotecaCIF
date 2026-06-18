import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute  from './components/ProtectedRoute';

import Buscador from './components/buscador';
import Admin    from './components/Admin';
import Login    from './components/Login';
import useLibros from './hooks/useLibros';

import './App.css';

function App() {
  const { data, loading, error } = useLibros();

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Página pública de búsqueda */}
          <Route
            path="/"
            element={
              loading ? (
                <div className="flex items-center justify-center min-h-screen">
                  <p className="text-gray-600">Cargando catálogo…</p>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center min-h-screen">
                  <p className="text-red-600">Error al cargar los datos: {error.message}</p>
                </div>
              ) : (
                <Buscador data={data} />
              )
            }
          />

          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Panel de administración (protegido con JWT) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Cualquier ruta desconocida → inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
