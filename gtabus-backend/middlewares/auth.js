const jwt = require('jsonwebtoken');

// Exige un token JWT válido en el encabezado "Authorization: Bearer <token>".
function verifyToken(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Debes iniciar sesión.' });
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Sesión inválida o expirada.' });
  }
}

// Solo deja pasar a usuarios con rol "admin".
function requireAdmin(req, res, next) {
  if (req.user && req.user.rol === 'admin') return next();
  return res.status(403).json({ error: 'Solo un administrador puede hacer esto.' });
}

module.exports = { verifyToken, requireAdmin };
