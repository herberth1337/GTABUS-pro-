const { sql, getPool } = require('../config/db');

// GET /api/municipalidades  (con cuántas líneas y estaciones tiene cada una)
async function getMunicipalidades(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT m.*,
             (SELECT COUNT(*) FROM Linea l WHERE l.id_municipalidad = m.id_municipalidad) AS lineas,
             (SELECT COUNT(*) FROM Estacion e WHERE e.id_municipalidad = m.id_municipalidad) AS estaciones
      FROM Municipalidad m
      ORDER BY m.nombre
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

function validar(body) {
  const nombre = (body.nombre || '').trim();
  const direccion = (body.direccion || '').trim();
  const telefono = (body.telefono || '').trim();
  if (!nombre) return { error: 'El nombre es obligatorio.' };
  if (nombre.length > 100) return { error: 'El nombre no puede pasar de 100 caracteres.' };
  if (direccion.length > 200) return { error: 'La dirección no puede pasar de 200 caracteres.' };
  if (telefono.length > 20) return { error: 'El teléfono no puede pasar de 20 caracteres.' };
  return { nombre, direccion: direccion || null, telefono: telefono || null };
}

async function existeNombre(pool, nombre, exceptoId) {
  const r = await pool.request()
    .input('nombre', sql.VarChar(100), nombre)
    .input('id', sql.Int, exceptoId || 0)
    .query(`
      SELECT 1 AS existe FROM Municipalidad
      WHERE LOWER(nombre) = LOWER(@nombre) AND id_municipalidad <> @id
    `);
  return r.recordset.length > 0;
}

// POST /api/municipalidades  { nombre, direccion, telefono }
async function crearMunicipalidad(req, res) {
  const datos = validar(req.body || {});
  if (datos.error) return res.status(400).json({ error: datos.error });
  try {
    const pool = await getPool();
    if (await existeNombre(pool, datos.nombre)) {
      return res.status(409).json({ error: 'Ya existe una municipalidad con ese nombre.' });
    }
    const result = await pool.request()
      .input('nombre', sql.VarChar(100), datos.nombre)
      .input('direccion', sql.VarChar(200), datos.direccion)
      .input('telefono', sql.VarChar(20), datos.telefono)
      .query(`
        INSERT INTO Municipalidad (nombre, direccion, telefono)
        OUTPUT INSERTED.*
        VALUES (@nombre, @direccion, @telefono)
      `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PUT /api/municipalidades/:id  { nombre, direccion, telefono }
async function actualizarMunicipalidad(req, res) {
  const datos = validar(req.body || {});
  if (datos.error) return res.status(400).json({ error: datos.error });
  const id = Number(req.params.id);
  try {
    const pool = await getPool();
    if (await existeNombre(pool, datos.nombre, id)) {
      return res.status(409).json({ error: 'Ya existe otra municipalidad con ese nombre.' });
    }
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('nombre', sql.VarChar(100), datos.nombre)
      .input('direccion', sql.VarChar(200), datos.direccion)
      .input('telefono', sql.VarChar(20), datos.telefono)
      .query(`
        UPDATE Municipalidad
        SET nombre = @nombre, direccion = @direccion, telefono = @telefono
        OUTPUT INSERTED.*
        WHERE id_municipalidad = @id
      `);
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Municipalidad no encontrada.' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getMunicipalidades, crearMunicipalidad, actualizarMunicipalidad };
