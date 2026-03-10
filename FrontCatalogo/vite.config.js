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
    host: '0.0.0.0',  // Esto hace que Vite escuche en todas las interfaces de red
    port: 80,       // El puerto donde corre tu servidor
    proxy: {
      '/libros': 'http://localhost:3001', // Proxy para redirigir las solicitudes de '/libros' al backend
    },
    cors: true, // Habilitar CORS
    hmr: false, // Desactivar Hot Module Replacement si es necesario
  },
})
