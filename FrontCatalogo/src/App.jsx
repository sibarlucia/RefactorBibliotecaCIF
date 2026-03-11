import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Buscador from './components/buscador';
import Admin from './components/Admin';
import useLibros from './hooks/useLibros';
import './App.css';

function App() {
  const { data, loading, error } = useLibros();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error al cargar los datos: {error.message}</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Buscador data={data} />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
