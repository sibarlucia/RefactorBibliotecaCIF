// ecosystem.config.cjs
// Usado por PM2 para mantener el backend corriendo como servicio.
// Instalar PM2: npm install -g pm2
// Iniciar:      pm2 start ecosystem.config.cjs
// Auto-inicio:  pm2 startup && pm2 save

module.exports = {
  apps: [
    {
      name:         'biblioteca-cif-backend',
      script:       './BackCatalogo/server.js',
      cwd:          '/var/www/biblioteca-cif-backend',  // ← ajustá la ruta
      node_args:    '--max-old-space-size=256',
      instances:    1,
      exec_mode:    'fork',
      autorestart:  true,
      watch:        false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT:     3001,
        // Las demás variables (DATABASE_URL, JWT_SECRET, etc.) van en el .env
      },
      // Logs
      out_file:  '/var/log/pm2/biblioteca-cif-out.log',
      error_file:'/var/log/pm2/biblioteca-cif-error.log',
      time:      true,
    },
  ],
};
