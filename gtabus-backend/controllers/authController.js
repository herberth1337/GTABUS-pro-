const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql, getPool } = require('../config/db');

// POST /api/auth/login
async function login(req, res) {
  const { usuario, password } = req.body || {};
  if (!usuario || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son obligatorios.' });
  }
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('usuario', sql.VarChar(50), usuario)
      .query(`
        SELECT id_usuario, nombre, usuario, password_hash, rol, activo
        FROM Usuario WHERE usuario = @usuario
      `);
    const u = result.recordset[0];
    const valido = u && u.activo && await bcrypt.compare(password, u.password_hash);
    if (!valido) {
      // Mismo mensaje para usuario inexistente, inactivo o contraseña mala.
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
    }

    const payload = {
      id_usuario: u.id_usuario,
      usuario: u.usuario,
      nombre: u.nombre,
      rol: u.rol
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h'
    });
    res.json({ token, usuario: payload });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/auth/me
function me(req, res) {
  res.json({ usuario: req.user });
}

module.exports = { login, me };
