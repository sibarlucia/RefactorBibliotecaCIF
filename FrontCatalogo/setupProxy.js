const { createProxyMiddleware } = require('https-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/libros',
    createProxyMiddleware({
      target: 'https://127.0.0.1:3001/libros',
      changeOrigin: true,
    })
  );
};