const { Pool } = require('pg');
const isLocalhost = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1');


const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/urbanserve',
  ssl: isLocalhost ? false : { rejectUnauthorized: false },
});


pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL pool error:', err.message);
});

module.exports = pool;
