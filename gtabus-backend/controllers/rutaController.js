const { sql, getPool } = require('../config/db');

const MAX_KM = 50;

// Acepta un número positivo razonable y lo deja con 2 decimales; si no, null.
function km(valor) {
  const n = Number(valor);
  if (valor === '' || valor === null || valor === undefined || !Number.isFinite(n)) return null;
  if (n <= 0 || n > MAX_KM) return null;
  return Math.round(n * 100) / 100;
}

// La distancia total de la línea es la suma de sus tramos (Regla 13).
async function recalcularTotal(tx, idLinea) {
  const r = await new sql.Request(tx)
    .input('id_linea', sql.Int, idLinea)
    .query(`
      UPDATE Linea
      SET distancia_total_km = (
        SELECT ISNULL(SUM(distancia_siguiente_km), 0)
        FROM LineaEstacion WHERE id_linea = @id_linea
      )
      OUTPUT INSERTED.distancia_total_km
      WHERE id_linea = @id_linea
    `);
  return r.recordset[0] ? r.recordset[0].distancia_total_km : 0;
}

class ErrorDeUso extends Error {
  constructor(status, mensaje) { super(mensaje); this.status = status; }
}

async function enTransaccion(res, trabajo) {
  let tx;
  try {
    const pool = await getPool();
    tx = new sql.Transaction(pool);
    await tx.begin();
    const resultado = await trabajo(tx);
    await tx.commit();
    return resultado;
  } catch (err) {
    try { if (tx) await tx.rollback(); } catch (e) { /* ya cerrada */ }
    if (err instanceof ErrorDeUso) {
      res.status(err.status).json({ error: err.message });
    } else if (err.number === 2627 || err.number === 2601) {
      res.status(409).json({ error: 'Esa estación ya está en la ruta de la línea.' });
    } else if (err.number === 547) {
      res.status(404).json({ error: 'La línea o la estación no existe.' });
    } else {
      res.status(500).json({ error: err.message });
    }
    return undefined;
  }
}

// PUT /api/lineas/:id/ruta/:idEstacion/distancia   { distancia_siguiente_km }
// Corrige la distancia entre esa estación y la siguiente de la ruta.
async function cambiarDistancia(req, res) {
  const d = km(req.body && req.body.distancia_siguiente_km);
  if (d === null) {
    return res.status(400).json({ error: `La distancia debe ser un número mayor que 0 y de máximo ${MAX_KM} km.` });
  }
  const idLinea = Number(req.params.id), idEstacion = Number(req.params.idEstacion);

  const resultado = await enTransaccion(res, async (tx) => {
    const fila = await new sql.Request(tx)
      .input('id_linea', sql.Int, idLinea)
      .input('id_estacion', sql.Int, idEstacion)
      .query(`
        SELECT orden, (SELECT MAX(orden) FROM LineaEstacion WHERE id_linea = @id_linea) AS ultimo
        FROM LineaEstacion
        WHERE id_linea = @id_linea AND id_estacion = @id_estacion
      `);
    if (fila.recordset.length === 0) {
      throw new ErrorDeUso(404, 'Esa estación no está en la ruta de la línea.');
    }
    if (fila.recordset[0].orden === fila.recordset[0].ultimo) {
      throw new ErrorDeUso(400, 'La última estación no tiene un tramo siguiente.');
    }
    await new sql.Request(tx)
      .input('id_linea', sql.Int, idLinea)
      .input('id_estacion', sql.Int, idEstacion)
      .input('d', sql.Decimal(8, 2), d)
      .query(`
        UPDATE LineaEstacion SET distancia_siguiente_km = @d
        WHERE id_linea = @id_linea AND id_estacion = @id_estacion
      `);
    const total = await recalcularTotal(tx, idLinea);
    return { distancia_siguiente_km: d, distancia_total_km: total };
  });
  if (resultado) res.json(resultado);
}

