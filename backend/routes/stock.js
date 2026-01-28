const express = require('express');
const router = express.Router();
const pool = require('../db');

// Stock endpoint
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT balance FROM stock WHERE id = 1');
    res.json({ balance: result.rows[0].balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
