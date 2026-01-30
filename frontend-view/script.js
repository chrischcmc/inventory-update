// Connect to backend Socket.IO
const socket = io('https://inventory-update.onrender.com');

// Fetch current stock balances when page loads
function loadStock() {
  fetch('https://inventory-update.onrender.com/stock')
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const tbody = document.querySelector('#inventory tbody');
        tbody.innerHTML = ''; // clear existing rows
        data.stock.forEach(item => {
          const row = document.createElement('tr');
          row.id = `item-${item.item_name}`;
          row.innerHTML = `<td>${item.item_name}</td><td>${item.balance}</td>`;
          tbody.appendChild(row);
        });
      } else {
        console.error('Failed to load stock:', data.error);
      }
    })
    .catch(err => console.error('Error fetching stock:', err));
}

// Listen for real-time stock updates from backend
socket.on('stockUpdate', (update) => {
  const row = document.getElementById(`item-${update.product}`);
  if (row) {
    row.innerHTML = `<td>${update.product}</td><td>${update.balance}</td>`;
  }
});

// Load stock balances on page load
window.onload = loadStock;
