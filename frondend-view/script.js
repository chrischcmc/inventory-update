const socket = io();

socket.on('stockUpdate', (balance) => {
  document.getElementById('stock').innerText = balance;
});

// Initial fetch
fetch('/stock')
  .then(res => res.json())
  .then(data => document.getElementById('stock').innerText = data.balance);
