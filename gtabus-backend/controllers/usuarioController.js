const bcrypt = require('bcryptjs');
const { sql, getPool } = require('../config/db');

// GET /api/usuarios
async function listar(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT id_usuario, nombre, usuario, rol, activo, fecha_creacion
      FROM Usuario ORDER BY rol, usuario
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/usuarios  { nombre, usuario, password, rol }
async function crear(req, res) {
  const { nombre, usuario, password, rol } = req.body || {};
  if (!nombre || !usuario || !password || !rol) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }
  if (!['admin', 'usuario'].includes(rol)) {
    return res.status(400).json({ error: 'Rol inválido.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const pool = await getPool();
    const result = await pool.request()
      .input('nombre', sql.VarChar(100), nombre)
      .input('usuario', sql.VarChar(50), usuario)
      .input('hash', sql.VarChar(100), hash)
      .input('rol', sql.VarChar(10), rol)
      .query(`
        INSERT INTO Usuario (nombre, usuario, password_hash, rol)
        OUTPUT INSERTED.id_usuario, INSERTED.nombre, INSERTED.usuario,
               INSERTED.rol, INSERTED.activo, INSERTED.fecha_creacion
        VALUES (@nombre, @usuario, @hash, @rol)
      `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    if (err.number === 2627 || err.number === 2601) {
      return res.status(409).json({ error: 'Ese nombre de usuario ya existe.' });
    }
    res.status(500).json({ error: err.message });
  }
}

// PUT /api/usuarios/:id/estado  { activo: true|false }
async function cambiarEstado(req, res) {
  const id = Number(req.params.id);
  if (id === req.user.id_usuario) {
    return res.status(400).json({ error: 'No puedes desactivar tu propia cuenta.' });
  }
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('activo', sql.Bit, !!req.body.activo)
      .query(`
        UPDATE Usuario SET activo = @activo
        OUTPUT INSERTED.id_usuario, INSERTED.activo
        WHERE id_usuario = @id
      `);
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PUT /api/usuarios/:id/password  { password }
async function cambiarPassword(req, res) {
  const { password } = req.body || {};
  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, Number(req.params.id))
      .input('hash', sql.VarChar(100), hash)
      .query(`
        UPDATE Usuario SET password_hash = @hash
        OUTPUT INSERTED.id_usuario
        WHERE id_usuario = @id
      `);
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { listar, crear, cambiarEstado, cambiarPassword };
