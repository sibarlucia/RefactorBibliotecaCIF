import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // En dev, proxea al backend local (puerto 3001).
  // En producción el build estático es servido por Nginx junto con el backend,
  // así que el proxy sólo se usa durante `vite dev`.
  const backendUrl = env.VITE_API_URL || 'http://localhost:3001';

  return {
    plugins: [react()],
    base: '/',
    build: {
      outDir: 'dist',
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      cors: true,
      hmr: false,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          // No reescribimos la ruta: /api/libros → backend /api/libros
        },
      },
    },
  };
});
