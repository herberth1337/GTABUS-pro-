/**
 * Script de prueba de conexión a SQL Server.
 * Uso:  node test-connection.js
 * Lee las credenciales de .env (misma configuración que usa la API).
 */
const { getPool, sql } = require('./config/db');

async function main() {
  console.log('Probando conexión con:');
  console.log('  DB_SERVER  =', process.env.DB_SERVER || '(vacío, revisa tu .env)');
  console.log('  DB_NAME    =', process.env.DB_NAME);
  console.log('  DB_USER    =', process.env.DB_USER);
  console.log('---------------------------------------------');

  try {
    const pool = await getPool();

    // 1. Ping simple
    const version = await pool.request().query('SELECT @@VERSION AS version, DB_NAME() AS baseActual');
    console.log('✅ Conexión exitosa.');
    console.log('   Base de datos activa:', version.recordset[0].baseActual);
    console.log('   Versión SQL Server  :', version.recordset[0].version.split('\n')[0]);

    // 2. Verifica que las tablas del esquema existan
    const tablas = await pool.request().query(`
      SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_TYPE = 'BASE TABLE'
      ORDER BY TABLE_NAME
    `);

    if (tablas.recordset.length === 0) {
      console.log('⚠️  Conectaste correctamente, pero no hay tablas todavía.');
      console.log('    Ejecuta primero gtabus_schema.sql en esta base de datos.');
    } else {
      console.log(`   Tablas encontradas (${tablas.recordset.length}):`);
      tablas.recordset.forEach(t => console.log('     -', t.TABLE_NAME));
    }

    await pool.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ No se pudo conectar a la base de datos.');
    console.error('   Detalle:', err.message);
    console.error('');
    console.error('Posibles causas comunes:');
    console.error('  1. SQL Server Browser no está corriendo (necesario para instancias con nombre, ej. \\HERBERTH).');
    console.error('  2. TCP/IP no está habilitado en SQL Server Configuration Manager.');
    console.error('  3. El usuario "gtabus_user" no tiene permisos sobre la base indicada en DB_NAME.');
    console.error('  4. El firewall de Windows bloquea el puerto 1433 / SQL Browser (UDP 1434).');
    console.error('  5. La autenticación de SQL Server (modo mixto) no está habilitada en la instancia.');
    process.exit(1);
  }
}

main();
