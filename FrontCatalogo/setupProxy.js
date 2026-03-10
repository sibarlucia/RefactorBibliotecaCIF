const { createProxyMiddleware } = require('https-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/libros',
    createProxyMiddleware({
      target: 'http://200.58.107.119/libros',
      changeOrigin: true,
    })
  );
};