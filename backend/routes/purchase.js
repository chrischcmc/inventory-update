const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const io = require('../server').io; // import io from server.js

// Database connection
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

router.post('/', async (req, res) => {
  const { product, quantity } = req.body;

  if (!product || !quantity || quantity <= 0) {
    return res.json({ success: false, error: 'Invalid product or quantity' });
  }

  try {
    // 1. Get current balance
    const result = await db.query(
      'SELECT balance FROM stock WHERE item_name = $1',
      [product]
    );

    if (result.rows.length === 0) {
      return res.json({ success: false, error: 'Product not found' });
    }

    const currentBalance = result.rows[0].balance;

    // 2. Check if enough stock
    if (currentBalance < quantity) {
      return res.json({ success: false, error: 'Insufficient stock' });
    }

    // 3. Update balance
    const newBalance = currentBalance - quantity;
    await db.query(
      'UPDATE stock SET balance = $1 WHERE item_name = $2',
      [newBalance, product]
    );

    // 4. Emit real-time update
    io.emit('stockUpdate', { product, balance: newBalance });

    // 5. Respond to client
    res.json({ success: true, balance: newBalance });
  } catch (err) {
    console.error('Purchase error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
