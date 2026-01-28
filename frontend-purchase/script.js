// Connect to backend Socket.IO
const socket = io('https://inventory-update.onrender.com');

// Listen for real-time stock updates
socket.on('stockUpdate', (newBalance) => {
  document.getElementById('msg').innerText = `Balance updated: ${newBalance}`;
});

async function purchase() {
  const qty = document.getElementById('qty').value;
  const res = await fetch('/purchase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity: parseInt(qty) })
  });
  const data = await res.json();
  document.getElementById('msg').innerText =
    data.success ? `Purchase successful. Balance: ${data.balance}` : data.error;
}
