// Old (local)
// const socket = io('http://localhost:3000');

// New (Render)
const socket = io('https://inventory-update.onrender.com');

socket.on('stockUpdate', (balance) => {
  document.getElementById('stock').innerText = balance;
});

// Initial fetch
fetch('/stock')
  .then(res => res.json())
  .then(data => document.getElementById('stock').innerText = data.balance);
