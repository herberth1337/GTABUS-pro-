const { sql, getPool } = require('../config/db');

async function getEstaciones(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT e.*, m.nombre AS nombre_municipalidad
      FROM Estacion e
      JOIN Municipalidad m ON m.id_municipalidad = e.id_municipalidad
      ORDER BY e.nombre
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/estaciones/:id/accesos -> Regla 3, con guardias (Regla 10)
async function getAccesosConGuardias(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_estacion', sql.Int, req.params.id)
      .query(`
        SELECT a.id_acceso, a.nombre AS acceso,
               g.id_guardia, g.nombre AS guardia, g.telefono
        FROM Acceso a
        LEFT JOIN Guardia g ON g.id_acceso = a.id_acceso
        WHERE a.id_estacion = @id_estacion
        ORDER BY a.nombre
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/estaciones/:id/distancia/:id2 -> Regla 12
async function getDistanciaEntreEstaciones(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('origen', sql.Int, req.params.id)
      .input('destino', sql.Int, req.params.id2)
      .query(`
        SELECT le1.id_linea, le1.distancia_siguiente_km
        FROM LineaEstacion le1
        JOIN LineaEstacion le2
          ON le2.id_linea = le1.id_linea AND le2.orden = le1.orden + 1
        WHERE le1.id_estacion = @origen AND le2.id_estacion = @destino
      `);
    if (result.recordset.length === 0) {
      return res.status(404).json({ mensaje: 'No hay una conexión directa registrada entre esas estaciones.' });
    }
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function crearEstacion(req, res) {
  const { nombre, direccion, latitud, longitud, id_municipalidad } = req.body;
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('nombre', sql.VarChar, nombre)
      .input('direccion', sql.VarChar, direccion)
      .input('latitud', sql.Decimal(9, 6), latitud || null)
      .input('longitud', sql.Decimal(9, 6), longitud || null)
      .input('id_municipalidad', sql.Int, id_municipalidad)
      .query(`
        INSERT INTO Estacion (nombre, direccion, latitud, longitud, id_municipalidad)
        OUTPUT INSERTED.*
        VALUES (@nombre, @direccion, @latitud, @longitud, @id_municipalidad)
      `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getEstaciones,
  getAccesosConGuardias,
  getDistanciaEntreEstaciones,
  crearEstacion
};
