import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(form.username, form.password);
    if (ok) navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <a href="https://cifnet.org.ar/">
            <img
              src="https://cifnet.org.ar/wp-content/uploads/2013/10/cif-logo_03.gif"
              alt="CIF Logo"
              className="h-14"
            />
          </a>
        </div>

        <h1 className="text-xl font-bold text-gray-800 text-center mb-6">
          Acceso Administrador
        </h1>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuario
            </label>
            <input
              type="text"
              name="username"
              autoComplete="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#EFA600] focus:border-[#EFA600] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#EFA600] focus:border-[#EFA600] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-semibold transition-colors
              ${loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#EFA600] hover:bg-[#d99700]'
              }`}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
