const jwt = require('jsonwebtoken');

/**
 * Middleware que verifica el JWT enviado en el header Authorization.
 * Uso: router.post('/', verifyToken, handlerFn)
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Token de acceso requerido.' });
  }

  // El header debe tener el formato:  Bearer <token>
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Formato de token inválido. Usa: Bearer <token>' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // adjunta el payload al request
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'El token ha expirado. Iniciá sesión nuevamente.' });
    }
    return res.status(403).json({ message: 'Token inválido.' });
  }
}

module.exports = verifyToken;
