import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Si la aplicación está en el dominio raíz
  build: {
    outDir: 'dist',
  },
  server: {
    host: '0.0.0.0', 
    allowedHosts: [
      'catalogo.cifnet.org.ar' // Agrega tu dominio aquí
    ],
    port: 3000,       // El puerto donde corre tu servidor
    proxy: {
      '/libros': 'http://200.58.107.119:3001', // Proxy para redirigir las solicitudes de '/libros' al backend
      //'/libros': 'http://localhost:3001',
    },
    cors: true, // Habilitar CORS
    hmr: false, // Desactivar Hot Module Replacement si es necesario
  },
})
