const { createProxyMiddleware } = require('https-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/libros',
    createProxyMiddleware({
      target: 'https://localhost:3000/libros',
      changeOrigin: true,
    })
  );
};