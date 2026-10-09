const { sql, getPool } = require('../config/db');

async function getParqueos(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT p.*, e.nombre AS nombre_estacion
      FROM Parqueo p
      JOIN Estacion e ON e.id_estacion = p.id_estacion
      ORDER BY p.nombre
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function crearParqueo(req, res) {
  const { nombre, capacidad_buses, id_estacion } = req.body;
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('nombre', sql.VarChar, nombre)
      .input('capacidad_buses', sql.Int, capacidad_buses)
      .input('id_estacion', sql.Int, id_estacion)
      .query(`
        INSERT INTO Parqueo (nombre, capacidad_buses, id_estacion)
        OUTPUT INSERTED.*
        VALUES (@nombre, @capacidad_buses, @id_estacion)
      `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getParqueos, crearParqueo };
