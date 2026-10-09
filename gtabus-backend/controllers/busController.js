const { sql, getPool } = require('../config/db');

async function getBuses(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT b.*, l.nombre AS linea, p.nombre AS parqueo_actual
      FROM Bus b
      LEFT JOIN Linea l ON l.id_linea = b.id_linea
      JOIN Parqueo p ON p.id_parqueo = b.id_parqueo_actual
      ORDER BY b.placa
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/buses -> valida Regla 4 (una sola línea) y Regla 7 (parqueo obligatorio)
async function crearBus(req, res) {
  const { placa, capacidad_maxima, id_linea, id_parqueo_actual } = req.body;
  try {
    const pool = await getPool();
    // NOTA: la tabla Bus tiene triggers (Reglas 5 y 7), y SQL Server no permite
    // "OUTPUT INSERTED.*" directo al cliente en tablas con triggers habilitados.
    // Se usa una tabla temporal (@BusInsertado) como paso intermedio.
    const result = await pool.request()
      .input('placa', sql.VarChar, placa)
      .input('capacidad_maxima', sql.Int, capacidad_maxima)
      .input('id_linea', sql.Int, id_linea || null)
      .input('id_parqueo_actual', sql.Int, id_parqueo_actual)
      .query(`
        DECLARE @BusInsertado TABLE (
          id_bus INT, placa VARCHAR(15), capacidad_maxima INT,
          id_linea INT, id_parqueo_actual INT, activo BIT
        );

        INSERT INTO Bus (placa, capacidad_maxima, id_linea, id_parqueo_actual)
        OUTPUT INSERTED.id_bus, INSERTED.placa, INSERTED.capacidad_maxima,
               INSERTED.id_linea, INSERTED.id_parqueo_actual, INSERTED.activo
        INTO @BusInsertado
        VALUES (@placa, @capacidad_maxima, @id_linea, @id_parqueo_actual);

        SELECT * FROM @BusInsertado;
      `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    // El trigger trg_ValidarBusesPorLinea puede rechazar el INSERT (Regla 5)
    res.status(400).json({ error: err.message });
  }
}

// PUT /api/buses/:id/parqueo -> Regla 7: cambia de parqueo sin quedar sin él
async function cambiarParqueo(req, res) {
  const { id_parqueo_actual } = req.body;
  try {
    const pool = await getPool();
    // Mismo caso: Bus tiene triggers, así que el OUTPUT debe ir a una tabla temporal.
    const result = await pool.request()
      .input('id_bus', sql.Int, req.params.id)
      .input('id_parqueo_actual', sql.Int, id_parqueo_actual)
      .query(`
        DECLARE @BusActualizado TABLE (
          id_bus INT, placa VARCHAR(15), capacidad_maxima INT,
          id_linea INT, id_parqueo_actual INT, activo BIT
        );

        UPDATE Bus SET id_parqueo_actual = @id_parqueo_actual
        OUTPUT INSERTED.id_bus, INSERTED.placa, INSERTED.capacidad_maxima,
               INSERTED.id_linea, INSERTED.id_parqueo_actual, INSERTED.activo
        INTO @BusActualizado
        WHERE id_bus = @id_bus;

        SELECT * FROM @BusActualizado;
      `);
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// GET /api/buses/:id/historial-parqueo -> bitácora de cambios de parqueo (Regla 7)
async function getHistorialParqueo(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_bus', sql.Int, req.params.id)
      .query(`
        SELECT h.id_historial, h.fecha_inicio, h.fecha_fin, p.nombre AS nombre_parqueo
        FROM HistorialParqueoBus h
        JOIN Parqueo p ON p.id_parqueo = h.id_parqueo
        WHERE h.id_bus = @id_bus
        ORDER BY h.fecha_inicio DESC
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/visitas -> registra el paso de un bus por una estación,
// aplica Regla 14 (alerta >=150% de capacidad) y Regla 15 (espera si <25%)
async function registrarVisitaEstacion(req, res) {
  const { id_viaje, id_estacion, orden_visita, pasajeros_abordo } = req.body;
  try {
    const pool = await getPool();

    // obtener capacidad máxima del bus de este viaje
    const busInfo = await pool.request()
      .input('id_viaje', sql.Int, id_viaje)
      .query(`
        SELECT b.capacidad_maxima
        FROM Viaje v JOIN Bus b ON b.id_bus = v.id_bus
        WHERE v.id_viaje = @id_viaje
      `);
    const capacidad = busInfo.recordset[0].capacidad_maxima;
    const ocupacionPct = (pasajeros_abordo / capacidad) * 100;

    const generaAlerta = ocupacionPct >= 150;   // Regla 14
    const esperaExtendida = ocupacionPct < 25;  // Regla 15

    const visita = await pool.request()
      .input('id_viaje', sql.Int, id_viaje)
      .input('id_estacion', sql.Int, id_estacion)
      .input('orden_visita', sql.Int, orden_visita)
      .input('pasajeros_abordo', sql.Int, pasajeros_abordo)
      .input('genero_alerta_sobrecupo', sql.Bit, generaAlerta)
      .input('espera_extendida', sql.Bit, esperaExtendida)
      .query(`
        INSERT INTO VisitaEstacion
          (id_viaje, id_estacion, orden_visita, pasajeros_abordo,
           genero_alerta_sobrecupo, espera_extendida)
        OUTPUT INSERTED.*
        VALUES
          (@id_viaje, @id_estacion, @orden_visita, @pasajeros_abordo,
           @genero_alerta_sobrecupo, @espera_extendida)
      `);

    const visitaCreada = visita.recordset[0];

    if (generaAlerta) {
      await pool.request()
        .input('id_visita', sql.Int, visitaCreada.id_visita)
        .input('mensaje', sql.VarChar,
          `Estación con ${ocupacionPct.toFixed(0)}% de ocupación: se requiere unidad adicional.`)
        .query(`
          INSERT INTO AlertaEstacion (id_visita, mensaje)
          VALUES (@id_visita, @mensaje)
        `);
    }

    res.status(201).json({
      ...visitaCreada,
      ocupacion_pct: ocupacionPct,
      minutos_espera_extra: esperaExtendida ? 5 : 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getBuses, crearBus, cambiarParqueo, getHistorialParqueo, registrarVisitaEstacion };
