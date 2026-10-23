const { sql, getPool } = require('../config/db');

// GET /api/estaciones/:id -> datos de una estación
async function getEstacion(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_estacion', sql.Int, req.params.id)
      .query(`
        SELECT e.*, m.nombre AS nombre_municipalidad
        FROM Estacion e
        JOIN Municipalidad m ON m.id_municipalidad = e.id_municipalidad
        WHERE e.id_estacion = @id_estacion
      `);
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Estación no encontrada.' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/estaciones/:id/accesos
// Body: { nombre, guardia: { nombre, dpi, telefono } }
// Regla 10: un acceso nunca se crea sin su primer guardia. Se guardan los dos
// o ninguno (transacción).
async function crearAcceso(req, res) {
  const { nombre, guardia } = req.body || {};
  if (!nombre || !guardia || !guardia.nombre || !guardia.dpi) {
    return res.status(400).json({
      error: 'Un acceso necesita un nombre y al menos un guardia (nombre y DPI).'
    });
  }

  let tx;
  try {
    const pool = await getPool();
    tx = new sql.Transaction(pool);
    await tx.begin();

    const acceso = await new sql.Request(tx)
      .input('id_estacion', sql.Int, req.params.id)
      .input('nombre', sql.VarChar(100), nombre)
      .query(`
        INSERT INTO Acceso (nombre, id_estacion)
        OUTPUT INSERTED.*
        VALUES (@nombre, @id_estacion)
      `);
    const creado = acceso.recordset[0];

    await new sql.Request(tx)
      .input('nombre', sql.VarChar(100), guardia.nombre)
      .input('dpi', sql.VarChar(20), guardia.dpi)
      .input('telefono', sql.VarChar(20), guardia.telefono || null)
      .input('id_acceso', sql.Int, creado.id_acceso)
      .query(`
        INSERT INTO Guardia (nombre, dpi, telefono, id_acceso)
        VALUES (@nombre, @dpi, @telefono, @id_acceso)
      `);

    await tx.commit();
    res.status(201).json(creado);
  } catch (err) {
    try { if (tx) await tx.rollback(); } catch (e) { /* ya estaba cerrada */ }
    if (err.number === 2627 || err.number === 2601) {
      return res.status(409).json({ error: 'Ya existe un guardia con ese DPI.' });
    }
    if (err.number === 547) {
      return res.status(404).json({ error: 'La estación no existe.' });
    }
    res.status(500).json({ error: err.message });
  }
}

// POST /api/estaciones/:id/accesos/:idAcceso/guardias
// Body: { nombre, dpi, telefono }  -> agrega otro guardia a un acceso existente
async function agregarGuardia(req, res) {
  const { nombre, dpi, telefono } = req.body || {};
  if (!nombre || !dpi) {
    return res.status(400).json({ error: 'El nombre y el DPI del guardia son obligatorios.' });
  }
  try {
    const pool = await getPool();
    // Solo inserta si el acceso realmente pertenece a esa estación.
    const result = await pool.request()
      .input('id_estacion', sql.Int, req.params.id)
      .input('id_acceso', sql.Int, req.params.idAcceso)
      .input('nombre', sql.VarChar(100), nombre)
      .input('dpi', sql.VarChar(20), dpi)
      .input('telefono', sql.VarChar(20), telefono || null)
      .query(`
        INSERT INTO Guardia (nombre, dpi, telefono, id_acceso)
        OUTPUT INSERTED.*
        SELECT @nombre, @dpi, @telefono, a.id_acceso
        FROM Acceso a
        WHERE a.id_acceso = @id_acceso AND a.id_estacion = @id_estacion
      `);
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Ese acceso no existe en esta estación.' });
    }
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    if (err.number === 2627 || err.number === 2601) {
      return res.status(409).json({ error: 'Ya existe un guardia con ese DPI.' });
    }
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getEstacion, crearAcceso, agregarGuardia };
