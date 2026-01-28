// Connect to backend on Render
const socket = io('https://inventory-update.onrender.com');

// Fetch current stock balance when page loads
function loadStock() {
  fetch('https://inventory-update.onrender.com/stock')
    .then(res => res.json())
    .then(data => {
      document.getElementById('balance').textContent = data.balance;
    })
    .catch(err => console.error('Error fetching stock:', err));
}

// Purchase function triggered by button click
function purchaseItem(qty) {
  fetch('https://inventory-update.onrender.com/purchase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity: qty })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      document.getElementById('balance').textContent = data.balance;
    } else {
      alert(data.error);
    }
  })
  .catch(err => console.error('Error making purchase:', err));
}

// Listen for real-time stock updates from backend
socket.on('stockUpdate', (newBalance) => {
  document.getElementById('balance').textContent = newBalance;
});

// Load stock balance on page load
window.onload = loadStock;
