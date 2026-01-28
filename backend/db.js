const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Aiven PostgreSQL URL
  ssl: { rejectUnauthorized: false }          // required for Aiven
});

module.exports = pool;
