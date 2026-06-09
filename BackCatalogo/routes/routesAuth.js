const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');

/**
 * POST /api/auth/login
 * Body: { username, password }
 * Respuesta: { token }
 *
 * Las credenciales se leen desde .env:
 *   ADMIN_USERNAME   → nombre de usuario
 *   ADMIN_PASSWORD_HASH → hash bcrypt de la contraseña
 *
 * Para generar un hash nuevo desde la terminal:
 *   node -e "require('bcryptjs').hash('MiNuevaPass',10).then(h=>console.log(h))"
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña requeridos.' });
  }

  // Verificar usuario
  if (username !== process.env.ADMIN_USERNAME) {
    return res.status(401).json({ message: 'Credenciales inválidas.' });
  }

  // Verificar contraseña contra el hash almacenado en .env
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!passwordHash) {
    console.error('ADMIN_PASSWORD_HASH no está configurado en .env');
    return res.status(500).json({ message: 'Error de configuración del servidor.' });
  }

  const passwordValid = await bcrypt.compare(password, passwordHash);
  if (!passwordValid) {
    return res.status(401).json({ message: 'Credenciales inválidas.' });
  }

  // Generar JWT
  const token = jwt.sign(
    { username, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );

  res.json({ token, expiresIn: process.env.JWT_EXPIRES_IN || '8h' });
});

module.exports = router;
