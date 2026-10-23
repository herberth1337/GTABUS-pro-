const { sql, getPool } = require('../config/db');

/**
 * Calcula la ruta más corta entre dos estaciones usando las líneas y las
 * distancias registradas entre estaciones consecutivas (LineaEstacion).
 *
 * Cada "estado" es una pareja (estación, línea). Se puede avanzar a la
 * estación vecina de la misma línea (cuesta los km registrados) o cambiar de
 * línea en una estación compartida (cuesta 0 km, pero cuenta como transbordo).
 * Se prefiere menos distancia y, a igual distancia, menos transbordos.
 *
 * filas: [{ id_linea, codigo, id_estacion, nombre, orden, distancia_siguiente_km }]
 *        ordenadas por id_linea y orden.
 * Devuelve null si no hay ruta.
 */
function calcularRuta(filas, idOrigen, idDestino) {
  const clave = (e, l) => `${e}|${l}`;
  const estados = new Map();      // clave -> { id_estacion, nombre, codigo }
  const vecinos = new Map();      // clave -> [{ a, metros, transbordo }]
  const porEstacion = new Map();  // id_estacion -> [claves]
  const porLinea = new Map();     // id_linea -> [filas en orden]

  for (const f of filas) {
    const k = clave(f.id_estacion, f.id_linea);
    estados.set(k, { id_estacion: f.id_estacion, nombre: f.nombre, codigo: f.codigo });
    vecinos.set(k, []);
    if (!porEstacion.has(f.id_estacion)) porEstacion.set(f.id_estacion, []);
    porEstacion.get(f.id_estacion).push(k);
    if (!porLinea.has(f.id_linea)) porLinea.set(f.id_linea, []);
    porLinea.get(f.id_linea).push(f);
  }

  // Avanzar por la línea (en ambos sentidos). Si falta la distancia de un
  // tramo, ese tramo no se puede recorrer.
  for (const lista of porLinea.values()) {
    for (let i = 0; i < lista.length - 1; i++) {
      const a = lista[i], b = lista[i + 1];
      if (a.distancia_siguiente_km === null || a.distancia_siguiente_km === undefined) continue;
      const metros = Math.round(Number(a.distancia_siguiente_km) * 1000);
      const ka = clave(a.id_estacion, a.id_linea), kb = clave(b.id_estacion, b.id_linea);
      vecinos.get(ka).push({ a: kb, metros, transbordo: 0 });
      vecinos.get(kb).push({ a: ka, metros, transbordo: 0 });
    }
  }
  // Transbordos entre las líneas de una misma estación
  for (const claves of porEstacion.values()) {
    for (const x of claves) for (const y of claves) {
      if (x !== y) vecinos.get(x).push({ a: y, metros: 0, transbordo: 1 });
    }
  }

  const inicios = porEstacion.get(idOrigen) || [];
  const finales = new Set(porEstacion.get(idDestino) || []);
  if (inicios.length === 0 || finales.size === 0) return null;

  // Dijkstra. Costo = metros * 1000 + transbordos (así los km mandan y los
  // transbordos desempatan). Son pocos nodos, basta la versión simple.
  const costo = new Map(), previo = new Map(), hechos = new Set();
  inicios.forEach(k => costo.set(k, 0));
  let mejorFinal = null;
  while (true) {
    let actual = null, mejor = Infinity;
    for (const [k, c] of costo) if (!hechos.has(k) && c < mejor) { actual = k; mejor = c; }
    if (actual === null) break;
    hechos.add(actual);
    if (finales.has(actual)) { mejorFinal = actual; break; }
    for (const v of vecinos.get(actual)) {
      const nuevo = mejor + v.metros * 1000 + v.transbordo;
      if (!costo.has(v.a) || nuevo < costo.get(v.a)) {
        costo.set(v.a, nuevo);
        previo.set(v.a, { de: actual, metros: v.metros, transbordo: v.transbordo });
      }
    }
  }
  if (mejorFinal === null) return null;

  // Reconstruir el camino
  const camino = [];
  for (let k = mejorFinal; k !== undefined; ) {
    const p = previo.get(k);
    camino.unshift({ k, metros: p ? p.metros : 0, transbordo: p ? p.transbordo : 0 });
    k = p ? p.de : undefined;
  }

  // Agrupar en tramos por línea
  const tramos = [];
  let transbordos = 0, totalMetros = 0;
  for (const paso of camino) {
    const est = estados.get(paso.k);
    totalMetros += paso.metros;
    transbordos += paso.transbordo;
    const ultimo = tramos[tramos.length - 1];
    if (ultimo && ultimo.codigo_linea === est.codigo && !paso.transbordo) {
      ultimo.hasta = est.nombre;
      ultimo.paradas += 1;
      ultimo._metros += paso.metros;
    } else {
      tramos.push({ codigo_linea: est.codigo, desde: est.nombre, hasta: est.nombre, paradas: 1, _metros: 0 });
    }
  }
  tramos.forEach(t => { t.km = t._metros / 1000; delete t._metros; });

  return { distancia_km: totalMetros / 1000, transbordos, tramos };
}

// GET /api/distancias?origen=ID&destino=ID   (Regla 12)
async function calcular(req, res) {
  const origen = Number(req.query.origen);
  const destino = Number(req.query.destino);
  if (!Number.isInteger(origen) || !Number.isInteger(destino) || origen <= 0 || destino <= 0) {
    return res.status(400).json({ error: 'Selecciona la estación de origen y la de destino.' });
  }
  try {
    const pool = await getPool();
    const est = await pool.request()
      .input('a', sql.Int, origen)
      .input('b', sql.Int, destino)
      .query('SELECT id_estacion, nombre FROM Estacion WHERE id_estacion IN (@a, @b)');
    const nombres = new Map(est.recordset.map(e => [e.id_estacion, e.nombre]));
    if (!nombres.has(origen) || !nombres.has(destino)) {
      return res.status(404).json({ error: 'Una de las estaciones no existe.' });
    }
    const salida = {
      origen: { id_estacion: origen, nombre: nombres.get(origen) },
      destino: { id_estacion: destino, nombre: nombres.get(destino) },
    };
    if (origen === destino) {
      return res.json({ ...salida, distancia_km: 0, transbordos: 0, tramos: [] });
    }

    const filas = (await pool.request().query(`
      SELECT le.id_linea, l.codigo, le.id_estacion, e.nombre, le.orden, le.distancia_siguiente_km
      FROM LineaEstacion le
      JOIN Linea l ON l.id_linea = le.id_linea
      JOIN Estacion e ON e.id_estacion = le.id_estacion
      ORDER BY le.id_linea, le.orden
    `)).recordset;

    const enLinea = new Set(filas.map(f => f.id_estacion));
    for (const id of [origen, destino]) {
      if (!enLinea.has(id)) {
        return res.status(404).json({ error: `La estación "${nombres.get(id)}" no pertenece a ninguna línea.` });
      }
    }

    const ruta = calcularRuta(filas, origen, destino);
    if (!ruta) {
      return res.status(404).json({
        error: 'No hay una ruta entre esas estaciones con las líneas y distancias registradas.'
      });
    }
    res.json({ ...salida, ...ruta });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { calcular, calcularRuta };
