const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// GET all products with balances
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT item_name, balance FROM stock ORDER BY id');
    res.json({ success: true, stock: result.rows });
  } catch (err) {
    console.error('Error fetching stock:', err);
    res.status(500).json({ success: false, error: 'Failed to load stock' });
  }
});

module.exports = router;
