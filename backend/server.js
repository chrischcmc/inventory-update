const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // or specify your frontend URL if deployed separately
    methods: ['GET', 'POST']
  }
});

app.use(express.json());

// Make io available to routes
module.exports.io = io;

// Import routes
const purchaseRoutes = require('./routes/purchase');
const stockRoutes = require('./routes/stock');

// Mount routes
app.use('/purchase', purchaseRoutes);
app.use('/stock', stockRoutes);

// Serve static frontends
app.use('/purchase-ui', express.static(path.join(__dirname, '../frontend-purchase')));
app.use('/view-ui', express.static(path.join(__dirname, '../frontend-view')));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
