const sql = require('mssql');
require('dotenv').config();

// DB_SERVER puede venir como:
//   - "host\instancia"  -> SQL Server local con instancia nombrada
//     (ej. "DESKTOP-TQK76M4\HERBERTH"), usado en desarrollo.
//   - "host"             -> SQL Server simple, o Azure SQL Database
//     (ej. "gtabus-server.database.windows.net").
// Si hay instancia, se separa y el driver la resuelve vía SQL Server
// Browser (UDP 1434) — eso solo aplica en redes locales, nunca en Azure.
const rawServer = process.env.DB_SERVER || 'localhost';
const [hostName, instanceName] = rawServer.split('\\');

// DB_ENCRYPT=true es OBLIGATORIO para Azure SQL Database (exige TLS).
// En SQL Server local normalmente se deja en false (certificado autofirmado).
const encrypt = process.env.DB_ENCRYPT === 'true';

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: hostName,
  database: process.env.DB_NAME,
  options: {
    encrypt,                           // true en Azure, false en local
    trustServerCertificate: !encrypt,  // true en local, false en Azure
    ...(instanceName ? { instanceName } : {})
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// Si NO hay instancia nombrada (caso típico de Azure SQL), se usa el
// puerto indicado o el 1433 por defecto.
if (!instanceName) {
  config.port = parseInt(process.env.DB_PORT || '1433');
}

let poolPromise;

function getPool() {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(config)
      .connect()
      .then(pool => {
        console.log(`Conectado a SQL Server (${config.database}) en ${rawServer}`);
        return pool;
      })
      .catch(err => {
        console.error('Error de conexión a la base de datos:', err);
        poolPromise = null; // permite reintentar en la siguiente petición
        throw err;
      });
  }
  return poolPromise;
}

module.exports = { sql, getPool };