// POST /api/lineas/:id/ruta/estaciones
// Body: { id_estacion, despues_de, distancia_anterior, distancia_siguiente }
//   despues_de: id de la estación tras la que se inserta (null = al inicio)
//   distancia_anterior: km desde la estación previa (si existe)
//   distancia_siguiente: km hasta la estación siguiente (si existe)
// Si la estación ya está en otras líneas, queda creado un transbordo.
async function agregarEstacion(req, res) {
  const { id_estacion, despues_de } = req.body || {};
  const idLinea = Number(req.params.id);
  const nueva = Number(id_estacion);
  if (!Number.isInteger(nueva) || nueva <= 0) {
    return res.status(400).json({ error: 'Selecciona la estación que quieres agregar.' });
  }
  const tras = (despues_de === null || despues_de === undefined || despues_de === '') ? null : Number(despues_de);
  if (tras !== null && (!Number.isInteger(tras) || tras <= 0)) {
    return res.status(400).json({ error: 'La posición indicada no es válida.' });
  }

  const resultado = await enTransaccion(res, async (tx) => {
    // Lee la ruta actual bloqueándola, para que dos cambios simultáneos no se pisen.
    const ruta = (await new sql.Request(tx)
      .input('id_linea', sql.Int, idLinea)
      .query(`
        SELECT id_estacion, orden
        FROM LineaEstacion WITH (UPDLOCK, HOLDLOCK)
        WHERE id_linea = @id_linea
        ORDER BY orden
      `)).recordset;

    if (ruta.some(r => r.id_estacion === nueva)) {
      throw new ErrorDeUso(409, 'Esa estación ya está en la ruta de la línea.');
    }

    let previa = null, siguiente = null, pos = 1;
    if (tras === null) {
      siguiente = ruta[0] || null;
    } else {
      const i = ruta.findIndex(r => r.id_estacion === tras);
      if (i === -1) throw new ErrorDeUso(400, 'La estación indicada como anterior no está en la ruta.');
      previa = ruta[i];
      siguiente = ruta[i + 1] || null;
      pos = previa.orden + 1;
    }

    const dAnt = previa ? km(req.body.distancia_anterior) : null;
    const dSig = siguiente ? km(req.body.distancia_siguiente) : null;
    if (previa && dAnt === null) {
      throw new ErrorDeUso(400, `Indica la distancia desde la estación anterior (mayor que 0 y de máximo ${MAX_KM} km).`);
    }
    if (siguiente && dSig === null) {
      throw new ErrorDeUso(400, `Indica la distancia hasta la estación siguiente (mayor que 0 y de máximo ${MAX_KM} km).`);
    }

    // Abre el hueco: se suben las que quedan después, en dos pasos para no
    // chocar con la restricción de orden único.
    await new sql.Request(tx).input('id_linea', sql.Int, idLinea).input('pos', sql.Int, pos)
      .query('UPDATE LineaEstacion SET orden = orden + 1000 WHERE id_linea = @id_linea AND orden >= @pos');
    await new sql.Request(tx).input('id_linea', sql.Int, idLinea).input('pos', sql.Int, pos)
      .query('UPDATE LineaEstacion SET orden = orden - 999 WHERE id_linea = @id_linea AND orden >= @pos + 1000');

    await new sql.Request(tx)
      .input('id_linea', sql.Int, idLinea)
      .input('id_estacion', sql.Int, nueva)
      .input('orden', sql.Int, pos)
      .input('d', sql.Decimal(8, 2), dSig)
      .query(`
        INSERT INTO LineaEstacion (id_linea, id_estacion, orden, distancia_siguiente_km)
        VALUES (@id_linea, @id_estacion, @orden, @d)
      `);

    if (previa) {
      await new sql.Request(tx)
        .input('id_linea', sql.Int, idLinea)
        .input('id_estacion', sql.Int, previa.id_estacion)
        .input('d', sql.Decimal(8, 2), dAnt)
        .query(`
          UPDATE LineaEstacion SET distancia_siguiente_km = @d
          WHERE id_linea = @id_linea AND id_estacion = @id_estacion
        `);
    }

    const total = await recalcularTotal(tx, idLinea);
    const otras = (await new sql.Request(tx)
      .input('id_linea', sql.Int, idLinea)
      .input('id_estacion', sql.Int, nueva)
      .query(`
        SELECT l.codigo
        FROM LineaEstacion le JOIN Linea l ON l.id_linea = le.id_linea
        WHERE le.id_estacion = @id_estacion AND le.id_linea <> @id_linea
        ORDER BY l.codigo
      `)).recordset.map(r => r.codigo);

    return { orden: pos, distancia_total_km: total, otras_lineas: otras };
  });
  if (resultado) res.status(201).json(resultado);
}

module.exports = { cambiarDistancia, agregarEstacion };
