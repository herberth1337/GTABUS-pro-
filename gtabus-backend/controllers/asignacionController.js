const { sql, getPool } = require('../config/db');

const TURNOS = ['manana', 'tarde', 'noche'];

function fechaValida(f) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(f || '')) return false;
  const d = new Date(f + 'T00:00:00Z');
  return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === f;
}

// GET /api/asignaciones            -> las 300 más recientes
// GET /api/asignaciones?fecha=AAAA-MM-DD -> las de ese día
async function listar(req, res) {
  const { fecha } = req.query;
  if (fecha && !fechaValida(fecha)) {
    return res.status(400).json({ error: 'Fecha inválida (use AAAA-MM-DD).' });
  }
  try {
    const pool = await getPool();
    const request = pool.request();
    let filtro = '';
    if (fecha) {
      request.input('fecha', sql.VarChar(10), fecha);
      filtro = 'WHERE a.fecha = CONVERT(date, @fecha, 23)';
    }
    const result = await request.query(`
      SELECT TOP 300
             a.id_asignacion,
             CONVERT(varchar(10), a.fecha, 23) AS fecha,
             a.turno,
             b.id_bus, b.placa, l.codigo AS linea,
             p.id_piloto, p.nombres + ' ' + p.apellidos AS piloto
      FROM AsignacionPilotoBus a
      JOIN Bus b ON b.id_bus = a.id_bus
      LEFT JOIN Linea l ON l.id_linea = b.id_linea
      JOIN Piloto p ON p.id_piloto = a.id_piloto
      ${filtro}
      ORDER BY a.fecha DESC,
               CASE a.turno WHEN 'manana' THEN 1 WHEN 'tarde' THEN 2 ELSE 3 END,
               b.placa
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/asignaciones  { id_bus, id_piloto, fecha, turno }
// Reglas: un bus solo puede tener un piloto por fecha y turno, y un piloto
// solo puede conducir un bus por fecha y turno. Bus y piloto deben estar activos.
async function crear(req, res) {
  const { id_bus, id_piloto, fecha, turno } = req.body || {};
  if (!Number.isInteger(Number(id_bus)) || !Number.isInteger(Number(id_piloto)) || !id_bus || !id_piloto) {
    return res.status(400).json({ error: 'Selecciona un bus y un piloto.' });
  }
  if (!fechaValida(fecha)) {
    return res.status(400).json({ error: 'La fecha es inválida (use AAAA-MM-DD).' });
  }
  if (!TURNOS.includes(turno)) {
    return res.status(400).json({ error: 'El turno debe ser mañana, tarde o noche.' });
  }

  try {
    const pool = await getPool();
    const bus = await pool.request().input('id', sql.Int, id_bus)
      .query('SELECT activo FROM Bus WHERE id_bus = @id');
    if (bus.recordset.length === 0) return res.status(404).json({ error: 'El bus no existe.' });
    if (!bus.recordset[0].activo) return res.status(400).json({ error: 'El bus está inactivo.' });

    const piloto = await pool.request().input('id', sql.Int, id_piloto)
      .query('SELECT activo FROM Piloto WHERE id_piloto = @id');
    if (piloto.recordset.length === 0) return res.status(404).json({ error: 'El piloto no existe.' });
    if (!piloto.recordset[0].activo) return res.status(400).json({ error: 'El piloto está inactivo.' });

    const conflictoBus = await pool.request()
      .input('id_bus', sql.Int, id_bus)
      .input('fecha', sql.VarChar(10), fecha)
      .input('turno', sql.VarChar(20), turno)
      .query(`
        SELECT TOP 1 p.nombres + ' ' + p.apellidos AS piloto
        FROM AsignacionPilotoBus a JOIN Piloto p ON p.id_piloto = a.id_piloto
        WHERE a.id_bus = @id_bus AND a.fecha = CONVERT(date, @fecha, 23) AND a.turno = @turno
      `);
    if (conflictoBus.recordset.length > 0) {
      return res.status(409).json({
        error: `Ese bus ya tiene asignado a ${conflictoBus.recordset[0].piloto} en ese turno.`
      });
    }

    const conflictoPiloto = await pool.request()
      .input('id_piloto', sql.Int, id_piloto)
      .input('fecha', sql.VarChar(10), fecha)
      .input('turno', sql.VarChar(20), turno)
      .query(`
        SELECT TOP 1 b.placa
        FROM AsignacionPilotoBus a JOIN Bus b ON b.id_bus = a.id_bus
        WHERE a.id_piloto = @id_piloto AND a.fecha = CONVERT(date, @fecha, 23) AND a.turno = @turno
      `);
    if (conflictoPiloto.recordset.length > 0) {
      return res.status(409).json({
        error: `Ese piloto ya está asignado al bus ${conflictoPiloto.recordset[0].placa} en ese turno.`
      });
    }

    const result = await pool.request()
      .input('id_piloto', sql.Int, id_piloto)
      .input('id_bus', sql.Int, id_bus)
      .input('fecha', sql.VarChar(10), fecha)
      .input('turno', sql.VarChar(20), turno)
      .query(`
        INSERT INTO AsignacionPilotoBus (id_piloto, id_bus, fecha, turno)
        OUTPUT INSERTED.id_asignacion
        VALUES (@id_piloto, @id_bus, CONVERT(date, @fecha, 23), @turno)
      `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE /api/asignaciones/:id
async function eliminar(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        DELETE FROM AsignacionPilotoBus
        OUTPUT DELETED.id_asignacion
        WHERE id_asignacion = @id
      `);
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'La asignación no existe.' });
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { listar, crear, eliminar };
