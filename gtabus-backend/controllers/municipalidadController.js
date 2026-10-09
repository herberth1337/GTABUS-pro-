const { sql, getPool } = require('../config/db');

async function getMunicipalidades(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Municipalidad ORDER BY nombre');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getMunicipalidades };
