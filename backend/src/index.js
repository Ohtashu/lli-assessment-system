const dotenv = require('dotenv');
const app = require('./server');
const pool = require('./config/db');

dotenv.config();

const port = process.env.PORT || 3001;

pool.connect()
  .then(() => {
    console.log('[DB] Connected to MSSQL Server');
    app.listen(port, () => {
      console.log(`[Server] Listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('[DB] Connection failed:', err);
    process.exit(1);
  });

process.on('SIGTERM', async () => {
  console.log('[Server] SIGTERM received, closing gracefully...');
  await pool.close();
  process.exit(0);
});
