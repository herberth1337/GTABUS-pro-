const { sql, getPool } = require('../config/db');

// GET /api/lineas
async function getLineas(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT l.*, m.nombre AS nombre_municipalidad
      FROM Linea l
      JOIN Municipalidad m ON m.id_municipalidad = l.id_municipalidad
      ORDER BY l.nombre
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/lineas/:id/estaciones  -> Regla 1: orden de ruta
async function getEstacionesDeLinea(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_linea', sql.Int, req.params.id)
      .query(`
        SELECT le.orden, le.distancia_siguiente_km, e.*
        FROM LineaEstacion le
        JOIN Estacion e ON e.id_estacion = le.id_estacion
        WHERE le.id_linea = @id_linea
        ORDER BY le.orden ASC
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/lineas/:id/accesos -> Regla 8: todos los accesos de una linea
async function getAccesosDeLinea(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_linea', sql.Int, req.params.id)
      .query(`
        SELECT a.id_acceso, a.nombre AS nombre_acceso, e.nombre AS estacion, le.orden
        FROM LineaEstacion le
        JOIN Estacion e ON e.id_estacion = le.id_estacion
        JOIN Acceso a ON a.id_estacion = e.id_estacion
        WHERE le.id_linea = @id_linea
        ORDER BY le.orden, a.nombre
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/lineas/:id/buses -> Regla 4 y 5
async function getBusesDeLinea(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_linea', sql.Int, req.params.id)
      .query(`SELECT * FROM Bus WHERE id_linea = @id_linea`);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/lineas
async function crearLinea(req, res) {
  const { nombre, codigo, color, id_municipalidad } = req.body;
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('nombre', sql.VarChar, nombre)
      .input('codigo', sql.VarChar, codigo)
      .input('color', sql.VarChar, color)
      .input('id_municipalidad', sql.Int, id_municipalidad)
      .query(`
        INSERT INTO Linea (nombre, codigo, color, id_municipalidad)
        OUTPUT INSERTED.*
        VALUES (@nombre, @codigo, @color, @id_municipalidad)
      `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/lineas/:id/estaciones -> agrega una estacion a la ruta con orden
async function agregarEstacionARuta(req, res) {
  const { id_estacion, orden, distancia_siguiente_km } = req.body;
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_linea', sql.Int, req.params.id)
      .input('id_estacion', sql.Int, id_estacion)
      .input('orden', sql.Int, orden)
      .input('distancia_siguiente_km', sql.Decimal(8, 2), distancia_siguiente_km || null)
      .query(`
        INSERT INTO LineaEstacion (id_linea, id_estacion, orden, distancia_siguiente_km)
        OUTPUT INSERTED.*
        VALUES (@id_linea, @id_estacion, @orden, @distancia_siguiente_km)
      `);

    // Recalcula distancia total de la línea (Regla 13)
    await pool.request()
      .input('id_linea', sql.Int, req.params.id)
      .query(`
        UPDATE Linea
        SET distancia_total_km = (
          SELECT ISNULL(SUM(distancia_siguiente_km), 0)
          FROM LineaEstacion WHERE id_linea = @id_linea
        )
        WHERE id_linea = @id_linea
      `);

    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getLineas,
  getEstacionesDeLinea,
  getAccesosDeLinea,
  getBusesDeLinea,
  crearLinea,
  agregarEstacionARuta
};
