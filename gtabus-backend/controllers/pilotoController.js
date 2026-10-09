const { sql, getPool } = require('../config/db');

// GET /api/pilotos -> lista simple de todos los pilotos
async function getPilotos(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Piloto ORDER BY apellidos, nombres');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/pilotos/:id -> Regla 9: historial educativo, residencia y comunicación
async function getPilotoCompleto(req, res) {
  try {
    const pool = await getPool();
    const id = req.params.id;

    const piloto = await pool.request().input('id', sql.Int, id)
      .query('SELECT * FROM Piloto WHERE id_piloto = @id');

    const residencia = await pool.request().input('id', sql.Int, id)
      .query('SELECT * FROM PilotoResidencia WHERE id_piloto = @id');

    const comunicacion = await pool.request().input('id', sql.Int, id)
      .query('SELECT * FROM PilotoComunicacion WHERE id_piloto = @id');

    const educacion = await pool.request().input('id', sql.Int, id)
      .query('SELECT * FROM PilotoHistorialEducativo WHERE id_piloto = @id');

    if (piloto.recordset.length === 0) {
      return res.status(404).json({ mensaje: 'Piloto no encontrado' });
    }

    res.json({
      ...piloto.recordset[0],
      residencia: residencia.recordset[0] || null,
      comunicacion: comunicacion.recordset,
      historial_educativo: educacion.recordset
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function crearPiloto(req, res) {
  const { nombres, apellidos, dpi, fecha_nacimiento, licencia_tipo } = req.body;
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('nombres', sql.VarChar, nombres)
      .input('apellidos', sql.VarChar, apellidos)
      .input('dpi', sql.VarChar, dpi)
      .input('fecha_nacimiento', sql.Date, fecha_nacimiento || null)
      .input('licencia_tipo', sql.VarChar, licencia_tipo)
      .query(`
        INSERT INTO Piloto (nombres, apellidos, dpi, fecha_nacimiento, licencia_tipo)
        OUTPUT INSERTED.*
        VALUES (@nombres, @apellidos, @dpi, @fecha_nacimiento, @licencia_tipo)
      `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PUT /api/pilotos/:id/residencia -> crea o actualiza la residencia (relación 1:1)
async function upsertResidencia(req, res) {
  const { direccion, municipio, departamento } = req.body;
  const id_piloto = req.params.id;
  try {
    const pool = await getPool();
    const existente = await pool.request()
      .input('id_piloto', sql.Int, id_piloto)
      .query('SELECT id_residencia FROM PilotoResidencia WHERE id_piloto = @id_piloto');

    let result;
    if (existente.recordset.length > 0) {
      result = await pool.request()
        .input('id_piloto', sql.Int, id_piloto)
        .input('direccion', sql.VarChar, direccion)
        .input('municipio', sql.VarChar, municipio)
        .input('departamento', sql.VarChar, departamento)
        .query(`
          UPDATE PilotoResidencia
          SET direccion = @direccion, municipio = @municipio, departamento = @departamento
          OUTPUT INSERTED.*
          WHERE id_piloto = @id_piloto
        `);
    } else {
      result = await pool.request()
        .input('id_piloto', sql.Int, id_piloto)
        .input('direccion', sql.VarChar, direccion)
        .input('municipio', sql.VarChar, municipio)
        .input('departamento', sql.VarChar, departamento)
        .query(`
          INSERT INTO PilotoResidencia (id_piloto, direccion, municipio, departamento)
          OUTPUT INSERTED.*
          VALUES (@id_piloto, @direccion, @municipio, @departamento)
        `);
    }
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/pilotos/:id/comunicacion -> agrega un dato de contacto (relación 1:N)
async function agregarComunicacion(req, res) {
  const { tipo, valor } = req.body;
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_piloto', sql.Int, req.params.id)
      .input('tipo', sql.VarChar, tipo)
      .input('valor', sql.VarChar, valor)
      .query(`
        INSERT INTO PilotoComunicacion (id_piloto, tipo, valor)
        OUTPUT INSERTED.*
        VALUES (@id_piloto, @tipo, @valor)
      `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/pilotos/:id/historial-educativo -> agrega un registro educativo (relación 1:N)
async function agregarHistorialEducativo(req, res) {
  const { nivel, institucion, anio_finalizacion, titulo_obtenido } = req.body;
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id_piloto', sql.Int, req.params.id)
      .input('nivel', sql.VarChar, nivel)
      .input('institucion', sql.VarChar, institucion)
      .input('anio_finalizacion', sql.Int, anio_finalizacion || null)
      .input('titulo_obtenido', sql.VarChar, titulo_obtenido || null)
      .query(`
        INSERT INTO PilotoHistorialEducativo (id_piloto, nivel, institucion, anio_finalizacion, titulo_obtenido)
        OUTPUT INSERTED.*
        VALUES (@id_piloto, @nivel, @institucion, @anio_finalizacion, @titulo_obtenido)
      `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getPilotos, getPilotoCompleto, crearPiloto,
  upsertResidencia, agregarComunicacion, agregarHistorialEducativo
};
