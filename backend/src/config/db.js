const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 1433,
  
  // 1. Move timeout properties to the top level using the correct name format
  connectionTimeout: 15000, // 15 seconds connection retry window (Top level)
  requestTimeout: 15000,    // 15 seconds query execution window (Top level)

  // 2. Keep only valid Tarn pooling properties inside the pool block
  pool: {
    max: 10,
    min: 2,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
  },
  authentication: {
    type: 'default',
  },
};

const pool = new sql.ConnectionPool(config);

pool.on('error', (err) => {
  console.error('[DB Error]', err);
});

module.exports = pool;