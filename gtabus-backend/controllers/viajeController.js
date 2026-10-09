const { sql, getPool } = require('../config/db');

// POST /api/viajes -> inicia un recorrido (bus + línea + piloto)
async function crearViaje(req, res) {
  const { id_bus, id_linea, id_piloto } = req.body;
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_bus', sql.Int, id_bus)
      .input('id_linea', sql.Int, id_linea)
      .input('id_piloto', sql.Int, id_piloto)
      .query(`
        INSERT INTO Viaje (id_bus, id_linea, id_piloto)
        OUTPUT INSERTED.*
        VALUES (@id_bus, @id_linea, @id_piloto)
      `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/viajes -> historial de viajes
async function listarViajes(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT v.id_viaje, v.fecha_hora_inicio, v.fecha_hora_fin,
             b.placa, l.codigo AS codigo_linea, l.nombre AS nombre_linea,
             p.nombres + ' ' + p.apellidos AS piloto
      FROM Viaje v
      JOIN Bus b ON b.id_bus = v.id_bus
      JOIN Linea l ON l.id_linea = v.id_linea
      JOIN Piloto p ON p.id_piloto = v.id_piloto
      ORDER BY v.fecha_hora_inicio DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/viajes/:id/visitas -> visitas ya registradas de un viaje (Regla 1: orden real del recorrido)
async function getVisitasDeViaje(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_viaje', sql.Int, req.params.id)
      .query(`
        SELECT vis.*, e.nombre AS nombre_estacion
        FROM VisitaEstacion vis
        JOIN Estacion e ON e.id_estacion = vis.id_estacion
        WHERE vis.id_viaje = @id_viaje
        ORDER BY vis.orden_visita
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { crearViaje, listarViajes, getVisitasDeViaje };
