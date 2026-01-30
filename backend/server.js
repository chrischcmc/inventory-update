const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config();
const { Pool } = require('pg');   // <-- add this

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(express.json());

// Database connection
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Make io available to routes
module.exports.io = io;

// Import routes
const purchaseRoutes = require('./routes/purchase');
const stockRoutes = require('./routes/stock');

// Mount routes
app.use('/purchase', purchaseRoutes);
app.use('/stock', stockRoutes);

// Products endpoint
app.get('/products', async (req, res) => {
  try {
    const result = await db.query('SELECT item_name FROM stock ORDER BY id');
    const products = result.rows.map(row => row.item_name);
    res.json({ success: true, products });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, error: 'Failed to load products' });
  }
});

// Serve static frontends
app.use('/purchase-ui', express.static(path.join(__dirname, '../frontend-purchase')));
app.use('/view-ui', express.static(path.join(__dirname, '../frontend-view')));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
