const { createProxyMiddleware } = require('https-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/libros',
    createProxyMiddleware({
      target: 'https://localhost:3001/libros',
      changeOrigin: true,
    })
  );
};