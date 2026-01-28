const express = require('express');
const router = express.Router();
const pool = require('../db');
const io = require('../server').io; // import socket.io instance

// Purchase endpoint
router.post('/', async (req, res) => {
  const qty = req.body.quantity;
  try {
    const result = await pool.query('SELECT balance FROM stock WHERE id = 1');
    let balance = result.rows[0].balance;

    if (qty <= balance) {
      balance -= qty;
      await pool.query('UPDATE stock SET balance = $1 WHERE id = 1', [balance]);
      io.emit('stockUpdate', balance); // notify all listeners
      res.json({ success: true, balance });
    } else {
      res.status(400).json({ error: 'Not enough stock' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
