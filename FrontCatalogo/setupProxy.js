const { createProxyMiddleware } = require('https-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/libros',
    createProxyMiddleware({
      target: 'https://localhost:80/libros',
      changeOrigin: true,
    })
  );
};