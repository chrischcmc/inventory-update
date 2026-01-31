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
  console.log('🛒 Incoming purchase request:', { product, quantity });

  if (!product || !quantity || quantity <= 0) {
    console.log('❌ Invalid purchase request');
    return res.json({ success: false, error: 'Invalid product or quantity' });
  }

  try {
    // 1. Get current balance
    const result = await db.query(
      'SELECT balance FROM stock WHERE item_name = $1',
      [product]
    );
    console.log('📦 Current balance fetched:', result.rows);

    if (result.rows.length === 0) {
      console.log('❌ Product not found:', product);
      return res.json({ success: false, error: 'Product not found' });
    }

    const currentBalance = result.rows[0].balance;

    // 2. Check if enough stock
    if (currentBalance < quantity) {
      console.log('⚠️ Insufficient stock for', product);
      return res.json({ success: false, error: 'Insufficient stock' });
    }

    // 3. Update balance
    const newBalance = currentBalance - quantity;
    await db.query(
      'UPDATE stock SET balance = $1 WHERE item_name = $2',
      [newBalance, product]
    );
    console.log('✅ Balance updated:', { product, newBalance });

    // 4. Emit real-time update (use item_name to match frontend row IDs)
    const updatePayload = { item_name: product, balance: newBalance };
    io.emit('stockUpdate', updatePayload);
    console.log('📡 Emitted stockUpdate:', updatePayload);

    // 5. Respond to client
    res.json({ success: true, balance: newBalance });
  } catch (err) {
    console.error('❌ Purchase error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
